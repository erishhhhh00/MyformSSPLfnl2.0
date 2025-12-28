import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModerationForm } from '@/context/ModerationFormContext';

const defaultCandidates = Array.from({ length: 10 }, () => ({
  batchNo: '',
  candidateName: '',
  candidateSurname: '',
  dateOfAssessment: '',
  candidateIdNo: '',
  clientStandardName: '',
  assessorName: '',
  cNyc: ''
}));

const ModerationPage2: React.FC = () => {
  const { formData, updateFormData } = useModerationForm();
  const rawPageData = formData.moderationPage2 || {};
  const pageData = {
    moderatorName: rawPageData.moderatorName || '',
    moderatorRegistration: rawPageData.moderatorRegistration || '',
    moderationPurpose: rawPageData.moderationPurpose || 'Quality Assurance of assessment',
    assessorName: rawPageData.assessorName || '',
    assessorRegistration: rawPageData.assessorRegistration || '',
    dateOfModeration: rawPageData.dateOfModeration || '',
    numberOfPortfolios: rawPageData.numberOfPortfolios || 'of (at least 25% or a minimum of 3)',
    vodafoneStandardTitle: rawPageData.vodafoneStandardTitle || '',
    place: rawPageData.place || '',
    resources: rawPageData.resources || 'Assessment tools and Client Standard',
    batchNo: rawPageData.batchNo || '',
    candidates: rawPageData.candidates || defaultCandidates
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('moderationPage2', { ...pageData, [field]: value });
  };

  const handleCandidateChange = (index: number, field: string, value: string) => {
    const updatedCandidates = [...pageData.candidates];
    updatedCandidates[index] = { ...updatedCandidates[index], [field]: value };
    updateFormData('moderationPage2', { ...pageData, candidates: updatedCandidates });
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

        {/* Section 1: Moderator Details */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 italic">1. Moderator Details</h3>
          <div className="border-2 border-form-border">
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Name:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.moderatorName}
                  onChange={(e) => handleInputChange('moderatorName', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Registration Number:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.moderatorRegistration}
                  onChange={(e) => handleInputChange('moderatorRegistration', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Purpose of the moderation:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.moderationPurpose}
                  onChange={(e) => handleInputChange('moderationPurpose', e.target.value)}
                  className="border-0 h-7 italic"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Assessor Details */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 italic">2. Assessor Details</h3>
          <div className="border-2 border-form-border">
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Name:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.assessorName}
                  onChange={(e) => handleInputChange('assessorName', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Registration Number:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.assessorRegistration}
                  onChange={(e) => handleInputChange('assessorRegistration', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-form-border">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Date of Moderation:</Label>
              </div>
              <div className="p-2">
                <Input
                  type="date"
                  value={pageData.dateOfModeration}
                  onChange={(e) => handleInputChange('dateOfModeration', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 bg-gray-50 border-r border-form-border">
                <Label className="text-sm font-semibold italic">Number of portfolios to be moderated:</Label>
              </div>
              <div className="p-2">
                <Input
                  value={pageData.numberOfPortfolios}
                  onChange={(e) => handleInputChange('numberOfPortfolios', e.target.value)}
                  className="border-0 h-7"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Unit Standard */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 italic">3. Unit Standard</h3>
          <div className="border-2 border-form-border">
            <div className="p-2 bg-gray-50 border-b border-form-border">
              <Label className="text-sm font-semibold italic">Vodafone Standard title:</Label>
            </div>
            <div className="p-2 min-h-[60px]">
              <Textarea
                value={pageData.vodafoneStandardTitle}
                onChange={(e) => handleInputChange('vodafoneStandardTitle', e.target.value)}
                className="border-0 min-h-[50px]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SCOPE OF MODERATION */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 italic">4. SCOPE OF MODERATION</h3>
          <p className="text-sm font-semibold italic mb-2">Special arrangements for moderation</p>
          <div className="border-2 border-form-border mb-2">
            <div className="p-2 bg-gray-50 border-b border-form-border">
              <Label className="text-sm font-semibold italic">Place:</Label>
            </div>
            <div className="p-2">
              <Input
                value={pageData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                className="border-0 h-7"
              />
            </div>
          </div>
          <div className="border-2 border-form-border">
            <div className="p-2 bg-gray-50 border-b border-form-border">
              <Label className="text-sm font-semibold italic">Resources: Assessment tools and Client Standard</Label>
            </div>
            <div className="p-2">
              <Input
                value={pageData.resources}
                onChange={(e) => handleInputChange('resources', e.target.value)}
                className="border-0 h-7"
              />
            </div>
          </div>
        </div>

        {/* Section 5: BATCH NO Table */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-base font-bold italic">5. BATCH NO:</h3>
            <Input
              value={pageData.batchNo}
              onChange={(e) => handleInputChange('batchNo', e.target.value)}
              className="border-0 border-b border-form-border w-48 h-7"
            />
          </div>
          
          <div className="border-2 border-form-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-form-border p-1 w-8">Batch No.</th>
                  <th className="border border-form-border p-1">Candidate name:</th>
                  <th className="border border-form-border p-1">Candidate surname:</th>
                  <th className="border border-form-border p-1">Date of assessment:</th>
                  <th className="border border-form-border p-1">Candidate ID No:</th>
                  <th className="border border-form-border p-1">Client Standard Name:</th>
                  <th className="border border-form-border p-1">Assessor Name:</th>
                  <th className="border border-form-border p-1 w-12">C / NYC</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <tr key={num}>
                    <td className="border border-form-border p-1 text-center font-semibold">{num}</td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.candidates[num - 1]?.candidateName || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'candidateName', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.candidates[num - 1]?.candidateSurname || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'candidateSurname', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        type="date"
                        value={pageData.candidates[num - 1]?.dateOfAssessment || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'dateOfAssessment', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.candidates[num - 1]?.candidateIdNo || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'candidateIdNo', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.candidates[num - 1]?.clientStandardName || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'clientStandardName', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.candidates[num - 1]?.assessorName || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'assessorName', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                    <td className="border border-form-border p-1">
                      <Input
                        value={pageData.candidates[num - 1]?.cNyc || ''}
                        onChange={(e) => handleCandidateChange(num - 1, 'cNyc', e.target.value)}
                        className="border-0 h-6 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-form-border">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">2 | Page</p>
            <p className="font-semibold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
            <p>Format created on - 01/11/2025</p>
            <p>Format updated on - 01/11/2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage2;
