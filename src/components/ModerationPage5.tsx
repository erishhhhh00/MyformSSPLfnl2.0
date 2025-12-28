import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useModerationForm } from '@/context/ModerationFormContext';

const defaultAssessmentPrinciples = {
  appropriateness: { yes: false, no: false, comment: '' },
  fairness: { yes: false, no: false, comment: '' },
  manageability: { yes: false, no: false, comment: '' },
  integration: { yes: false, no: false, comment: '' },
  validity: { yes: false, no: false, comment: '' },
  direct: { yes: false, no: false, comment: '' },
  authenticity: { yes: false, no: false, comment: '' },
  sufficient: { yes: false, no: false, comment: '' },
  systematic: { yes: false, no: false, comment: '' },
  open: { yes: false, no: false, comment: '' },
  consistent: { yes: false, no: false, comment: '' }
};

const ModerationPage5: React.FC = () => {
  const { formData, updateFormData } = useModerationForm();
  const rawPageData = formData.moderationPage5 || {};
  const pageData = {
    assessmentPrinciples: rawPageData.assessmentPrinciples || defaultAssessmentPrinciples,
    feedbackComments: rawPageData.feedbackComments || '',
    date: rawPageData.date || '',
    moderatorSignature: rawPageData.moderatorSignature || ''
  };

  const handleCheckboxChange = (principle: string, field: string, checked: boolean) => {
    updateFormData('moderationPage5', {
      ...pageData,
      assessmentPrinciples: {
        ...pageData.assessmentPrinciples,
        [principle]: {
          ...pageData.assessmentPrinciples[principle],
          [field]: checked
        }
      }
    });
  };

  const handleCommentChange = (principle: string, value: string) => {
    updateFormData('moderationPage5', {
      ...pageData,
      assessmentPrinciples: {
        ...pageData.assessmentPrinciples,
        [principle]: {
          ...pageData.assessmentPrinciples[principle],
          comment: value
        }
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('moderationPage5', { ...pageData, [field]: value });
  };

  const principles = [
    { key: 'appropriateness', label: 'Appropriateness' },
    { key: 'fairness', label: 'Fairness' },
    { key: 'manageability', label: 'Manageability' },
    { key: 'integration', label: 'Integration into work or learning' },
    { key: 'validity', label: 'Validity' },
    { key: 'direct', label: 'Direct' },
    { key: 'authenticity', label: 'Authenticity' },
    { key: 'sufficient', label: 'Sufficient' },
    { key: 'systematic', label: 'Systematic' },
    { key: 'open', label: 'Open' },
    { key: 'consistent', label: 'Consistent' }
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

        {/* Assessment Principles Table */}
        <div className="mb-4">
          <div className="mb-2">
            <Label className="text-sm italic">Did the Assessor comply with the assessment principles?</Label>
          </div>
          
          <div className="border-2 border-form-border">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-gray-100 border-b border-form-border">
              <div className="col-span-1 p-2 border-r border-form-border"></div>
              <div className="p-2 border-r border-form-border text-center">
                <Label className="text-xs font-bold">YES</Label>
              </div>
              <div className="p-2 border-r border-form-border text-center">
                <Label className="text-xs font-bold">NO</Label>
              </div>
              <div className="p-2 text-center">
                <Label className="text-xs font-bold">COMMENT</Label>
              </div>
            </div>

            {/* Principles Rows */}
            {principles.map((principle) => (
              <div key={principle.key} className="grid grid-cols-4 border-t border-form-border">
                <div className="col-span-1 p-2 border-r border-form-border">
                  <Label className="text-xs italic">{principle.label}</Label>
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentPrinciples[principle.key]?.yes || false}
                    onCheckedChange={(checked) => handleCheckboxChange(principle.key, 'yes', checked as boolean)}
                  />
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentPrinciples[principle.key]?.no || false}
                    onCheckedChange={(checked) => handleCheckboxChange(principle.key, 'no', checked as boolean)}
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={pageData.assessmentPrinciples[principle.key]?.comment || ''}
                    onChange={(e) => handleCommentChange(principle.key, e.target.value)}
                    className="border-0 h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-4 mt-8">
          <div className="border-2 border-form-border">
            <div className="p-2 border-b border-form-border">
              <Label className="text-sm font-bold italic">Feedback comments from Moderator:</Label>
            </div>
            <div className="p-3 min-h-[200px]">
              <Textarea
                value={pageData.feedbackComments}
                onChange={(e) => handleInputChange('feedbackComments', e.target.value)}
                className="border-0 min-h-[180px] w-full"
                placeholder="Enter feedback comments here..."
              />
            </div>
          </div>
        </div>

        {/* Date and Signature Section */}
        <div className="mb-4">
          <div className="border-2 border-form-border">
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-3 border-r border-form-border">
                <Label className="text-sm font-bold italic">DATE:</Label>
              </div>
              <div className="p-2">
                <Input
                  type="date"
                  value={pageData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="border-0 h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-3 border-r border-form-border">
                <Label className="text-sm font-bold italic">SIGNATURE of MODERATOR:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.moderatorSignature}
                  onChange={(e) => handleInputChange('moderatorSignature', e.target.value)}
                  className="border-0 h-8"
                  placeholder="Signature"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-form-border">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">5 | Page</p>
            <p className="font-semibold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
            <p>Format created on - 01/11/2025</p>
            <p>Format updated on - NA</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage5;
