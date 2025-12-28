import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from '@/context/FormContext';

const FormPage9: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page9;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page9', { [field]: value });
  };

  const questions = [
    {
      id: 'question19',
      text: 'What is the maximum amount of workers allowed on a horizontal life line?',
      options: [
        'a) 1',
        'b) 2',
        'c) 3',
        'd) 4'
      ]
    },
    {
      id: 'question20',
      text: 'What is the maximum total length allowed for a horizontal life line?',
      options: [
        'a) 5m',
        'b) 10m',
        'c) 20m',
        'd) 40m'
      ]
    },
    {
      id: 'question21',
      text: 'Based on the manufacturer\'s instructions, a permanent fall arrest system must?',
      options: [
        'a) Be made of rope',
        'b) Be installed by any person',
        'c) Be installed by a competent persons and be inspected once a year',
        'd) None of the above'
      ]
    },
    {
      id: 'question22',
      text: 'How can one reduce "falling distance"?',
      options: [
        'a) Use shorter lanyards to reduce the fall factor',
        'b) Use longer lanyards to increase the fall factor',
        'c) Do not connect to the structure',
        'd) None of the above'
      ]
    },
    {
      id: 'question23',
      text: 'What are the legal and industry best practice requirements regarding inspection records?',
      options: [
        'a) Records of pre-use and 3-monthly inspections must be maintained',
        'b) The records may be back dated at anytime',
        'c) Inspections record not needed',
        'd) Records may be created as needed'
      ]
    },
    {
      id: 'question24',
      text: 'What are the necessary components of a Risk Assessment?',
      options: [
        'a) Anything I want to avoid a fall',
        'b) Whatever the client wants',
        'c) Depends on the weather conditions',
        'd) Identification (hazards such as: fall from height, bad weather, lack of supervision etc.) analysis, documented mitigation, monitoring plan, review plan'
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
              <h3 className="font-bold">{index + 19}. {question.text}</h3>
              
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
                      src="/images/qusimage12.png" 
                      alt="Horizontal lifeline diagram" 
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
                      src="/images/qusimage11.png" 
                      alt="Falling distance diagram" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {index !== 1 && index !== 3 && (
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
            <span>Page | 9</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage9;