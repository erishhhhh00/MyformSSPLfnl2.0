import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useModerationForm } from '@/context/ModerationFormContext';

const defaultModeratedPortfolios = Array.from({ length: 4 }, () => ({
  batchNo: '',
  candidateName: '',
  candidateSurname: '',
  dateOfAssessment: '',
  candidateId: '',
  vodafoneStandardName: '',
  assessorName: '',
  cNyc: ''
}));

const defaultIndividuals = [
  { name: '', reason: 'Moderator', action: 'Report to Assessor', plannedDate: '' },
  { name: '', reason: 'Stakeholder', action: 'General Correspondence', plannedDate: '' },
  { name: '', reason: 'Assessor', action: 'Feedback on assessment', plannedDate: '' }
];

const defaultAssessmentPlanning = {
  q711: { yes: false, no: false, comment: '' },
  q712: { yes: false, no: false, comment: '' },
  q713: { yes: false, no: false, comment: '' },
  q714: { yes: false, no: false, comment: '' },
  q715: { yes: false, no: false, comment: '' },
  q716: { yes: false, no: false, comment: '' }
};

const defaultAssessmentConducted = {
  q721: { yes: false, no: false, comment: '' },
  q722: { yes: false, no: false, comment: '' },
  q723: { yes: false, no: false, comment: '' },
  q724: { yes: false, no: false, comment: '' }
};

const ModerationPage3: React.FC = () => {
  const { formData, updateFormData } = useModerationForm();
  const rawPageData = formData.moderationPage3 || {};
  const pageData = {
    moderatedPortfolios: rawPageData.moderatedPortfolios || defaultModeratedPortfolios,
    individuals: rawPageData.individuals || defaultIndividuals,
    assessmentPlanning: rawPageData.assessmentPlanning || defaultAssessmentPlanning,
    assessmentConducted: rawPageData.assessmentConducted || defaultAssessmentConducted
  };

  const handlePortfolioChange = (index: number, field: string, value: string) => {
    const updated = [...pageData.moderatedPortfolios];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData('moderationPage3', { ...pageData, moderatedPortfolios: updated });
  };

  const handleIndividualChange = (index: number, field: string, value: string) => {
    const updated = [...pageData.individuals];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData('moderationPage3', { ...pageData, individuals: updated });
  };

  const handleCheckboxChange = (section: string, question: string, field: string, checked: boolean) => {
    updateFormData('moderationPage3', {
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
    updateFormData('moderationPage3', {
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

        {/* Section 6: MODERATED PORTFOLIOS */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 italic">6. MODERATED PORTFOLIOS:</h3>
          <div className="border-2 border-form-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-form-border p-1 w-8">Batch no.</th>
                  <th className="border border-form-border p-1">Candidate name:</th>
                  <th className="border border-form-border p-1">Candidate surname:</th>
                  <th className="border border-form-border p-1">Date of assessment:</th>
                  <th className="border border-form-border p-1">Candidate ID No:</th>
                  <th className="border border-form-border p-1">Vodafone Standard Name:</th>
                  <th className="border border-form-border p-1">Assessor Name:</th>
                  <th className="border border-form-border p-1 w-12">C / NYC</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((num) => (
                  <tr key={num}>
                    <td className="border border-form-border p-1 text-center font-semibold">{num}</td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.moderatedPortfolios[num - 1]?.candidateName || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'candidateName', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.moderatedPortfolios[num - 1]?.candidateSurname || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'candidateSurname', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        type="date"
                        value={pageData.moderatedPortfolios[num - 1]?.dateOfAssessment || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'dateOfAssessment', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.moderatedPortfolios[num - 1]?.candidateId || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'candidateId', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.moderatedPortfolios[num - 1]?.vodafoneStandardName || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'vodafoneStandardName', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.moderatedPortfolios[num - 1]?.assessorName || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'assessorName', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.moderatedPortfolios[num - 1]?.cNyc || ''}
                        onChange={(e) => handlePortfolioChange(num - 1, 'cNyc', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Individuals Section */}
        <div className="mb-4">
          <p className="text-sm font-bold italic mb-2">
            Individuals who need to be Involved with or Informed of this Moderation (as specified in your assessment QA policy and procedure)
          </p>
          <div className="border-2 border-form-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-form-border p-2">Initials & Name:</th>
                  <th className="border border-form-border p-2">Reason for their Involvement:</th>
                  <th className="border border-form-border p-2">Action required from Moderator:</th>
                  <th className="border border-form-border p-2">Planned Date for completion:</th>
                </tr>
              </thead>
              <tbody>
                {pageData.individuals.map((individual: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-form-border p-1">
                      <Input
                        value={individual.name}
                        onChange={(e) => handleIndividualChange(index, 'name', e.target.value)}
                        className="border-0 h-7 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={individual.reason}
                        onChange={(e) => handleIndividualChange(index, 'reason', e.target.value)}
                        className="border-0 h-7 text-xs font-semibold italic"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={individual.action}
                        onChange={(e) => handleIndividualChange(index, 'action', e.target.value)}
                        className="border-0 h-7 text-xs font-semibold italic"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        type="date"
                        value={individual.plannedDate}
                        onChange={(e) => handleIndividualChange(index, 'plannedDate', e.target.value)}
                        className="border-0 h-7 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7: MODERATION INSTRUMENT AND REPORT */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 italic">7. MODERATION INSTRUMENT AND REPORT</h3>
          
          <div className="border-2 border-form-border">
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

            {/* 7.1 Assessment planning */}
            <div className="border-b-2 border-form-border">
              <div className="p-2 bg-gray-50">
                <Label className="text-sm font-bold">7.1. Assessment planning</Label>
              </div>
              
              {[
                { id: 'q711', text: '7.1.1. Is there evidence that the candidate requested to be assessed?' },
                { id: 'q712', text: '7.1.2. Is there evidence that assessment planning was done before the assessment was conducted?' },
                { id: 'q713', text: '7.1.3. Is there evidence that the candidate was prepared and ready for assessment?' },
                { id: 'q714', text: '7.1.4. Is there evidence that the assessment plan was agreed on between the Assessor and the candidate before assessment?' },
                { id: 'q715', text: '7.1.5. Is there evidence that the candidate was informed of all evidence requirements and rights, prior to the assessment?' },
                { id: 'q716', text: '7.1.6. Does the evidence indicate that the candidate was informed about the assessment process and the implications of the assessments?' }
              ].map((question) => (
                <div key={question.id} className="grid grid-cols-4 border-t border-form-border">
                  <div className="col-span-1 p-2 border-r border-form-border">
                    <Label className="text-xs">{question.text}</Label>
                  </div>
                  <div className="p-2 border-r border-form-border flex items-center justify-center">
                    <Checkbox
                      checked={pageData.assessmentPlanning[question.id]?.yes || false}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentPlanning', question.id, 'yes', checked as boolean)}
                    />
                  </div>
                  <div className="p-2 border-r border-form-border flex items-center justify-center">
                    <Checkbox
                      checked={pageData.assessmentPlanning[question.id]?.no || false}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentPlanning', question.id, 'no', checked as boolean)}
                    />
                  </div>
                  <div className="p-1">
                    <Input
                      value={pageData.assessmentPlanning[question.id]?.comment || ''}
                      onChange={(e) => handleCommentChange('assessmentPlanning', question.id, e.target.value)}
                      className="border-0 h-7 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 7.2 Assessment Conducted */}
            <div>
              <div className="p-2 bg-gray-50">
                <Label className="text-sm font-bold">7.2. Assessment Conducted</Label>
              </div>
              
              {[
                { id: 'q721', text: '7.2.1. Were the registered Standards and properly designed assessment instruments available for the assessments?' },
                { id: 'q722', text: '7.2.2. Did the assessment methods and instruments used successfully address all relevant criteria and outcomes?' },
                { id: 'q723', text: '7.2.3. Does the evidence indicate that barriers to the assessments were taken into consideration?' },
                { id: 'q724', text: '7.2.4. Is there evidence that the assessment environment was life-like and conducive to a fair assessment?' }
              ].map((question) => (
                <div key={question.id} className="grid grid-cols-4 border-t border-form-border">
                  <div className="col-span-1 p-2 border-r border-form-border">
                    <Label className="text-xs">{question.text}</Label>
                  </div>
                  <div className="p-2 border-r border-form-border flex items-center justify-center">
                    <Checkbox
                      checked={pageData.assessmentConducted[question.id]?.yes || false}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentConducted', question.id, 'yes', checked as boolean)}
                    />
                  </div>
                  <div className="p-2 border-r border-form-border flex items-center justify-center">
                    <Checkbox
                      checked={pageData.assessmentConducted[question.id]?.no || false}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentConducted', question.id, 'no', checked as boolean)}
                    />
                  </div>
                  <div className="p-1">
                    <Input
                      value={pageData.assessmentConducted[question.id]?.comment || ''}
                      onChange={(e) => handleCommentChange('assessmentConducted', question.id, e.target.value)}
                      className="border-0 h-7 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-form-border">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">3 | Page</p>
            <p className="font-semibold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
            <p>Format created on - 01/11/2025</p>
            <p>Format updated on - 01/11/2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage3;
