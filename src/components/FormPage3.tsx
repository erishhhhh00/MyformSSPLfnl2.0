import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@/context/FormContext';

const FormPage3: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page3;

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData('page3', { [field]: value });
  };

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 md:space-y-3">
      <Card className="border-2 border-form-border bg-card p-1 sm:p-2 md:p-3">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="bg-red-500 text-white px-3 py-1 text-sm font-bold mr-2">SSIPL</div>
              <div className="text-2xl font-bold">Shield Skills Institute</div>
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

      {/* Component Type Table */}
      <div className="mb-4">
        <table className="w-full border-2 border-form-border table-fixed">
          <thead>
            <tr className="bg-form-header">
              <th className="border border-form-border p-2 text-left font-semibold w-32">Component Type</th>
              <th className="border border-form-border p-2 text-left font-semibold">Type of Evidence</th>
              <th className="border border-form-border p-2 text-left font-semibold w-16">Tick</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-form-border p-2 font-semibold align-top w-32" rowSpan={2}>Knowledge</td>
              <td className="border border-form-border p-2">Written</td>
              <td className="border border-form-border p-2 text-center w-16">
                <Checkbox
                  checked={pageData.knowledgeWritten}
                  onCheckedChange={(checked) => handleInputChange('knowledgeWritten', checked as boolean)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-form-border p-2">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-shrink-0 w-48">Other (Please Specify type)</span>
                  <Input
                    value={pageData.knowledgeOtherSpecify}
                    onChange={(e) => handleInputChange('knowledgeOtherSpecify', e.target.value)}
                    className="flex-1 h-8 text-sm form-professional-input min-w-0"
                  />
                </div>
              </td>
              <td className="border border-form-border p-2 text-center w-16">
                <Checkbox
                  checked={pageData.knowledgeOtherTick}
                  onCheckedChange={(checked) => handleInputChange('knowledgeOtherTick', checked as boolean)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-form-border p-2 font-semibold align-top w-32" rowSpan={2}>Practical</td>
              <td className="border border-form-border p-2">Practical application</td>
              <td className="border border-form-border p-2 text-center w-16">
                <Checkbox
                  checked={pageData.practicalApplication}
                  onCheckedChange={(checked) => handleInputChange('practicalApplication', checked as boolean)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-form-border p-2">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-shrink-0 w-48">Others (Please Specify)</span>
                  <Input
                    value={pageData.practicalOthersSpecify}
                    onChange={(e) => handleInputChange('practicalOthersSpecify', e.target.value)}
                    className="flex-1 h-8 text-sm form-professional-input min-w-0"
                  />
                </div>
              </td>
              <td className="border border-form-border p-2 text-center w-16">
                <Checkbox
                  checked={pageData.practicalOthersTick}
                  onCheckedChange={(checked) => handleInputChange('practicalOthersTick', checked as boolean)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Learner Declaration of Authenticity */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">2. LEARNER DECLARATION OF AUTHENTICITY</h2>
        <p className="mb-4 text-sm">
          I declare that the evidence submitted for assessment purposes is my own work and authentic.
        </p>
        <div className="mb-4">
          <Label className="text-sm font-semibold">
            Please mention External Source referred (to be filled by Assessor only if external sources used for assessment)
          </Label>
          <Input
            value={pageData.externalSourceReferred}
            onChange={(e) => handleInputChange('externalSourceReferred', e.target.value)}
            className="mt-2 border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary"
          />
        </div>
      </div>

      {/* Assessment Contract */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">3. ASSESSMENT CONTRACT</h2>
        <p className="mb-4 text-sm">
          I declare that the assessment plan has been agreed upon by me and the Assessor as stated in the assessment 
          plan. I take upon myself to familiarize myself with the contract policies, Standards, assessment procedures 
          and appeals procedures, as it has been explained to me by the relevant Assessor/Facilitator/representative 
          of the Training and assessment Provider.
        </p>
        
        <p className="mb-4 text-sm">
          The criteria for both practical & written assessment has been explained & agreed upon by me. I have also 
          been explained that unless I fulfill the criteria for assessment, which includes both knowledge check 
          through written assessment & skill check through practical assessment, I will not be certified.
        </p>
        
        <p className="mb-4 text-sm font-semibold">
          I have been made aware of the assessment criterion which is as follows:
        </p>

        {/* Assessment Criteria Table */}
        <table className="w-full border-2 border-form-border mb-6">
          <thead>
            <tr className="bg-form-header">
              <th className="border border-form-border p-2 text-left font-semibold">Type of Assessment</th>
              <th className="border border-form-border p-2 text-left font-semibold">Methodology</th>
              <th className="border border-form-border p-2 text-left font-semibold">Minimum Pass Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-form-border p-2">Knowledge</td>
              <td className="border border-form-border p-2">Written</td>
              <td className="border border-form-border p-2">70%</td>
            </tr>
            <tr>
              <td className="border border-form-border p-2">Skill</td>
              <td className="border border-form-border p-2">Practical</td>
              <td className="border border-form-border p-2">100%</td>
            </tr>
          </tbody>
        </table>

        {/* Contract Policies */}
        <h3 className="text-base font-bold mb-4">3.1 Contract Policies</h3>
        
        <h4 className="text-sm font-bold mb-2">3.1.1. Your responsibilities as a learner</h4>
        <p className="text-sm mb-2">It is your responsibility to:</p>
        <ul className="text-sm mb-4 pl-4 space-y-1">
          <li>• Prepare for the assessment via training.</li>
          <li>• Attend the assessment at the agreed upon date, time and place</li>
          <li>• Ensure that all relevant parties including the Assessor is informed should you not be able to attend the assessment as per the assessment meeting.</li>
          <li>• Prepare a re-assessment plan should you be found not yet competent.</li>
          <li>• Apply for an appeal against the assessment result if the outcome is not satisfactory.</li>
        </ul>

        <h4 className="text-sm font-bold mb-2">3.1.2. Your right as a learner</h4>
        <p className="text-sm mb-4">You have the right to:</p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      {/* Footer */}
      <div className="mt-6 text-center border-t border-form-border pt-4">
        <div className="flex justify-end items-center text-sm">
          <span>Page | 3</span>
        </div>
      </div>
      </Card>
    </div>
  );
};

export default FormPage3;