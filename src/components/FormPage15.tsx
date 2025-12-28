import React from 'react';
import { useForm } from '@/context/FormContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FormPage15: React.FC = () => {
  const { formData, updateFormData } = useForm();

  const handleInputChange = (field: string, value: any) => {
    updateFormData('page15', { [field]: value });
  };

  const handleCheckboxChange = (field: string, value: any) => {
    updateFormData('page15', { [field]: value });
  };

  // Assessment checklist items as per screenshot
  const assessmentItems = [
    'Equipment is fitted according to manufacturer\'s requirement and all relevant parts inspected',
    'Use of double lanyard fall arrest system, selecting safe anchor points while climbing up and down',
    'One pylon hook must be connected to a sufficient strong anchor point at all times while moving at height.',
    'Safety factors must be maintained',
    'Establish a safe work positioning by utilizing a work positioning lanyard together with a fall arrest system',
    'Work belt must be fitted at height to allow free movement of the worker\'s hands. A fall arrest system must be maintained while in the work positioning at all times'
  ];

  // Learner evaluation criteria as per screenshot
  const evaluationCriteria = [
    'How did you experience the time management of the course?',
    'How would you rate the standard of the training facility? (Applicable only if the training is happening at MediHSE Safety Centre of Excellence)',
    'What was your overall impression of the equipment used in the training?'
  ];

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 md:space-y-3 print:p-1 print:space-y-1">
      <Card className="p-1 sm:p-2 md:p-3 print:p-1 border-2 border-form-border">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-3 print:mb-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold mr-2">SSIPL</div>
              <div className="text-lg font-bold print:text-base">Shield Skills Institute</div>
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

        {/* Section 7: Workplace Application Assessment */}
        <div className="space-y-3 print:space-y-2">
          <div className="text-sm font-bold mb-3 print:text-xs print:mb-2">7. WORKPLACE APPLICATION ASSESSMENT</div>
          
          {/* Instructions */}
          <div className="bg-muted p-3 rounded text-xs print:text-xs print:p-2">
            <div className="font-bold mb-2">Instructions</div>
            <div className="space-y-1 text-xs">
              <div>1. The work place check list must be completed within 2 months after the knowledge and practical assessment</div>
              <div>2. All tasks must be performed at a worksite or in simulated work at height environment.</div>
              <div>3. Supervisor must record the learner's performance of each task.</div>
              <div className="font-bold">Note: Should the assessment take place on-site the work place check list does not need to be completed</div>
            </div>
          </div>

          {/* Assessment Checklist */}
          <div className="mb-3">
            <div className="text-xs font-bold mb-2">Fit personal protective equipment required for work at height; inspect it and use it correctly</div>
            <Table className="table-fixed w-full text-xs border border-gray-400">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-400 text-left font-bold w-4/5 py-1">Observation & site info</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/5 py-1">Tick</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="border border-gray-400 text-left py-1 text-xs">{item}</TableCell>
                    <TableCell className="border border-gray-400 text-center py-1">
                      <Checkbox 
                        checked={formData.page15[`assessmentItem${index}`] || false}
                        onCheckedChange={(checked) => handleCheckboxChange(`assessmentItem${index}`, checked)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </div>
              
          {/* Worksite and Job Description */}
          <div className="mb-3">
            <div className="text-xs font-bold mb-2">Worksite and job description:</div>
            <div className="text-xs mb-3">Supervisor must describe the relevant site information (for at least 1 site) where the above tasks were performed</div>
            
            {/* Site 1 */}
            <div className="space-y-2 mb-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs">Date:</Label>
                  <Input 
                    value={formData.page15.site1Date || ''}
                    onChange={(e) => handleInputChange('site1Date', e.target.value)}
                    className="h-8 text-xs border-0 bg-transparent border-b border-gray-400 rounded-none"
                  />
            </div>
                <div className="flex-1">
                  <Label className="text-xs">Place:</Label>
                <Input 
                    value={formData.page15.site1Place || ''}
                    onChange={(e) => handleInputChange('site1Place', e.target.value)}
                    className="h-8 text-xs border-0 bg-transparent border-b border-gray-400 rounded-none"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Job description:</Label>
                <Input 
                  value={formData.page15.site1JobDescription || ''}
                  onChange={(e) => handleInputChange('site1JobDescription', e.target.value)}
                  className="h-8 text-xs border-0 bg-transparent border-b border-gray-400 rounded-none"
                />
              </div>
            </div>

            {/* Site 2 */}
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs">Date:</Label>
              <Input 
                    value={formData.page15.site2Date || ''}
                    onChange={(e) => handleInputChange('site2Date', e.target.value)}
                    className="h-8 text-xs border-0 bg-transparent border-b border-gray-400 rounded-none"
              />
            </div>
                <div className="flex-1">
                  <Label className="text-xs">Place:</Label>
                <Input 
                    value={formData.page15.site2Place || ''}
                    onChange={(e) => handleInputChange('site2Place', e.target.value)}
                    className="h-8 text-xs border-0 bg-transparent border-b border-gray-400 rounded-none"
                />
              </div>
              </div>
              <div>
                <Label className="text-xs">Job description:</Label>
                <Input 
                  value={formData.page15.site2JobDescription || ''}
                  onChange={(e) => handleInputChange('site2JobDescription', e.target.value)}
                  className="h-8 text-xs border-0 bg-transparent border-b border-gray-400 rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Supervisor Information */}
          <div className="mb-3">
            <Table className="table-fixed w-full text-xs border border-gray-400">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/4 py-1">Supervisor Name</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/4 py-1">Supervisor ID number</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/4 py-1">Contact Information</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/4 py-1">Supervisor Signature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 py-1">
                    <Input 
                      value={formData.page15.supervisorName || ''}
                      onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                    <Input 
                      value={formData.page15.supervisorId || ''}
                      onChange={(e) => handleInputChange('supervisorId', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                    <Input 
                      value={formData.page15.supervisorContact || ''}
                      onChange={(e) => handleInputChange('supervisorContact', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                    <Input 
                      value={formData.page15.supervisorSignature || ''}
                      onChange={(e) => handleInputChange('supervisorSignature', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Section 8: Learner Evaluation */}
          <div className="space-y-3 print:space-y-2 mt-4">
            <div className="text-sm font-bold print:text-xs">8. LEARNER EVALUATION OF ASSESSMENT</div>
            
            <div className="text-xs mb-3">Learner Overall evaluation of the Assessment: 1-Needs Improvement;2-Satisfactory;3-Good;4-Excellent</div>

            <Table className="table-fixed w-full text-xs border border-gray-400">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-400 text-left font-bold w-3/5 py-1">Criteria</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/20 py-1">1</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/20 py-1">2</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/20 py-1">3</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-1/20 py-1">4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationCriteria.map((criteria, index) => (
                  <TableRow key={index}>
                    <TableCell className="border border-gray-400 text-left py-1 text-xs">{criteria}</TableCell>
                    <TableCell className="border border-gray-400 text-center py-1">
                      <Checkbox 
                        checked={formData.page15[`evaluation${index}`] === '1'}
                        onCheckedChange={(checked) => handleCheckboxChange(`evaluation${index}`, checked ? '1' : '')}
                      />
                    </TableCell>
                    <TableCell className="border border-gray-400 text-center py-1">
                      <Checkbox 
                        checked={formData.page15[`evaluation${index}`] === '2'}
                        onCheckedChange={(checked) => handleCheckboxChange(`evaluation${index}`, checked ? '2' : '')}
                      />
                    </TableCell>
                    <TableCell className="border border-gray-400 text-center py-1">
                      <Checkbox 
                        checked={formData.page15[`evaluation${index}`] === '3'}
                        onCheckedChange={(checked) => handleCheckboxChange(`evaluation${index}`, checked ? '3' : '')}
                      />
                    </TableCell>
                    <TableCell className="border border-gray-400 text-center py-1">
                      <Checkbox 
                        checked={formData.page15[`evaluation${index}`] === '4'}
                        onCheckedChange={(checked) => handleCheckboxChange(`evaluation${index}`, checked ? '4' : '')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 mt-4 print:mt-3">
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
            <div className="flex justify-end items-center text-xs print:text-[10px] mt-4">
              <div>Page | 15</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage15;