import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from '@/context/FormContext';

const FormPage10: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page10;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page10', { [field]: value });
  };

  const questions = [
    {
      id: 'question25',
      text: 'What are the duties of the person supervising a team?',
      options: [
        'a) To ensure everyone is happy',
        'b) To ensure everyone has lunch',
        'c) To ensure fall protection plan is implemented',
        'd) To ensure no one gets into trouble'
      ]
    },
    {
      id: 'question26',
      text: 'Why must first aid be applied and emergency services called as soon as possible?',
      options: [
        'a) To silence the casualty',
        'b) To use the first aid kit before it expires',
        'c) To prevent the casualty\'s condition from worsening and getting him safely to medical facility',
        'd) None of the above'
      ]
    },
    {
      id: 'question27',
      text: 'What is the best way to protect against a worker falling through a skylight or a fragile surface during roof top work?',
      options: [
        'a) There is nothing a worker can do',
        'b) Use fall arrest',
        'c) Barricading off the area',
        'd) None of the above'
      ]
    },
    {
      id: 'question28',
      text: 'What pulley system is used to lift tools weighing more than 8kg-20kg?',
      options: [
        'a) 1:1 pulley system',
        'b) 2:1 pulley system',
        'c) 3:1 pulley system',
        'd) 4:1 pulley system'
      ]
    },
    {
      id: 'question29',
      text: 'Which one of the following is NOT a Rigging Principle?',
      options: [
        'a) Always stand underneath the load',
        'b) Ensure that the route of travel is clear',
        'c) Never stand underneath a load',
        'd) Ensure that the correct equipment is used for the lift'
      ]
    },
    {
      id: 'question30',
      text: 'Which one of the following is NOT a Rigging Principle?',
      options: [
        'a) Never exceed the safe working load of the equipment',
        'b) Always protect equipment from sharp edges',
        'c) Always consider the center of gravity',
        'd) Never leave a load unattended'
      ]
    }
  ];

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 md:space-y-3 form-page-container">
      <Card className="border-2 border-form-border bg-card p-1 sm:p-2 md:p-3">
        <div className="form-content">
          {/* Header */}
          <div className="text-center mb-2 sm:mb-4 form-section">
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
                <h3 className="font-bold">{index + 25}. {question.text}</h3>
                
                {/* Add image for question 28 positioned next to question */}
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
                        src="/images/qusimage13.png" 
                        alt="Pulley system diagram" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {index !== 3 && (
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
          <div className="form-footer">
            <div className="text-center">
              <div className="text-lg font-bold mb-3">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
              <div className="text-sm text-muted-foreground flex justify-end">
                <span>Page | 10</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage10;