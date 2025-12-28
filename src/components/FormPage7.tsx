import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from '@/context/FormContext';

const FormPage7: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page7;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page7', { [field]: value });
  };

  const questions = [
    {
      id: 'question7',
      text: 'Why must an activated shock absorbing lanyard never be used again?',
      options: [
        'a) It can be used again',
        'b) It will not absorb shock load again',
        'c) because my boss says so',
        'd) None of the above'
      ]
    },
    {
      id: 'question8',
      text: 'In the picture provided what is wrong with the way the connector is being used?',
      options: [
        'a) It is cross loading',
        'b) Nothing is wrong',
        'c) The slings are too small',
        'd) The slings are too big'
      ]
    },
    {
      id: 'question9',
      text: 'Given the picture provided below, identify the intact (safe to use) shock absorbing Lanyard?',
      options: [
        'a)',
        'b)',
        'c)',
        'd)'
      ]
    },
    {
      id: 'question10',
      text: 'What is the main cause and outcome of suspension Trauma?',
      options: [
        'a) Feeling Sleepy because of lack of sleep during day',
        'b) Death due to Hanging stationary in a harness',
        'c) There is no real risk even if you work too long in the harness',
        'd) None of the above'
      ]
    },
    {
      id: 'question11',
      text: 'Why must fall arrest equipment be certified and identified?',
      options: [
        'a) To avoid price fixing',
        'b) To ensure quality management',
        'c) To avoid responsibility',
        'd) To ensure quality and that equipment is "Safe for use and fit for purpose"'
      ]
    },
    {
      id: 'question12',
      text: 'What is the purpose of an anchor point when arresting a fall?',
      options: [
        'a) To prevent a worker from falling to the ground',
        'b) An anchor has no purpose',
        'c) To prevent the structure from falling over',
        'd) None of the above'
      ]
    }
  ];

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

        {/* Questions */}
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <h3 className="font-bold">{index + 7}. {question.text}</h3>
              
              {/* Add images for specific questions positioned next to questions */}
              {index === 1 && (
                <div className="flex items-start gap-4 my-4">
                  <div className="flex-1">
                    <RadioGroup 
                      value={pageData[question.id as keyof typeof pageData] as string} 
                      onValueChange={(value) => handleInputChange(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="text-sm leading-relaxed">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="w-40 h-32 border-2 border-black rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/qusimage7.png" 
                      alt="Connector usage diagram" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              {index === 2 && (
                <div className="flex items-start gap-4 my-4">
                  <div className="flex-1">
                    <RadioGroup 
                      value={pageData[question.id as keyof typeof pageData] as string} 
                      onValueChange={(value) => handleInputChange(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="text-sm leading-relaxed">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="w-40 h-32 border-2 border-black rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/shock-absorbing-lanyards.jpg" 
                      alt="Shock Absorbing Lanyards"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index !== 1 && index !== 2 && (
                <RadioGroup 
                  value={pageData[question.id as keyof typeof pageData] as string} 
                  onValueChange={(value) => handleInputChange(question.id, value)}
                  className="space-y-2"
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                      <Label htmlFor={`${question.id}-${optionIndex}`} className="text-sm leading-relaxed">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
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
            <span>Page | 7</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage7;