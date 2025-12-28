import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from '@/context/FormContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateApplicationId } from '@/utils/applicationId';
import { CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

const FormPage17: React.FC = () => {
  const { formData, updateFormData, generatePDF } = useForm();
  const { toast } = useToast();
  const location = useLocation();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Hide submit button when on assessor review page OR admin submission review page (/user/:uid/:studentId)
  // Normal form fill is /user/:uid (2 segments), Review is /user/:uid/:studentId (3 segments after user)
  const isSubmissionReview = /^\/user\/[^/]+\/[^/]+/.test(location.pathname);
  const isAssessorReview = location.pathname.includes('/assessor-review') || isSubmissionReview || location.search.includes('role=assessor');

  const handleInputChange = (field: string, value: any) => {
    updateFormData('page17', { [field]: value });
  };

  const handleArrayChange = (index: number, field: string, value: any) => {
    const currentArray = formData.page17.specificOutcomes || [];
    const updatedArray = [...currentArray];
    if (!updatedArray[index]) {
      updatedArray[index] = {};
    }
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    updateFormData('page17', { specificOutcomes: updatedArray });
  };

  const specificOutcomes = [
    { id: 1, text: 'Explain the use of a range of fall arrest equipment and knowledge of applicable regulations regulating fall arrest equipment' },
    { id: 2, text: 'Explain and use basic rope knots' },
    { id: 3, text: 'Install and use fall arrest systems' },
    { id: 4, text: 'Perform pre-use inspection and assemble fall arrest equipment and systems' },
    { id: 5, text: 'Interpret and implement a fall arrest risk assessment' },
    { id: 6, text: 'Perform a basic fall arrest rescue to bring a casualty down to safety' },
    { id: 7, text: 'Select suitable anchor points' },
    { id: 8, text: 'Explain relevant regulations pertaining to Standards and country regulations.' },
    { id: 9, text: 'Demonstrate and explain safe access to various structures' },
    { id: 10, text: 'Conduct rope rigging practices in accordance with the legislative safety Standards and job requirements. This includes the inspection, selection and use of slings and lifting tackle to safely lift tools for up to 20kg' }
  ];

  const handleSend = async () => {
    // Prevent double submission
    if (isSubmitting || hasSubmitted) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique application ID
      const applicationId = generateApplicationId();

      // Create submission record
      const submissionRecord = {
        id: Date.now().toString(),
        applicationId,
        formData,
        submittedAt: new Date().toISOString(),
        status: 'pending_review' as const,
        learnerName: formData.page1.learnerName,
        companyName: formData.page1.companyName,
      };

      // Update form data with application ID
      const finalFormData = {
        ...formData,
        applicationId
      };

      // Save to backend using UID from page1
      const uid = formData.page1?.uid;
      if (uid) {
        await api.saveUserForm(uid, finalFormData);
      } else {
        console.warn('No UID found in formData.page1.uid; skipping backend save');
      }

      // Mark as submitted to prevent resubmission
      setHasSubmitted(true);

      // Replace current history entry to prevent back button
      window.history.replaceState(null, '', '/submitted');

      // Show success dialog
      setSubmissionId(applicationId);
      setShowSuccessDialog(true);

      // Auto-redirect after 5 seconds
      setTimeout(() => {
        window.location.replace('/');
      }, 5000);

    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false); // Re-enable button on error
      toast({
        title: "Submit Failed",
        description: "An unexpected error occurred while submitting the form.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    // Redirect to landing page using replace to prevent back
    window.location.replace('/');
  };

  // Auto-redirect after 5 seconds when success dialog is shown
  React.useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog]);

  return (
    <>
      <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-4 space-y-1 sm:space-y-2 md:space-y-4 print:p-2 print:space-y-2">
        <Card className="p-1 sm:p-2 md:p-4 print:p-2 border-2 border-form-border h-full">
          {/* Header */}
          <div className="text-center mb-2 sm:mb-4 print:mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold mr-2">SSIPL</div>
                  <div className="text-xl font-bold print:text-lg">Shield Skills Institute</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Shield Skills Institute Logo"
                  className="object-contain"
                  style={{ width: '87px', height: '73px' }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 print:space-y-2">
            {/* Section 9: Summative Assessment */}
            <div className="text-lg font-bold mb-4 print:text-base">9. SUMMATIVE ASSESSMENT AND FEEDBACK:</div>

            {/* Fall Arrest & Rescue Management Table */}
            <div className="border border-gray-300">
              <div className="bg-gray-100 p-2 font-bold text-sm text-center">
                FALL ARREST & RESCUE MANAGEMENT – TOWER CLIMBER (FARM-TOCLI)
              </div>

              {/* Specific Outcomes */}
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-4 gap-0 text-xs font-bold" style={{ gridTemplateColumns: '1fr 3fr 60px 60px' }}>
                  <div className="border-r border-gray-300 p-2 text-center font-bold text-sm">Specific Outcome 1</div>
                  <div className="border-r border-gray-300 p-2 font-normal">Explain the use of a range of fall arrest equipment and knowledge of applicable regulations regulating fall arrest equipment</div>
                  <div className="border-r border-gray-300 p-2 text-center">A</div>
                  <div className="p-2 text-center">NYA</div>
                </div>

                {specificOutcomes.map((outcome, index) => (
                  <div key={outcome.id} className="grid grid-cols-4 gap-0 text-xs border-t border-gray-300" style={{ gridTemplateColumns: '1fr 3fr 60px 60px' }}>
                    <div className="border-r border-gray-300 p-2 text-center">
                      <span className="font-bold text-sm">Specific Outcome {outcome.id}</span>
                    </div>
                    <div className="border-r border-gray-300 p-2">
                      <span className="text-xs">{outcome.text}</span>
                    </div>
                    <div className="border-r border-gray-300 p-2 flex justify-center items-center">
                      <Checkbox
                        checked={formData.page17.specificOutcomes?.[index]?.achieved || false}
                        onCheckedChange={(checked) => handleArrayChange(index, 'achieved', checked)}
                      />
                    </div>
                    <div className="p-2 flex justify-center items-center">
                      <Checkbox
                        checked={formData.page17.specificOutcomes?.[index]?.notAchieved || false}
                        onCheckedChange={(checked) => handleArrayChange(index, 'notAchieved', checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Knowledge Questionnaire Results */}
              <div className="border-b border-gray-300 p-2">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="font-bold">Knowledge Questionnaire Results</div>
                  <div className="flex items-center gap-2">
                    <span>A</span>
                    <input
                      type="radio"
                      name="knowledgeResults"
                      checked={formData.page17.knowledgeResults === 'achieved'}
                      onChange={() => handleInputChange('knowledgeResults', 'achieved')}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>NYA</span>
                    <input
                      type="radio"
                      name="knowledgeResults"
                      checked={formData.page17.knowledgeResults === 'not-achieved'}
                      onChange={() => handleInputChange('knowledgeResults', 'not-achieved')}
                    />
                  </div>
                  <div>
                    <span className="font-bold">Notes:</span>
                  </div>
                </div>
              </div>

              {/* Observation Checklist */}
              <div className="border-b border-gray-300 p-2">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="font-bold">Observation Checklist</div>
                  <div className="flex items-center gap-2">
                    <span>A</span>
                    <input
                      type="radio"
                      name="observationResults"
                      checked={formData.page17.observationResults === 'achieved'}
                      onChange={() => handleInputChange('observationResults', 'achieved')}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>NYA</span>
                    <input
                      type="radio"
                      name="observationResults"
                      checked={formData.page17.observationResults === 'not-achieved'}
                      onChange={() => handleInputChange('observationResults', 'not-achieved')}
                    />
                  </div>
                  <div>
                    <span className="font-bold">Notes:</span>
                  </div>
                </div>
              </div>

              {/* Assessment Result */}
              <div className="p-2">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="font-bold">Assessment Result</div>
                  <div>
                    <Input
                      type="date"
                      value={formData.page17.assessmentDate}
                      onChange={(e) => handleInputChange('assessmentDate', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="assessmentResult"
                        checked={formData.page17.assessmentResult === 'competent'}
                        onChange={() => handleInputChange('assessmentResult', 'competent')}
                      />
                      <span className="text-xs">Competent</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="assessmentResult"
                        checked={formData.page17.assessmentResult === 'not-competent'}
                        onChange={() => handleInputChange('assessmentResult', 'not-competent')}
                      />
                      <span className="text-xs">Not yet Competent</span>
                    </label>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Summative Assessment Results */}
            <div className="mt-4">
              <div className="font-bold text-sm mb-2">SUMMATIVE ASSESSMENT RESULTS</div>
              <div className="border border-gray-300 p-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Knowledge, Practical and workplace application has been completed and assessed</div>
                  <div>
                    <Label className="text-xs">DATE:</Label>
                    <Input
                      type="date"
                      value={formData.page17.summativeDate}
                      onChange={(e) => handleInputChange('summativeDate', e.target.value)}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="summativeResults"
                        checked={formData.page17.summativeResults === 'completed'}
                        onChange={() => handleInputChange('summativeResults', 'completed')}
                      />
                      <span className="text-xs">Completed</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="summativeResults"
                        checked={formData.page17.summativeResults === 'not-completed'}
                        onChange={() => handleInputChange('summativeResults', 'not-completed')}
                      />
                      <span className="text-xs">Not yet Completed</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderation */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Moderation Date:</Label>
                  <Input
                    type="date"
                    value={formData.page17.moderationDate}
                    onChange={(e) => handleInputChange('moderationDate', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Moderator Name:</Label>
                  <Input
                    value={formData.page17.moderatorName}
                    onChange={(e) => handleInputChange('moderatorName', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="border-2 border-form-border p-4">
                  <Label className="text-sm font-semibold mb-2 block">Moderator Signature:</Label>
                </div>
                <div className="border-b border-form-border mt-4"></div>
              </div>
            </div>

            {/* Final Signatures */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="mt-4">
                <div className="border-2 border-form-border p-4">
                  <Label className="text-sm font-semibold mb-2 block">Learner Signature</Label>
                </div>
                <div className="border-b border-form-border mt-4"></div>
              </div>
              <div className="mt-4">
                <div className="border-2 border-form-border p-4">
                  <Label className="text-sm font-semibold mb-2 block">Assessor / Facilitator Signature</Label>
                </div>
                <div className="border-b border-form-border mt-4"></div>
              </div>
            </div>

            {/* Send Button - Hidden in Assessor Review mode */}
            {!isAssessorReview && (
              <div className="text-center mt-8 print:hidden">
                <Button
                  onClick={handleSend}
                  disabled={isSubmitting || hasSubmitted}
                  size="lg"
                  className={`text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg ${isSubmitting || hasSubmitted
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : hasSubmitted ? 'Submitted ✓' : 'Submit Now'}
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-6 print:mt-4">
              <div className="text-sm font-bold">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
              <div className="text-xs text-muted-foreground mt-1">Page 17 of 17 - Version 1.0</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Dialog - Beautiful Thank You */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl">
          <div className="text-center py-8">
            {/* Animated Check Icon */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6 shadow-lg animate-pulse">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>

            {/* Thank You Message */}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-4">
              Thank You!
            </h2>

            <p className="text-gray-500 text-lg">
              Your form has been submitted successfully.
            </p>

            {/* Auto-redirect countdown */}
            <p className="text-sm text-gray-400 mt-6">
              Redirecting in 5 seconds...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormPage17;