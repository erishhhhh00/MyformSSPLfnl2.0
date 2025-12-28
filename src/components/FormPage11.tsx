import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@/context/FormContext';

const FormPage11: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page11;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page11', { [field]: value });
  };

  const handleTableChange = (rowIndex: number, field: string, value: string) => {
    const updatedData = [...pageData.question32];
    if (!updatedData[rowIndex]) {
      updatedData[rowIndex] = {};
    }
    updatedData[rowIndex][field] = value;
    updateFormData('page11', { question32: updatedData });
  };

  const questions = [
    {
      id: 'question31',
      text: 'Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)',
      options: []
    }
  ];

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 md:space-y-3">
      <Card className="border-2 border-form-border bg-card p-1 sm:p-2 md:p-3">
        <div className="form-content" style={{ fontSize: '11px', lineHeight: '1.3' }}>
          {/* Header */}
          <div className="text-center mb-2 sm:mb-3 form-section">
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold mr-2">SSIPL</div>
                  <div className="text-lg font-bold">Shield Skills Institute</div>
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

          {/* Question 31 */}
          <div className="space-y-3 mb-6 form-section">
            <h3 className="font-bold text-sm leading-relaxed">31. Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)</h3>

            <RadioGroup
              value={pageData.question31}
              onValueChange={(value) => handleInputChange('question31', value)}
              className="flex justify-center my-3 space-x-6"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                  <img src="/images/image14.png" alt="Phone icon" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id="q31-a" />
                  <Label htmlFor="q31-a" className="font-medium cursor-pointer">A</Label>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                  <img src="/images/image15.png" alt="Warning hand" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id="q31-b" />
                  <Label htmlFor="q31-b" className="font-medium cursor-pointer">B</Label>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                  <img src="/images/image16.png" alt="Car icon" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="q31-c" />
                  <Label htmlFor="q31-c" className="font-medium cursor-pointer">C</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Question 32 - Risk Assessment Table */}
          <div className="space-y-3 form-section">
            <h3 className="font-bold text-sm leading-relaxed">32. Complete the risk assessment form for antenna alignment/installation at 40 meters (2 marks only if complete risk assessment is done for one of the task)</h3>

            <div className="overflow-x-auto">
              <Table className="border border-gray-400 form-table table-fixed w-full text-xs">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border border-gray-400 text-left font-bold w-8 text-xs py-1" rowSpan={2}>Sr. No.</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-32 text-xs py-1" rowSpan={2}>Activity</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-20 text-xs py-1" rowSpan={2}>Hazard</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-20 text-xs py-1" rowSpan={2}>Risk Involved</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-54 text-xs py-1" colSpan={3}>Risk Analysis</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-20 text-xs py-1" rowSpan={2}>Control Measures</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-54 text-xs py-1" colSpan={3}>Risk Analysis after Control</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border border-gray-400 text-center font-bold w-18 text-xs py-1">Severity (A)</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-18 text-xs py-1">Occurrence (B)</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-18 text-xs py-1">Risk Level AxB</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-18 text-xs py-1">Severity (A')</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-18 text-xs py-1">Occurrence (B')</TableHead>
                    <TableHead className="border border-gray-400 text-center font-bold w-18 text-xs py-1">Residue Risk Level (A'xB')</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(8)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="border border-gray-400 text-left w-8 py-1">{index + 1}</TableCell>
                      <TableCell className="border border-gray-400 p-1 w-32">
                        <Input
                          value={pageData.question32[index]?.activity || ''}
                          onChange={(e) => handleTableChange(index, 'activity', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-20">
                        <Input
                          value={pageData.question32[index]?.hazard || ''}
                          onChange={(e) => handleTableChange(index, 'hazard', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-20">
                        <Input
                          value={pageData.question32[index]?.riskInvolved || ''}
                          onChange={(e) => handleTableChange(index, 'riskInvolved', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-18">
                        <Input
                          value={pageData.question32[index]?.severityA || ''}
                          onChange={(e) => handleTableChange(index, 'severityA', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-18">
                        <Input
                          value={pageData.question32[index]?.occuranceB || ''}
                          onChange={(e) => handleTableChange(index, 'occuranceB', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-18">
                        <Input
                          value={pageData.question32[index]?.riskLevelAxB || ''}
                          onChange={(e) => handleTableChange(index, 'riskLevelAxB', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-20">
                        <Input
                          value={pageData.question32[index]?.controlMeasures || ''}
                          onChange={(e) => handleTableChange(index, 'controlMeasures', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-18">
                        <Input
                          value={pageData.question32[index]?.severityA2 || ''}
                          onChange={(e) => handleTableChange(index, 'severityA2', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-18">
                        <Input
                          value={pageData.question32[index]?.occuranceB2 || ''}
                          onChange={(e) => handleTableChange(index, 'occuranceB2', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell className="border border-gray-400 p-1 w-20">
                        <Input
                          value={pageData.question32[index]?.residueRiskLevel || ''}
                          onChange={(e) => handleTableChange(index, 'residueRiskLevel', e.target.value)}
                          className="border-0 bg-transparent text-xs w-full text-center overflow-hidden"
                          style={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
          <div className="form-footer mt-4">
            <div className="text-center">
              <div className="text-sm font-bold mb-2">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
              <div className="text-xs text-muted-foreground flex justify-end">
                <span>Page | 11</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage11;