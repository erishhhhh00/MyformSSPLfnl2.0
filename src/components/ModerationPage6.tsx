import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useModerationForm } from '@/context/ModerationFormContext';

const defaultModeratorReview = {
  q1: { y: false, n: false, comment: '' },
  q2: { y: false, n: false, comment: '' },
  q3: { y: false, n: false, comment: '' },
  q4: { y: false, n: false, comment: '' },
  q5: { y: false, n: false, comment: '' },
  q6: { y: false, n: false, comment: '' }
};

const ModerationPage6: React.FC = () => {
  const { formData, updateFormData } = useModerationForm();
  const rawPageData = formData.moderationPage6 || {};
  const pageData = {
    feedbackToAssessor: rawPageData.feedbackToAssessor || '',
    assessorDate: rawPageData.assessorDate || '',
    assessorSignature: rawPageData.assessorSignature || '',
    moderatorReview: rawPageData.moderatorReview || defaultModeratorReview,
    moderatorSignature: rawPageData.moderatorSignature || '',
    moderatorDate: rawPageData.moderatorDate || '',
    assessorSignature2: rawPageData.assessorSignature2 || '',
    assessorDate2: rawPageData.assessorDate2 || ''
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('moderationPage6', { ...pageData, [field]: value });
  };

  const handleCheckboxChange = (question: string, field: string, checked: boolean) => {
    updateFormData('moderationPage6', {
      ...pageData,
      moderatorReview: {
        ...pageData.moderatorReview,
        [question]: {
          ...pageData.moderatorReview[question],
          [field]: checked
        }
      }
    });
  };

  const handleCommentChange = (question: string, value: string) => {
    updateFormData('moderationPage6', {
      ...pageData,
      moderatorReview: {
        ...pageData.moderatorReview,
        [question]: {
          ...pageData.moderatorReview[question],
          comment: value
        }
      }
    });
  };

  const reviewQuestions = [
    { id: 'q1', text: 'Did the planning and preparation for this moderation meet the requirements of the overall moderation system currently in place?' },
    { id: 'q2', text: 'Did my planning for this moderation enable me to complete a manageable moderation resulting in a fair judgment?' },
    { id: 'q3', text: 'Did the moderation technique(s) and instruments used, uphold the principles of assessment?' },
    { id: 'q4', text: 'Were there any unforeseen events during the moderation that could have compromised the principle of validity?' },
    { id: 'q5', text: 'Am I satisfied that the nature and quality of advice and support that I provided the Assessor(s) facilitated a common understanding of the assessment process in accordance with good assessment principles?' },
    { id: 'q6', text: 'Am I satisfied that this moderation was recorded and reported in a manner that meets confidentiality requirements as well as the requirements for Vodafone verification?' }
  ];

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 print:p-1 print:space-y-1">
      <Card className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 border-2 border-form-border h-full">
        {/* Header with Logo */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/images/logo.png" 
              alt="SSIPL Logo" 
              className="object-contain"
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        </div>

        {/* Section 9: MODERATION FEEDBACK TO ASSESSOR */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-3 italic">9. MODERATION FEEDBACK TO ASSESSOR</h3>
          
          <div className="border-2 border-form-border mb-4">
            <div className="p-2 border-b border-form-border">
              <Label className="text-sm font-bold italic">Feedback comments from Assessor:</Label>
            </div>
            <div className="p-3 min-h-[120px]">
              <Textarea
                value={pageData.feedbackToAssessor}
                onChange={(e) => handleInputChange('feedbackToAssessor', e.target.value)}
                className="border-0 min-h-[100px] w-full"
                placeholder="Enter feedback comments..."
              />
            </div>
          </div>

          <div className="border-2 border-form-border">
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-2 border-r border-form-border">
                <Label className="text-sm font-bold italic">DATE:</Label>
              </div>
              <div className="p-2">
                <Input
                  type="date"
                  value={pageData.assessorDate}
                  onChange={(e) => handleInputChange('assessorDate', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 border-r border-form-border">
                <Label className="text-sm font-bold italic">SIGNATURE of ASSESSOR:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.assessorSignature}
                  onChange={(e) => handleInputChange('assessorSignature', e.target.value)}
                  className="border-0 h-7"
                  placeholder="Signature"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 10: MODERATOR'S REVIEW REPORT */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-3 italic">10. MODERATOR'S REVIEW REPORT</h3>
          
          <div className="border-2 border-form-border">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-gray-100 border-b border-form-border">
              <div className="col-span-1 p-2 border-r border-form-border">
                <Label className="text-xs font-bold italic">MODERATION ASPECTS</Label>
              </div>
              <div className="p-2 border-r border-form-border text-center">
                <Label className="text-xs font-bold">Y</Label>
              </div>
              <div className="p-2 border-r border-form-border text-center">
                <Label className="text-xs font-bold">N</Label>
              </div>
              <div className="p-2 text-center">
                <Label className="text-xs font-bold">COMMENT</Label>
              </div>
            </div>

            {/* Review Questions */}
            {reviewQuestions.map((question) => (
              <div key={question.id} className="grid grid-cols-4 border-t border-form-border">
                <div className="col-span-1 p-2 border-r border-form-border">
                  <Label className="text-xs">{question.text}</Label>
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.moderatorReview[question.id]?.y || false}
                    onCheckedChange={(checked) => handleCheckboxChange(question.id, 'y', checked as boolean)}
                  />
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.moderatorReview[question.id]?.n || false}
                    onCheckedChange={(checked) => handleCheckboxChange(question.id, 'n', checked as boolean)}
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={pageData.moderatorReview[question.id]?.comment || ''}
                    onChange={(e) => handleCommentChange(question.id, e.target.value)}
                    className="border-0 h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Moderator Signature:</Label>
            <div className="flex-1 border-b-2 border-form-border">
              <Input
                value={pageData.moderatorSignature}
                onChange={(e) => handleInputChange('moderatorSignature', e.target.value)}
                className="border-0 h-8"
                placeholder=""
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Date:</Label>
            <div className="flex-1 border-b-2 border-form-border">
              <Input
                type="date"
                value={pageData.moderatorDate}
                onChange={(e) => handleInputChange('moderatorDate', e.target.value)}
                className="border-0 h-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Label className="text-sm font-medium">Assessor Signature:</Label>
            <div className="flex-1 border-b-2 border-form-border">
              <Input
                value={pageData.assessorSignature2}
                onChange={(e) => handleInputChange('assessorSignature2', e.target.value)}
                className="border-0 h-8"
                placeholder=""
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Date:</Label>
            <div className="flex-1 border-b-2 border-form-border">
              <Input
                type="date"
                value={pageData.assessorDate2}
                onChange={(e) => handleInputChange('assessorDate2', e.target.value)}
                className="border-0 h-8"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-form-border">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">6 | Page</p>
            <p className="font-semibold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
            <p>Format created on - 01/11/2025</p>
            <p>Format updated on - NA</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage6;
