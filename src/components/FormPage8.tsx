import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from '@/context/FormContext';

const FormPage8: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page8;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page8', { [field]: value });
  };

  const questions = [
    {
      id: 'question13',
      text: 'The minimum safe working load (SWL) of a self-identified anchor & planned anchor point is?',
      options: [
        'a) 100kg & 130kg',
        'b) 130kg & 150kg',
        'c) 150kg & 220kg',
        'd) 100kg & 220kg'
      ]
    },
    {
      id: 'question14',
      text: 'The purpose for allowing minimum free space is so that?',
      options: [
        'a) You do not hit obstacles, should you fall',
        'b) To avoid person from swinging',
        'c) For people to be able walk underneath you',
        'd) There is no use for minimum free space'
      ]
    },
    {
      id: 'question15',
      text: 'Which one is NOT Absolute Rule?',
      options: [
        'a) Never carry out electrical work on electrical equipment, circuits and gear without appropriate qualifications and compliance to regulations',
        'b) Never work under the influence of alcohol substances (alcohol or drugs) which are illegal or in excess of legal levels or where this impairs ability to perform tasks',
        'c) Never using a hand held phone whilst driving and only making calls by pulling over or using hands-free devices, when it is safe to do so',
        'd) Never wear a climbing helmet for anything else than working at height'
      ]
    },
    {
      id: 'question16',
      text: 'What type of lifeline is this and its purpose?',
      options: [
        'a)Horizontal – for movement over',
        'b)Vertical – for movement up and down',
        'c)Diagonal – for roof top movement',
        'd)None of the above'
      ]
    },
    {
      id: 'question17',
      text: 'What type of lifeline is shown below and what is its purpose?',
      options: [
        'a) Horizontal – for movement side to side',
        'b) Vertical – for movement up and down',
        'c) Diagonal – for roof top movement',
        'd) None of the above'
      ]
    },
    {
      id: 'question18',
      text: 'Why must you always work in team (Buddy System)',
      options: [
        'a. To have someone to talk to',
        'b. So that one worker can be on look-out',
        'c. In case of emergencies, help can be contacted and rescues can be performed quickly',
        'd. None of the above'
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
              <h3 className="font-bold">{index + 13}. {question.text}</h3>
              
              {/* Add images for specific questions */}
              
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
                      src="/images/qusimage8.png" 
                      alt="Free space diagram" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index === 3 && (
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
                      src="/images/qusimage9.png" 
                      alt="Horizontal lifeline diagram" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index === 4 && (
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
                      src="/images/qusimage10.png" 
                      alt="Y-lanyard diagram" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index !== 1 && index !== 3 && index !== 4 && (
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
            <span>Page | 8</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage8;