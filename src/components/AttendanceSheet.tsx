import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { api, API_BASE } from '@/lib/api';
import socket from '@/lib/socket';
import { CheckCircle, FileText, QrCode, Send, Download, Loader2 } from 'lucide-react';

interface AttendanceSheetProps {
  prefillUid?: string;
  onComplete?: () => void;
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ prefillUid = '', onComplete }) => {
  const [formData, setFormData] = useState({
    dateFrom: '',
    dateTo: '',
    clientName: '',
    trainingLocation: '',
    trainingCircle: '',
    trainingCoordinator: '',
    ssiplTrainer: '',
    uid: '',
    attendees: Array(10).fill(null).map(() => ({
      learnerName: '',
      companyName: '',
      designation: '',
      employeeId: '',
      phoneNumber: '',
      email: '',
      govtId: '',
      emergencyContact: ''
    }))
  });

  useEffect(() => {
    if (prefillUid) {
      setFormData(prev => ({ ...prev, uid: prefillUid }));
    }
  }, [prefillUid]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttendeeChange = (index: number, field: string, value: string) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees[index] = { ...updatedAttendees[index], [field]: value };
    setFormData(prev => ({ ...prev, attendees: updatedAttendees }));
  };

  const [saving, setSaving] = useState(false);
  const [qrLink, setQrLink] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [sendingToAdmin, setSendingToAdmin] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save function with debounce (1.5 seconds after last change)
  const autoSave = useCallback(async () => {
    if (!formData.uid) return;

    setAutoSaving(true);
    try {
      await api.saveAttendance(formData.uid, formData);
      console.log('✅ Auto-saved attendance');
    } catch (e) {
      console.error('Auto-save failed:', e);
    } finally {
      setAutoSaving(false);
    }
  }, [formData]);

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (!formData.uid) return;

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (1.5 seconds debounce)
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 1500);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, autoSave]);

  const handleSave = async () => {
    if (!formData.uid) {
      alert('Please enter UID before saving');
      return;
    }
    setSaving(true);
    try {
      await api.saveAttendance(formData.uid, formData);
      // emit socket locally (server will also emit)
      socket.emit('attendance_saved', { uid: formData.uid });
      setShowThankYou(true);
    } catch (e) {
      console.error(e);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateQr = async () => {
    if (!formData.uid) return alert('UID required');
    try {
      const res = await fetch(`${API_BASE}/api/qr/${formData.uid}`, { method: 'POST' });
      const data = await res.json();
      setQrLink(data.link);
      if (data.qrCodeUrl) {
        setQrImage(data.qrCodeUrl);
      }
      alert(`✅ Link Generated!\n\n${data.link}\n\nShare this with users to fill the form.`);
    } catch (e) {
      console.error('QR generation failed', e);
      alert('QR generation failed');
    }
  };

  const handleGeneratePdf = async () => {
    if (!formData.uid) return alert('UID required');
    // Extra check: if formData is empty, alert
    if (!formData || Object.keys(formData).length === 0) {
      alert('Form data is empty! Please fill the form before generating PDF.');
      return;
    }
    setPdfGenerating(true);
    try {
      // Deep copy formData to avoid stale closure issues
      const payload = JSON.parse(JSON.stringify(formData));
      console.log('Sending formData for PDF:', payload);
      const res = await fetch(`${API_BASE}/api/pdf/attendance/${formData.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData: payload })
      });
      const data = await res.json();

      if (data.pdf) {
        // Convert base64 to blob and download
        const byteCharacters = atob(data.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename || `attendance_${formData.uid}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert('✅ PDF Downloaded Successfully!');
      } else {
        alert('Failed to generate PDF');
      }
    } catch (e) {
      console.error('PDF generation failed', e);
      alert('PDF generation failed');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleSendToAdmin = async () => {
    if (!formData.uid) return alert('UID required');
    setSendingToAdmin(true);
    try {
      // First save the attendance
      await api.saveAttendance(formData.uid, formData);

      // Send notification to Admin via socket
      socket.emit('attendance_sent_to_admin', {
        uid: formData.uid,
        attendance: formData,
        sentAt: new Date().toISOString()
      });

      // Also make an API call to notify server
      const res = await fetch(`${API_BASE}/api/attendance/${formData.uid}/send-to-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: formData })
      });

      alert(`✅ Attendance Sheet Saved & Sent to Admin!\n\nUID: ${formData.uid}`);

      // Redirect back to Assessor Dashboard
      if (onComplete) {
        onComplete();
      }
    } catch (e) {
      console.error('Send to admin failed', e);
      alert('Failed to send to admin');
    } finally {
      setSendingToAdmin(false);
    }
  };

  // Thank You Screen
  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-green-700">Thank You!</h1>
          <p className="text-lg text-gray-600">
            Attendance Sheet has been saved successfully for UID: <span className="font-bold text-blue-600">{formData.uid}</span>
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
            <p><strong>Client:</strong> {formData.clientName || 'N/A'}</p>
            <p><strong>Location:</strong> {formData.trainingLocation || 'N/A'}</p>
            <p><strong>Date:</strong> {formData.dateFrom || 'N/A'} to {formData.dateTo || 'N/A'}</p>
            <p><strong>Attendees:</strong> {formData.attendees.filter(a => a.learnerName).length} filled</p>
          </div>

          {/* QR Code Display */}
          {qrImage && (
            <div className="flex justify-center">
              <img src={qrImage} alt="QR Code" className="w-40 h-40 border rounded" />
            </div>
          )}
          {qrLink && (
            <p className="text-sm text-blue-600">
              Form Link: <a href={qrLink} target="_blank" rel="noreferrer" className="underline">{qrLink}</a>
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleGeneratePdf}
              disabled={pdfGenerating}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {pdfGenerating ? 'Generating...' : 'Download PDF'}
            </Button>

            <Button
              onClick={handleGenerateQr}
              variant="outline"
              className="flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Generate QR + Link
            </Button>

            <Button
              onClick={handleSendToAdmin}
              disabled={sendingToAdmin}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sendingToAdmin ? 'Sending...' : 'Send to Admin'}
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowThankYou(false)}
            className="text-gray-500"
          >
            ← Back to Edit Form
          </Button>

          {onComplete && (
            <Button
              variant="outline"
              onClick={onComplete}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto p-2 sm:p-4 space-y-4">
      {/* Auto-save indicator */}
      {autoSaving && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Auto-saving...</span>
        </div>
      )}

      <Card className="border-2 border-form-border bg-card p-4">
        <div className="form-content" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          {/* Header */}
          <div className="border-2 border-black mb-4">
            <div className="flex items-start justify-between p-3">
              <div className="flex-1">
                <h1 className="font-bold text-lg mb-2">
                  Rescue, Inspection, Safety, Elevation – Quality (RISE-Q) : ATTENDANCE SHEET
                </h1>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-40 shrink-0">Date of Training: From:</span>
                    <Input
                      type="date"
                      value={formData.dateFrom}
                      onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-40 shrink-0">To:</span>
                    <Input
                      type="date"
                      value={formData.dateTo}
                      onChange={(e) => handleInputChange('dateTo', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-40 shrink-0">Name of Client:</span>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-40 shrink-0">Location of Training:</span>
                    <Input
                      value={formData.trainingLocation}
                      onChange={(e) => handleInputChange('trainingLocation', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-40 shrink-0">Circle of Training:</span>
                    <Input
                      value={formData.trainingCircle}
                      onChange={(e) => handleInputChange('trainingCircle', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-40 shrink-0">Training Coordinator:</span>
                    <Input
                      value={formData.trainingCoordinator}
                      onChange={(e) => handleInputChange('trainingCoordinator', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="font-semibold w-40 shrink-0">SSIPL Trainer:</span>
                    <Input
                      value={formData.ssiplTrainer}
                      onChange={(e) => handleInputChange('ssiplTrainer', e.target.value)}
                      className="border-0 border-b border-black rounded-none bg-transparent text-xs flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <img
                  src="/images/logo.png"
                  alt="SSIPL Logo"
                  className="object-contain"
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            </div>

            {/* Declaration Text */}
            <div className="border-t-2 border-black p-3 space-y-2 text-xs">
              <p>
                <span className="font-semibold">I, the undersigned, hereby declare that I am medically and physically fit to perform all the exercises & activities at height included in tower climbing during the RISE-Q course.</span>
              </p>
              <p>
                I shall perform all the exercises & activities as per instructions given by the trainer & within the safety parameters specified by the trainer.
              </p>
              <p>
                I declare that that in case of any untoward incident or <span className="text-red-600 font-semibold">injury</span> on site or on tower during the training, the consequences of the same shall be solely my responsibility and I will not hold trainer/co trainer/ SSIPL or equipment liable for any damages or injury.
              </p>
            </div>
          </div>

          {/* Day 1 Section */}
          <div className="mb-4">
            <h2 className="text-center font-bold text-lg mb-3 bg-gray-100 py-2 border border-black">
              Day 1
            </h2>

            <div className="overflow-x-auto">
              <Table className="border-2 border-black w-full text-xs">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border border-black text-center font-bold w-12">Sr. No.</TableHead>
                    <TableHead className="border border-black text-center font-bold w-40">Learner Name</TableHead>
                    <TableHead className="border border-black text-center font-bold w-40">Company Name</TableHead>
                    <TableHead className="border border-black text-center font-bold w-32">Designation</TableHead>
                    <TableHead className="border border-black text-center font-bold w-28">Employee ID</TableHead>
                    <TableHead className="border border-black text-center font-bold w-32">Phone Number</TableHead>
                    <TableHead className="border border-black text-center font-bold w-40">Email</TableHead>
                    <TableHead className="border border-black text-center font-bold w-28">Govt ID</TableHead>
                    <TableHead className="border border-black text-center font-bold w-32">Emergency Contact</TableHead>
                    <TableHead className="border border-black text-center font-bold w-24">Signature</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.attendees.map((attendee, index) => (
                    <TableRow key={index}>
                      <TableCell className="border border-black text-center py-2">{index + 1}</TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.learnerName}
                          onChange={(e) => handleAttendeeChange(index, 'learnerName', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.companyName}
                          onChange={(e) => handleAttendeeChange(index, 'companyName', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.designation}
                          onChange={(e) => handleAttendeeChange(index, 'designation', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.employeeId}
                          onChange={(e) => handleAttendeeChange(index, 'employeeId', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.phoneNumber}
                          onChange={(e) => handleAttendeeChange(index, 'phoneNumber', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.email}
                          onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.govtId}
                          onChange={(e) => handleAttendeeChange(index, 'govtId', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <Input
                          value={attendee.emergencyContact}
                          onChange={(e) => handleAttendeeChange(index, 'emergencyContact', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="border border-black p-1">
                        <div className="h-10"></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer with UID and Signatures */}
          <div className="mt-6 mb-4 text-sm">
            {/* UID Row */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-semibold">UID:</span>
              <Input
                value={formData.uid}
                onChange={(e) => handleInputChange('uid', e.target.value)}
                className="border-0 border-b border-black rounded-none bg-transparent text-xs w-32"
              />
            </div>

            {/* Signatures Row - Equal */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-semibold mb-2">Signature</p>
                <div className="border-b border-black w-full h-12"></div>
              </div>
              <div>
                <p className="font-semibold mb-2">Signature</p>
                <div className="border-b border-black w-full h-12"></div>
              </div>
            </div>
          </div>

          {/* Footer Page Number */}
          <div className="text-right mt-4">
            <p className="text-xs">1 | P a g e</p>
            <p className="text-xs font-semibold mt-1">FARM-ToCliATS-V00</p>
          </div>

          {/* Action Buttons - Submit & Close */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
            <div className="flex justify-center gap-4">
              {onComplete && (
                <Button
                  onClick={onComplete}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-8 py-4 text-lg font-bold shadow-lg"
                >
                  Close
                </Button>
              )}
              <Button
                onClick={handleSendToAdmin}
                disabled={sendingToAdmin || !formData.uid}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-8 py-4 text-lg font-bold shadow-lg"
              >
                <Send className="w-6 h-6" />
                {sendingToAdmin ? 'Submitting...' : 'Submit Attendance'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceSheet;