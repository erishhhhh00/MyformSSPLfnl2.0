import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from '@/context/FormContext';

const FormPage12: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page12;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page12', { [field]: value });
  };

  const handleTableChange = (tableType: string, rowIndex: number, field: string, value: string) => {
    const updatedData = [...pageData[tableType]];
    if (!updatedData[rowIndex]) {
      updatedData[rowIndex] = {};
    }
    updatedData[rowIndex][field] = value;
    updateFormData('page12', { [tableType]: updatedData });
  };

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2">
      <Card className="border-2 border-form-border bg-card p-1 sm:p-2 md:p-3">
        {/* Header */}
        <div className="text-center mb-1 sm:mb-2">
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

        {/* Questions 33 & 34 */}
        <div className="space-y-4 mb-6">
          <div className="space-y-3">
            <h3 className="font-bold text-base leading-relaxed">33. Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)</h3>

            <div className="flex justify-center my-4 space-x-4">
              <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                <img src="/images/image17.png" alt="Excavator" className="w-full h-full object-contain" />
              </div>
              <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                <img src="/images/image18.png" alt="Tower" className="w-full h-full object-contain" />
              </div>
              <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                <img src="/images/image19.png" alt="Person" className="w-full h-full object-contain" />
              </div>
            </div>

            <Input
              value={pageData.question33}
              onChange={(e) => handleInputChange('question33', e.target.value)}
              placeholder="Enter your answer"
              className="mt-3 text-sm h-8"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-base leading-relaxed">34. Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)</h3>

            <div className="flex justify-center my-4 space-x-4">
              <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                <img src="/images/image20.png" alt="Crane" className="w-full h-full object-contain" />
              </div>
              <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                <img src="/images/image21.png" alt="Warning" className="w-full h-full object-contain" />
              </div>
              <div className="w-40 h-32 bg-gray-200 border-2 border-black rounded flex items-center justify-center overflow-hidden">
                <img src="/images/image22.png" alt="Sparks" className="w-full h-full object-contain" />
              </div>
            </div>

            <Input
              value={pageData.question34}
              onChange={(e) => handleInputChange('question34', e.target.value)}
              placeholder="Enter your answer"
              className="mt-3 text-sm h-8"
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="mb-6">
          <div className="grid grid-cols-3 border border-gray-400 text-sm">
            <div className="bg-gray-200 p-3 border-r border-gray-400 font-bold text-center">
              Fall Arrest and Fall Arrest Rescue Knowledge Questionnaire result
            </div>
            <div className="bg-gray-200 p-3 border-r border-gray-400 text-center font-bold">
              Not yet Achieved : 24 out of 35 and below
            </div>
            <div className="bg-gray-200 p-3 text-center font-bold">
              Achieved : 25 out of 35 and above
            </div>
          </div>
        </div>

        {/* Summative Assessment Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-base">6. SUMMATIVE ASSESSMENT & PRACTICAL OBSERVATION: TOTAL MARKS 32</h3>
          <h4 className="font-bold text-base">FALL ARREST & FALL ARREST RESCUE - (FARM)</h4>

          <div className="text-sm space-y-2">
            <p><strong>Instructions for assessor:</strong></p>
            <p>1. Learners are required to complete tasks as assigned below. 1 mark for each point</p>
            <p>2. A 100% score is must before competency may be awarded against the practical component</p>
            <p className="ml-4">Task 1 (Each task earns 1 mark - 09 marks)</p>
            <p className="ml-4">Climbing Equipment Inspection (to be filled by participant)</p>
          </div>
        </div>

        {/* Inspection Tables */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="inspectedBy" className="text-sm">Inspected by:</Label>
              <Input
                id="inspectedBy"
                value={pageData.inspectedBy}
                onChange={(e) => handleInputChange('inspectedBy', e.target.value)}
                className="w-40 text-sm h-8"
              />
              <Label htmlFor="inspectionDate" className="text-sm">Date of next Inspection:</Label>
              <Input
                id="inspectionDate"
                value={pageData.inspectionDate}
                onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
                className="w-40 text-sm h-8"
              />
            </div>
          </div>

          {/* Sling Inspection Table */}
          <div>
            <h4 className="font-bold mb-2 text-sm">Sling - EN 566, 795</h4>
            <Table className="border border-gray-400 table-fixed w-full text-sm">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-2">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Serial No.</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">Date of Manufacture</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Stitching</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">D-Links if present</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Fraying</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Pass/Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-2">1</TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.slingInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.slingInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.slingInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.slingInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.slingInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.slingInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.slingInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('slingInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Safety Harness Inspection Table */}
          <div>
            <h4 className="font-bold mb-2 text-sm">Safety Harness - EN 361, 813, 358</h4>
            <Table className="border border-gray-400 table-fixed w-full text-sm">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-2">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Serial No.</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">Date of Manufacture</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Stitching</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">D-rings</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Buckles</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Webbing</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Pass/Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-2">2</TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHarnessInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('safetyHarnessInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Safety Helmet Inspection Table */}
          <div>
            <h4 className="font-bold mb-2 text-sm">Safety Helmet - EN 12492</h4>
            <Table className="border border-gray-400 table-fixed w-full text-sm">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-2">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">Wear, Cuts & Abrasions</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">Date of Manufacture</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">Heat & Chemical Damage</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-20 py-2">Cracks & Deformations</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Chin Strap Clip</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Connections & Rivets</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-2">Pass/Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-2">3</TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-20">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-2 w-16">
                    <Input
                      value={pageData.safetyHelmetInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('safetyHelmetInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-sm w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
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
        <div className="mt-6 text-center">
          <div className="text-base font-bold">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
          <div className="text-sm text-muted-foreground mt-2 flex justify-end">
            <span>Page | 12</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage12;