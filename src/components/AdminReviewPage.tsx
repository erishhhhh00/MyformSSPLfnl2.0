import React, { useState } from 'react';
import { useSubmission } from '@/context/SubmissionContext';
import { useForm } from '@/context/FormContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendFormEmail, checkSMTPConnection } from '@/utils/emailService';
import { defaultSMTPConfig } from '@/config/smtpConfig';
import { CheckCircle, Clock, FileText } from 'lucide-react';

const AdminReviewPage: React.FC = () => {
  const { submissionStatus, submittedFormData, setSubmissionStatus } = useSubmission();
  const { formData, updateFormData, generatePDF } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminFieldChange = (page: string, field: string, value: any) => {
    updateFormData(page, { [field]: value });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Check SMTP connection first
      const connectionCheck = await checkSMTPConnection(defaultSMTPConfig);
      
      if (!connectionCheck.success) {
        toast({
          title: "SMTP server error",
          description: connectionCheck.error || "Please configure SMTP settings",
          variant: "destructive",
        });
        return;
      }

      // Generate and send PDF
      await generatePDF();
      const emailResult = await sendFormEmail(formData, defaultSMTPConfig);
      
      if (emailResult.success) {
        setSubmissionStatus('approved');
        toast({
          title: "Form has been finalized and emailed successfully",
          description: "The PDF has been generated and sent to the designated email address.",
        });
      } else {
        toast({
          title: "Send Failed",
          description: emailResult.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Final submit error:', error);
      toast({
        title: "Submit Failed",
        description: "An unexpected error occurred while processing the form.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus !== 'pending_review') {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            {submissionStatus === 'approved' ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-semibold">Form Approved & Sent</h3>
                <p className="text-muted-foreground">The form has been finalized and emailed successfully.</p>
              </>
            ) : (
              <>
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Pending Reviews</h3>
                <p className="text-muted-foreground">There are currently no forms pending admin review.</p>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-orange-600" />
          <div>
            <h2 className="text-2xl font-bold">Admin Review Required</h2>
            <p className="text-muted-foreground">Please review and edit the form as needed before final submission.</p>
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
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Assessor ID Number (Admin Only)</Label>
              <Input 
                value={formData.page1.assessorIdNumber}
                onChange={(e) => handleAdminFieldChange('page1', 'assessorIdNumber', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Moderator Name (Admin Only)</Label>
              <Input 
                value={formData.page1.moderatorName}
                onChange={(e) => handleAdminFieldChange('page1', 'moderatorName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Moderator ID Number (Admin Only)</Label>
              <Input 
                value={formData.page1.moderatorIdNumber}
                onChange={(e) => handleAdminFieldChange('page1', 'moderatorIdNumber', e.target.value)}
                className="mt-1"
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

          {/* Admin Notes */}
          <div>
            <Label className="text-sm font-medium">Admin Notes (Optional)</Label>
            <Textarea 
              placeholder="Add any additional notes or comments..."
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button 
            variant="outline"
            onClick={() => setSubmissionStatus('draft')}
          >
            Send Back for Revision
          </Button>
          <Button 
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Processing...' : 'Final Submit & Email PDF'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminReviewPage;