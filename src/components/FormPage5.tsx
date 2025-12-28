import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@/context/FormContext';

const FormPage5: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page5;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page5', { [field]: value });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateFormData('page5', { [field]: checked });
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
              <div className="text-xl md:text-2xl font-bold">Shield Skills Institute</div>
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

        {/* Course Header */}
        <div className="bg-muted p-2 rounded mb-3">
          <div className="grid grid-cols-3 border border-gray-400">
            <div className="bg-gray-200 p-2 border-r border-gray-400 font-bold text-center">
              Specific Outcome
            </div>
            <div className="bg-gray-200 p-2 border-r border-gray-400 font-bold text-center">
              FALL ARREST & RESCUE MANAGEMENT - (FARM)
            </div>
            <div className="bg-gray-200 p-2 text-center font-bold">
              Facilitator to Tick once Learner completed task
            </div>
          </div>
        </div>

        {/* Specific Outcomes Table */}
        <div className="space-y-2">
          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 1</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Explain the use of a range of fall arrest equipment and knowledge of applicable regulations regarding fall arrest equipment</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome1}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome1', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 2</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Explain and use basic rope work. Include: joints limited to: Figure 8 stopper knot, Figure 8 on a bight, Double figure of 8 and the Munter knot</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome2}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome2', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 3</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Install and use Fall Arrest Systems</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome3}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome3', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 4</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Perform basic inspection and assemble full arrest equipment and systems</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome4}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome4', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 5</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Interpret and implement a fall arrest risk assessment</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome5}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome5', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 6</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Perform a fall arrest rescue to bring a casualty down to safety</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome6}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome6', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 7</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Select suitable anchor points</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome7}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome7', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 8</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Explain relevant regulations pertaining to Standards and country regulations</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome8}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome8', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 9</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Demonstrate and explain safe access to fall arrest structures relating to telecommunications</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome9}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome9', checked as boolean)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-400">
            <div className="grid grid-cols-3">
              <div className="p-3 border-r border-gray-400 font-bold bg-gray-100">Specific Outcome 10</div>
              <div className="p-3 border-r border-gray-400 bg-gray-100">Conduct rope rigging practices in accordance with the legislative safety Standards and job requirements. This includes the inspection, selection and use of slings and lifting tackle to safely lift tools up to a maximum of 20kg</div>
              <div className="p-3 bg-gray-100 flex items-center justify-center">
                <Checkbox
                  checked={pageData.outcome10}
                  onCheckedChange={(checked) => handleCheckboxChange('outcome10', checked as boolean)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Motivation for Assessment */}
        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-lg">Motivation for Assessment</h3>
          
          <div className="space-y-3">
            <p><strong>Learner request for Assessment</strong></p>
            <p>This is to declare that I ................... have completed the required training and formative assessment according to the Standards agreed upon.</p>
            <p>I would like to request to be assessed.</p>
          </div>

          <div className="space-y-3">
            <p><strong>Facilitator recommendation for assessment:</strong></p>
            <div className="border border-gray-400 p-4">
              <RadioGroup 
                value={pageData.facilitatorRecommendation} 
                onValueChange={(value) => handleInputChange('facilitatorRecommendation', value)}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
                <div>
                  <Label htmlFor="facilitatorSignature">Facilitator Signature</Label>
                  <Input
                    id="facilitatorSignature"
                    value={pageData.facilitatorSignature}
                    onChange={(e) => handleInputChange('facilitatorSignature', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </RadioGroup>
            </div>
          </div>

          <p>This is to declare that the learner (above mentioned) has completed training and formative assessment according to the Standards as agreed upon in the assessment plan and contract</p>
        </div>

        {/* Knowledge Questionnaire Section */}
        <div className="mt-8 p-4 bg-muted rounded">
          <h3 className="font-bold text-lg mb-2">5. KNOWLEDGE QUESTIONNAIRE (30 marks):</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Instructions:</strong></p>
            <p>1. Learners are required to answer all questions (written and oral answers are accepted).</p>
            <p>2. Assessor may supplement any answer by referring to practical observation.</p>
            <p>3. A 70% average must be achieved before any may be awarded against the knowledge component. Each question carries 1 mark.</p>
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
        <div className="mt-8 text-center">
          <div className="text-lg font-bold">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
          <div className="text-sm text-muted-foreground mt-2 flex justify-end">
            <span>Page | 5</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage5;