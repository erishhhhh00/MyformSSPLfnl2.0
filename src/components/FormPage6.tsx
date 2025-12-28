import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from '@/context/FormContext';

const FormPage6: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page6;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page6', { [field]: value });
  };

  const questions = [
    {
      id: 'question1',
      text: 'What are the risks when using a work positioning Lanyard to arrest a fall',
      options: [
        'a. There is no risk and a work positioning lanyard is safe to use',
        'b. The only risk is working too hard',
        'c. There is serious risk of injury or death due to high shock load',
        'd. It is safe to use for person under 70kg'
      ]
    },
    {
      id: 'question2', 
      text: 'The picture is an example of what?',
      options: [
        'a. Fall arrest',
        'b. Rope Access',
        'c. Work restraint', 
        'd. Work Positioning'
      ]
    },
    {
      id: 'question3',
      text: 'What is the use of the following piece of fall arrest equipment?',
      options: [
        'a) To arrest a fall',
        'b) To allow for hands free work',
        'c) To rescue a person',
        'd) To use a vertical life line'
      ]
    },
    {
      id: 'question4',
      text: 'What is the use of the following piece of fall arrest equipment',
      options: [
        'a) To arrest a fall',
        'b) To allow for hands free work', 
        'c) To rescue a person',
        'd) To use a vertical life line'
      ]
    },
    {
      id: 'question5',
      text: 'What is the use of the following piece of fall arrest equipment?',
      options: [
        'a) To arrest a fall',
        'b) To maintain a workers head while working at height',
        'c) To rescue a person',
        'd) To use a vertical life line'
      ]
    },
    {
      id: 'question6',
      text: 'What is the use of the following piece of fall arrest equipment?',
      options: [
        'a) To arrest a fall',
        'b) To allow for hands free',
        'c) To connect all the other equipment to and keep a worker safe',
        'd) To use a vertical life line'
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
              <h3 className="font-bold">{index + 1}. {question.text}</h3>
              
              {/* Add images for questions 2-6 positioned next to questions */}
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
                      src="/images/qusimage2.png" 
                      alt="Work positioning illustration" 
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
                      src="/images/qusimage3.png" 
                      alt="Fall arrest equipment" 
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
                      src="/images/qusimage4.png" 
                      alt="Fall arrest equipment" 
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
                      src="/images/qusimage5.png" 
                      alt="Fall arrest equipment" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index === 5 && (
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
                      src="/images/qusimage6.png" 
                      alt="Fall arrest equipment" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index === 0 && (
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
            <span>Page | 6</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage6;