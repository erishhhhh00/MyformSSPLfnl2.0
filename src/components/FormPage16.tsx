import React from 'react';
import { useForm } from '@/context/FormContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FormPage16: React.FC = () => {
  const { formData, updateFormData } = useForm();

  const handleInputChange = (field: string, value: any) => {
    updateFormData('page16', { [field]: value });
  };

  const handleCheckboxChange = (field: string, value: any) => {
    updateFormData('page16', { [field]: value });
  };

  const handleArrayChange = (category: string, index: number, field: string, value: any) => {
    const currentArray = formData.page16[category] || [];
    const updatedArray = [...currentArray];
    if (!updatedArray[index]) {
      updatedArray[index] = {};
    }
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    updateFormData('page16', { [category]: updatedArray });
  };

  // Initial satisfaction questions as per screenshot
  const initialSatisfactionQuestions = [
    'Is the knowledge gained useful with regard to your work environment?',
    'Are you satisfied with the assessment procedure?',
    'Did you receive accurate feedback on the assessment?',
    'Are you satisfied with the Assessor and the way the assessment was handled?'
  ];

  // Before Assessment questions as per screenshot
  const beforeAssessmentQuestions = [
    'Was there opportunity to formally apply for assessment?',
    'Was the assessment planning done and agreed upon?',
    'Was there clarity about which Standard was to be assessed?',
    'Was there any information regarding the assessment process and its relevance communicated to you?',
    'Did you receive feedback regarding the assessment, appeals procedures and re-assessment procedures?',
    'Was it made clear to you that you may lodge an appeal against the assessment and was the process communicated to you?',
    'Were you trained, and given an opportunity to complete a formative assessment?'
  ];

  // Before, during and/or after assessment questions as per screenshot
  const duringAfterQuestions = [
    'Confirm that the summative assessment was done by an approved Assessor?',
    'Encourage you to participate in and contribute to the assessment process?',
    'Stay in the background and not interfere with your activities during assessment?',
    'Behave in a positive and supportive way throughout the assessment process?',
    'Provide clear and constructive feedback on the outcome of your assessment?'
  ];

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2">
      <Card className="border-2 border-form-border bg-card p-1 sm:p-2 md:p-3">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="bg-red-500 text-white px-3 py-2 text-sm font-bold mr-3">SSIPL</div>
              <div className="text-xl font-bold">Shield Skills Institute</div>
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

        {/* Section 11: Learner Feedback on Assessment */}
        <div className="space-y-6">
          <div className="text-base font-bold mb-4">11. LEARNER FEEDBACK ON ASSESSMENT</div>
          
          {/* Initial Satisfaction Questions Table */}
          <Table className="table-fixed w-full text-sm border border-gray-400">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-400 text-left font-bold w-3/5 py-3">Questions</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">1</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">2</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">3</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">4</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSatisfactionQuestions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-400 text-left py-3 text-sm">{question}</TableCell>
                  <TableCell className="border border-gray-400 text-center py-3">
                    <Input
                      value={formData.page16[`satisfaction_${index}_1`] || ''}
                      onChange={(e) => handleInputChange(`satisfaction_${index}_1`, e.target.value)}
                      className="border-0 bg-transparent text-sm w-full text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-3">
                    <Input
                      value={formData.page16[`satisfaction_${index}_2`] || ''}
                      onChange={(e) => handleInputChange(`satisfaction_${index}_2`, e.target.value)}
                      className="border-0 bg-transparent text-sm w-full text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-3">
                    <Input
                      value={formData.page16[`satisfaction_${index}_3`] || ''}
                      onChange={(e) => handleInputChange(`satisfaction_${index}_3`, e.target.value)}
                      className="border-0 bg-transparent text-sm w-full text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-3">
                    <Input
                      value={formData.page16[`satisfaction_${index}_4`] || ''}
                      onChange={(e) => handleInputChange(`satisfaction_${index}_4`, e.target.value)}
                      className="border-0 bg-transparent text-sm w-full text-center"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Before Assessment Section */}
          <div className="mt-6">
            <div className="text-base font-bold mb-3">Before Assessment</div>
            <Table className="table-fixed w-full text-sm border border-gray-400">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-400 text-left font-bold w-4/5 py-3">Questions</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">Yes</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {beforeAssessmentQuestions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell className="border border-gray-400 text-left py-3 text-sm">{question}</TableCell>
                    <TableCell className="border border-gray-400 text-center py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">Yes</span>
                      <input 
                          type="checkbox" 
                          checked={formData.page16[`beforeAssessment_${index}_yes`] === 'yes'}
                          onChange={(e) => handleInputChange(`beforeAssessment_${index}_yes`, e.target.checked ? 'yes' : '')}
                          className="w-4 h-4"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="border border-gray-400 text-center py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">No</span>
                      <input 
                          type="checkbox" 
                          checked={formData.page16[`beforeAssessment_${index}_no`] === 'no'}
                          onChange={(e) => handleInputChange(`beforeAssessment_${index}_no`, e.target.checked ? 'no' : '')}
                          className="w-4 h-4"
                        />
                  </div>
                    </TableCell>
                  </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>

          {/* Before, during and/or after assessment Section */}
          <div className="mt-6">
            <div className="text-base font-bold mb-3">Before, during and/or after the assessment, did the Assessor:</div>
            <Table className="table-fixed w-full text-sm border border-gray-400">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-400 text-left font-bold w-4/5 py-3">Questions</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">Yes</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-3">No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {duringAfterQuestions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell className="border border-gray-400 text-left py-3 text-sm">{question}</TableCell>
                    <TableCell className="border border-gray-400 text-center py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">Yes</span>
                      <input 
                          type="checkbox" 
                          checked={formData.page16[`duringAfter_${index}_yes`] === 'yes'}
                          onChange={(e) => handleInputChange(`duringAfter_${index}_yes`, e.target.checked ? 'yes' : '')}
                          className="w-4 h-4"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="border border-gray-400 text-center py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">No</span>
                      <input 
                          type="checkbox" 
                          checked={formData.page16[`duringAfter_${index}_no`] === 'no'}
                          onChange={(e) => handleInputChange(`duringAfter_${index}_no`, e.target.checked ? 'no' : '')}
                          className="w-4 h-4"
                        />
                  </div>
                    </TableCell>
                  </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>

          {/* Learner Comments */}
          <div className="mt-6">
            <div className="text-sm mb-3">Learner: Please provide constructive comment and annotations or opt not to comment</div>
            <Textarea
              value={formData.page16.learnerComments || ''}
              onChange={(e) => handleInputChange('learnerComments', e.target.value)}
              className="min-h-[120px] text-sm border border-gray-400"
            />
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 mt-6">
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
          <div className="flex justify-end items-center text-sm mt-6">
            <div>Page | 16</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage16;