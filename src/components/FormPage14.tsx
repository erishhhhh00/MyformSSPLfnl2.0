import React from 'react';
import { useForm } from '@/context/FormContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FormPage14: React.FC = () => {
  const { formData, updateFormData } = useForm();

  const handleInputChange = (field: string, value: any) => {
    updateFormData('page14', { [field]: value });
  };

  const handleCheckboxChange = (category: string, index: number, field: string, value: any) => {
    const currentArray = formData.page14[category] || [];
    const updatedArray = [...currentArray];
    if (!updatedArray[index]) {
      updatedArray[index] = {};
    }
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    updateFormData('page14', { [category]: updatedArray });
  };

  // 7 bullet points as per screenshot
  const assessmentItems = [
    'Shock absorbing lanyards are used to safely move at height. Connectors attached to secure anchor points in a safe way. Safe fall factor maintained. Safe working load maintained',
    'Fit work positioning system and switch over from double lanyards to an installed vertical life line. Use of a fall arrestor on a life line is demonstrated and the Safe Working Load is maintained.',
    'Fit work positioning system and switch over from double lanyards to a retractable life line, to climb in area with limited free space',
    'Fit work positioning system and switch over from double lanyards to a pre-installed horizontal life line according to safe practices',
    'Limitations, and the use of all fall arrest equipment and connectors are explained through the safe use in all systems',
    'Explain the safe use and limitations of a full body harness and a work positioning system',
    'Safe movement on various fall arrest structures is demonstrated'
  ];

  // Task 4 data
  const task4Items = [
    'A rescue is awaited in a way that will minimize the risk of suspension trauma',
    'Examples of methods to help prevent suspension trauma is either explained verbally or practically demonstrated',
    'Rope rescue system is securely anchored, with a minimum safe working load (SWL) of 150kg',
    'Rescue from a fall arrest system is preformed (sufficient for both conscious and unconscious casualty)',
    'Conscious casualty - assist the rescue by attaching rescue rope according to the rescuer\'s instructions'
  ];

  // Task 5 data
  const task5Items = [
    'Demonstrate the basic principles of slinging and rigging',
    'Identify and select lifting equipment suitable for lifting tools upto 20Kg',
    'The following basic mechanical advanced systems was performed effectively during the rigging process- 1-way lift'
  ];

  // Task 6 data
  const task6Items = [
    'Figure 8 Stopper Knot',
    'Figure 8 on a bight',
    'Double figure of 8',
    'The Klemheist'
  ];

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 print:p-1 print:space-y-1">
      <Card className="p-1 sm:p-2 md:p-3 print:p-1 border-2 border-form-border">
        {/* Header */}
        <div className="text-center mb-1 sm:mb-2 print:mb-1">
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

        {/* 7 Bullet Points */}
        <div className="mb-3">
          <Table className="table-fixed w-full text-xs print:text-[10px] border border-gray-400">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-400 text-left font-bold w-3/5 py-1">Subtask for Assessment Observation</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">A</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">NYA</TableHead>
                <TableHead className="border border-gray-400 text-left font-bold w-1/5 py-1">Assessors notes & comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessmentItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-400 text-left py-1">
                    <div className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">•</span>
                      <span className="flex-1">{item}</span>
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.assessmentItems?.[index]?.achieved || ''}
                      onChange={(e) => handleCheckboxChange('assessmentItems', index, 'achieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.assessmentItems?.[index]?.notAchieved || ''}
                      onChange={(e) => handleCheckboxChange('assessmentItems', index, 'notAchieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                <Input 
                      value={formData.page14.assessmentItems?.[index]?.comments || ''}
                      onChange={(e) => handleCheckboxChange('assessmentItems', index, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>

        {/* Task 4 */}
        <div className="mb-3">
          <div className="text-center font-bold text-sm print:text-xs mb-1">Task 4 (Total Marks - 05)</div>
          <div className="text-center text-xs print:text-[10px] mb-2">Rescue and emergency procedures are performed</div>
          <Table className="table-fixed w-full text-xs print:text-[10px]">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-400 text-left font-bold w-3/5 py-1">Subtask for Assessment Observation</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">A</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">NYA</TableHead>
                <TableHead className="border border-gray-400 text-left font-bold w-1/5 py-1">Assessors notes & comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task4Items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-400 text-left py-1">{item}</TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.task4Results?.[index]?.achieved || ''}
                      onChange={(e) => handleCheckboxChange('task4Results', index, 'achieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.task4Results?.[index]?.notAchieved || ''}
                      onChange={(e) => handleCheckboxChange('task4Results', index, 'notAchieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                    <Input 
                      value={formData.page14.task4Results?.[index]?.comments || ''}
                      onChange={(e) => handleCheckboxChange('task4Results', index, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                </div>

        {/* Task 5 */}
        <div className="mb-3">
          <div className="text-center font-bold text-sm print:text-xs mb-1">Task 5 (Total marks - 03)</div>
          <div className="text-center text-xs print:text-[10px] mb-2">Use basic rope rigging principles to convey loads</div>
          <Table className="table-fixed w-full text-xs print:text-[10px]">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-400 text-left font-bold w-3/5 py-1">Subtask for Assessment Observation</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">A</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">NYA</TableHead>
                <TableHead className="border border-gray-400 text-left font-bold w-1/5 py-1">Assessors notes & comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task5Items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-400 text-left py-1">{item}</TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.task5Results?.[index]?.achieved || ''}
                      onChange={(e) => handleCheckboxChange('task5Results', index, 'achieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.task5Results?.[index]?.notAchieved || ''}
                      onChange={(e) => handleCheckboxChange('task5Results', index, 'notAchieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                    <Input 
                      value={formData.page14.task5Results?.[index]?.comments || ''}
                      onChange={(e) => handleCheckboxChange('task5Results', index, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                </div>

        {/* Task 6 */}
        <div className="mb-3">
          <div className="text-center font-bold text-sm print:text-xs mb-1">Task 6 (Total Marks - 04)</div>
          <div className="text-center text-xs print:text-[10px] mb-2">Tying of the following knots are demonstrated</div>
          <Table className="table-fixed w-full text-xs print:text-[10px]">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-400 text-left font-bold w-3/5 py-1">Subtask for Assessment Observation</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">Achieved</TableHead>
                <TableHead className="border border-gray-400 text-center font-bold w-1/10 py-1">Not Yet Achieved</TableHead>
                <TableHead className="border border-gray-400 text-left font-bold w-1/5 py-1">Assessors notes and comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task6Items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-400 text-left py-1">{item}</TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.task6Results?.[index]?.achieved || ''}
                      onChange={(e) => handleCheckboxChange('task6Results', index, 'achieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center py-1">
                    <Input 
                      value={formData.page14.task6Results?.[index]?.notAchieved || ''}
                      onChange={(e) => handleCheckboxChange('task6Results', index, 'notAchieved', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden text-center"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 py-1">
                <Input 
                      value={formData.page14.task6Results?.[index]?.comments || ''}
                      onChange={(e) => handleCheckboxChange('task6Results', index, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>

          {/* Fall Arrest Practical Result */}
        <div className="border-2 border-black p-2 mb-3">
          <div className="text-center font-bold text-sm print:text-xs mb-2">Fall Arrest and Fall Arrest Rescue Practical Result</div>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Checkbox 
                    checked={formData.page14.fallArrestPracticalResult === 'achieved'}
                onCheckedChange={(checked) => handleInputChange('fallArrestPracticalResult', checked ? 'achieved' : '')}
              />
              <span className="text-sm print:text-xs">Achieved</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                    checked={formData.page14.fallArrestPracticalResult === 'not-achieved'}
                onCheckedChange={(checked) => handleInputChange('fallArrestPracticalResult', checked ? 'not-achieved' : '')}
                  />
              <span className="text-sm print:text-xs">Not yet Achieved</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
        <div className="grid grid-cols-2 gap-4 mb-3 print:mb-2">
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
        <div className="flex justify-between items-center text-xs print:text-[10px]">
          <div>Page | 14</div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage14;