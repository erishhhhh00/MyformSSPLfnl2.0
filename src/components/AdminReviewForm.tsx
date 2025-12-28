import React, { useState } from 'react';
import { FormProvider } from '@/context/FormContext';
import { AuthProvider } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@/context/FormContext';
import { ArrowLeft, CheckCircle, Download, Shield } from 'lucide-react';
import { FormData } from '@/types/form';
import { api } from '@/lib/api';

interface SubmissionRecord {
  id: string;
  applicationId: string;
  formData: FormData;
  submittedAt: string;
  status: 'pending_review' | 'approved';
  learnerName: string;
  companyName: string;
}

interface AdminReviewFormProps {
  submission: SubmissionRecord;
  onBack: () => void;
}

const AdminReviewForm: React.FC<AdminReviewFormProps> = ({ submission, onBack }) => {
  const [formData, setFormData] = useState<FormData>(submission.formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { generatePDF } = useForm();

  const handleAdminFieldChange = (page: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [page]: {
        ...prev[page as keyof FormData],
        [field]: value
      }
    }));
  };

  const handleDownloadForm = async () => {
    setIsSubmitting(true);
    try {
      // Update submission status via server API (NO localStorage)
      // Note: submission.id could be studentId or uid depending on context
      // For now we just generate PDF, status update happens via dashboard actions
      
      // Generate and download PDF with updated form data
      await generatePDF(formData);
      
      toast({
        title: "Form successfully downloaded",
        description: `Application ${submission.applicationId} has been processed and downloaded as PDF.`,
      });
      
      // Go back to dashboard after successful download
      setTimeout(() => {
        onBack();
      }, 2000);
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "An unexpected error occurred while generating the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthProvider>
      <FormProvider initialData={formData}>
        <div className="min-h-screen bg-background p-4 space-y-6">
          <div className="max-w-4xl mx-auto">
            {/* Admin Banner */}
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-red-800">🔴 You are viewing this form as Admin</h3>
                  <p className="text-sm text-red-600">Review and edit admin fields before final submission</p>
                </div>
              </div>
            </div>

            {/* Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
                
                <div className="text-right">
                  <div className="text-lg font-semibold">{submission.applicationId}</div>
                  <div className="text-sm text-muted-foreground">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold">Admin Review - {submission.applicationId}</h2>
                  <p className="text-muted-foreground">Review and finalize the form before sending</p>
                </div>
              </div>

              {/* Admin Editable Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Assessor Name (Admin Only)</Label>
                    <Input 
                      value={formData.page1.assessorName}
                      onChange={(e) => handleAdminFieldChange('page1', 'assessorName', e.target.value)}
                      className="mt-1 bg-yellow-50 border-yellow-300 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Assessor ID Number (Admin Only)</Label>
                    <Input 
                      value={formData.page1.assessorIdNumber}
                      onChange={(e) => handleAdminFieldChange('page1', 'assessorIdNumber', e.target.value)}
                      className="mt-1 bg-yellow-50 border-yellow-300 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Moderator Name (Admin Only)</Label>
                    <Input 
                      value={formData.page1.moderatorName}
                      onChange={(e) => handleAdminFieldChange('page1', 'moderatorName', e.target.value)}
                      className="mt-1 bg-yellow-50 border-yellow-300 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Moderator ID Number (Admin Only)</Label>
                    <Input 
                      value={formData.page1.moderatorIdNumber}
                      onChange={(e) => handleAdminFieldChange('page1', 'moderatorIdNumber', e.target.value)}
                      className="mt-1 bg-yellow-50 border-yellow-300 focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Summary of Learner Information */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Learner Information (Read-Only)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span className="font-medium">Name:</span> {formData.page1.learnerName}</div>
                    <div><span className="font-medium">ID Number:</span> {formData.page1.idNumber}</div>
                    <div><span className="font-medium">Company:</span> {formData.page1.companyName}</div>
                    <div><span className="font-medium">Date:</span> {formData.page1.date}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button 
                  onClick={handleDownloadForm}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Processing...' : 'Download Form'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </FormProvider>
    </AuthProvider>
  );
};

export default AdminReviewForm;