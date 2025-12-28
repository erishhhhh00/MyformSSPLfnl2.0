import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useModerationForm } from '@/context/ModerationFormContext';

const defaultAssessmentConductedCont = {
  q725: { yes: false, no: false, comment: '' }
};

const defaultAssessmentDocumentation = {
  q726: { yes: false, no: false, comment: '' },
  q727: { yes: false, no: false, comment: '' },
  q728: { yes: false, no: false, comment: '' },
  q729: { yes: false, no: false, comment: '' },
  q7210: { yes: false, no: false, comment: '' },
  q7211: { yes: false, no: false, comment: '' }
};

const defaultAssessmentReviews = {
  q731: { yes: false, no: false, comment: '' },
  q732: { yes: false, no: false, comment: '' },
  q733: { yes: false, no: false, comment: '' },
  q734: { yes: false, no: false, comment: '' },
  q735: { yes: false, no: false, comment: '' }
};

const defaultAssessmentFeedback = {
  q741: { yes: false, no: false, comment: '' },
  q742: { yes: false, no: false, comment: '' },
  q743: { yes: false, no: false, comment: '' },
  q744: { yes: false, no: false, comment: '' },
  q745: { yes: false, no: false, comment: '' },
  q746: { yes: false, no: false, comment: '' }
};

const ModerationPage4: React.FC = () => {
  const { formData, updateFormData } = useModerationForm();
  const rawPageData = formData.moderationPage4 || {};
  const pageData = {
    assessmentConductedCont: rawPageData.assessmentConductedCont || defaultAssessmentConductedCont,
    assessmentDocumentation: rawPageData.assessmentDocumentation || defaultAssessmentDocumentation,
    assessmentReviews: rawPageData.assessmentReviews || defaultAssessmentReviews,
    assessmentFeedback: rawPageData.assessmentFeedback || defaultAssessmentFeedback
  };

  const handleCheckboxChange = (section: string, question: string, field: string, checked: boolean) => {
    updateFormData('moderationPage4', {
      ...pageData,
      [section]: {
        ...pageData[section],
        [question]: {
          ...pageData[section][question],
          [field]: checked
        }
      }
    });
  };

  const handleCommentChange = (section: string, question: string, value: string) => {
    updateFormData('moderationPage4', {
      ...pageData,
      [section]: {
        ...pageData[section],
        [question]: {
          ...pageData[section][question],
          comment: value
        }
      }
    });
  };

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

        {/* Continuation of 7.2 Assessment Conducted */}
        <div className="mb-4">
          <div className="border-2 border-form-border">
            {/* Last question from previous page */}
            <div className="grid grid-cols-4 border-b border-form-border">
              <div className="col-span-1 p-2 border-r border-form-border">
                <Label className="text-xs">7.2.5. Did the assessment take place according to an assessment plan?</Label>
              </div>
              <div className="p-2 border-r border-form-border flex items-center justify-center">
                <Checkbox
                  checked={pageData.assessmentConductedCont.q725?.yes || false}
                  onCheckedChange={(checked) => handleCheckboxChange('assessmentConductedCont', 'q725', 'yes', checked as boolean)}
                />
              </div>
              <div className="p-2 border-r border-form-border flex items-center justify-center">
                <Checkbox
                  checked={pageData.assessmentConductedCont.q725?.no || false}
                  onCheckedChange={(checked) => handleCheckboxChange('assessmentConductedCont', 'q725', 'no', checked as boolean)}
                />
              </div>
              <div className="p-1">
                <Input
                  value={pageData.assessmentConductedCont.q725?.comment || ''}
                  onChange={(e) => handleCommentChange('assessmentConductedCont', 'q725', e.target.value)}
                  className="border-0 h-7 text-xs"
                />
              </div>
            </div>

            {/* Header Row */}
            <div className="grid grid-cols-4 bg-gray-100 border-b border-form-border">
              <div className="col-span-1 p-2 border-r border-form-border">
                <Label className="text-xs font-bold italic">MODERATION CRITERIA</Label>
              </div>
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

            {/* 7.2.6 - 7.2.11 Assessment Documentation */}
            {[
              { id: 'q726', text: '7.2.6. Was the assessment properly document and recorded?' },
              { id: 'q727', text: '7.2.7. Is the evidence submitted by the candidate valid? (Does it prove competence according to Vodafone\'s requirements?)' },
              { id: 'q728', text: '7.2.8. Is the evidence submitted by the candidate authentic? (No tip- ex used, no pencil writing used, changes initialled by various parties?)' },
              { id: 'q729', text: '7.2.9. Is the evidence submitted by the candidate current?' },
              { id: 'q7210', text: '7.2.10. Is there evidence that the Assessor used to make an assessment judgment sufficient according to the Vodafone Standard requirements?' },
              { id: 'q7211', text: '7.2.11. Does the evidence clearly indicate that the candidate was judged competent or not yet competent?' }
            ].map((question) => (
              <div key={question.id} className="grid grid-cols-4 border-t border-form-border">
                <div className="col-span-1 p-2 border-r border-form-border">
                  <Label className="text-xs">{question.text}</Label>
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentDocumentation[question.id]?.yes || false}
                    onCheckedChange={(checked) => handleCheckboxChange('assessmentDocumentation', question.id, 'yes', checked as boolean)}
                  />
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentDocumentation[question.id]?.no || false}
                    onCheckedChange={(checked) => handleCheckboxChange('assessmentDocumentation', question.id, 'no', checked as boolean)}
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={pageData.assessmentDocumentation[question.id]?.comment || ''}
                    onChange={(e) => handleCommentChange('assessmentDocumentation', question.id, e.target.value)}
                    className="border-0 h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7.3 Assessment Reviews */}
        <div className="mb-4">
          <div className="border-2 border-form-border">
            <div className="p-2 bg-gray-50 border-b border-form-border">
              <Label className="text-sm font-bold">7.3. Assessment Reviews</Label>
            </div>

            {[
              { id: 'q731', text: '7.3.1. Did the Assessor do an assessment review?' },
              { id: 'q732', text: '7.3.2. Did the Assessor identify strengths and weaknesses in the assessment process?' },
              { id: 'q733', text: '7.3.3. Did the Assessor identify strengths and weaknesses in the assessment instruments?' },
              { id: 'q734', text: '7.3.4. Did the Assessor identify strengths and weaknesses in the V/S used during assessment process?' },
              { id: 'q735', text: '7.3.5. Did the Assessor incorporate the feedback of his candidate in his assessment review? (What was the quality of the feedback received fromthecandidate?)' }
            ].map((question) => (
              <div key={question.id} className="grid grid-cols-4 border-t border-form-border">
                <div className="col-span-1 p-2 border-r border-form-border">
                  <Label className="text-xs">{question.text}</Label>
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentReviews[question.id]?.yes || false}
                    onCheckedChange={(checked) => handleCheckboxChange('assessmentReviews', question.id, 'yes', checked as boolean)}
                  />
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentReviews[question.id]?.no || false}
                    onCheckedChange={(checked) => handleCheckboxChange('assessmentReviews', question.id, 'no', checked as boolean)}
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={pageData.assessmentReviews[question.id]?.comment || ''}
                    onChange={(e) => handleCommentChange('assessmentReviews', question.id, e.target.value)}
                    className="border-0 h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7.4 Assessment Feedback */}
        <div className="mb-4">
          <div className="border-2 border-form-border">
            <div className="p-2 bg-gray-50 border-b border-form-border">
              <Label className="text-sm font-bold">7.4. Assessment Feedback</Label>
            </div>

            {[
              { id: 'q741', text: '7.4.1. Was the candidate given clear and constructive feedback and within the agreed timeframes?' },
              { id: 'q742', text: '7.4.2. Was the feedback given on all the outcomes and assessment criteria?' },
              { id: 'q743', text: '7.4.3. Was the appeals procedure accessible and explained to the candidate?' },
              { id: 'q744', text: '7.4.4. Were re-assessment options given to the candidate, judged as Not Yet Competent (NYC), and were these agreed upon?' },
              { id: 'q745', text: '7.4.5. Did the Assessors receive feedback from the candidate on the assessment process?' },
              { id: 'q746', text: '7.4.6. Assessor\'s decision reviewed' }
            ].map((question) => (
              <div key={question.id} className="grid grid-cols-4 border-t border-form-border">
                <div className="col-span-1 p-2 border-r border-form-border">
                  <Label className="text-xs">{question.text}</Label>
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentFeedback[question.id]?.yes || false}
                    onCheckedChange={(checked) => handleCheckboxChange('assessmentFeedback', question.id, 'yes', checked as boolean)}
                  />
                </div>
                <div className="p-2 border-r border-form-border flex items-center justify-center">
                  <Checkbox
                    checked={pageData.assessmentFeedback[question.id]?.no || false}
                    onCheckedChange={(checked) => handleCheckboxChange('assessmentFeedback', question.id, 'no', checked as boolean)}
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={pageData.assessmentFeedback[question.id]?.comment || ''}
                    onChange={(e) => handleCommentChange('assessmentFeedback', question.id, e.target.value)}
                    className="border-0 h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8 Header */}
        <div className="mb-4">
          <h3 className="text-base font-bold italic">8. MODERATION OF PERFORMANCE INDICATORS</h3>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-form-border">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">4 | Page</p>
            <p className="font-semibold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
            <p>Format created on - 01/11/2025</p>
            <p>Format updated on - NA</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage4;
