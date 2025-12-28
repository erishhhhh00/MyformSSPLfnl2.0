import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@/context/FormContext';

const FormPage2: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page2;

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData('page2', { [field]: value });
  };

  const handleImageUpload = (field: string, file: File) => {
    // Validate image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width !== 325 || img.height !== 96) {
        alert(`Image must be exactly 325px wide and 96px tall. Current size: ${img.width}x${img.height}px`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange(field, event.target?.result as string);
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
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

      {/* Section 1: Learner Information */}
      <div className="mb-3">
        <h2 className="text-sm font-bold mb-2 bg-form-header p-1 border border-form-border">
          1. LEARNER INFORMATION FOR REGISTRATION FORM
        </h2>
        
        <div className="border border-form-border">
          {/* Personal Information Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Name</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Date of Birth</div>
            <div className="border-b border-form-border p-2">
              <Input
                type="date"
                value={pageData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="border-0 focus:ring-0 form-professional-input h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Gender</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Govt ID</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.govtId}
                onChange={(e) => handleInputChange('govtId', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Designation (in)</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Employee ID</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Phone Number</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">E-mail</div>
            <div className="border-b border-form-border p-2">
              <Input
                type="email"
                value={pageData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            {/* Emergency Contact Section */}
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">
              Learner Emergency Contact Details/ Next of Kin
            </div>
            <div className="border-b border-form-border p-2"></div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Phone Number</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">E-mail</div>
            <div className="border-b border-form-border p-2">
              <Input
                type="email"
                value={pageData.emergencyContactEmail}
                onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            
            <div className="border-r border-form-border p-2 bg-form-header font-semibold text-xs">Relationship</div>
            <div className="border-form-border p-2">
              <Input
                value={pageData.emergencyContactRelationship}
                onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employer Details */}
      <div className="mb-3">
        <h3 className="font-bold mb-1 bg-form-header p-1 border border-form-border text-xs">Employer Details</h3>
        <div className="border border-form-border">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-r border-b border-form-border p-2 bg-form-header font-semibold text-xs">Employer Name</div>
            <div className="border-b border-form-border p-2">
              <Input
                value={pageData.employerName}
                onChange={(e) => handleInputChange('employerName', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            <div className="border-r border-form-border p-2 bg-form-header font-semibold text-xs">Tel Number</div>
            <div className="border-form-border p-2">
              <Input
                value={pageData.employerTelNumber}
                onChange={(e) => handleInputChange('employerTelNumber', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="mb-3">
        <h3 className="font-bold mb-1 bg-form-header p-1 border border-form-border text-xs">Course Details</h3>
        <div className="border border-form-border">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <div className="col-span-2 border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">
              Fall Arrest & Rescue Management (FARM)
            </div>
            <div className="border-r border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">
              1st Attempt
            </div>
            <div className="border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">
              2nd Attempt
            </div>
            <div className="col-span-2 border-r border-form-border p-1"></div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <Checkbox
                checked={pageData.firstAttempt}
                onCheckedChange={(checked) => handleInputChange('firstAttempt', checked as boolean)}
                className="w-4 h-4"
              />
            </div>
            <div className="border-form-border p-1 flex justify-center">
              <Checkbox
                checked={pageData.secondAttempt}
                onCheckedChange={(checked) => handleInputChange('secondAttempt', checked as boolean)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgment Section */}
      <div className="mb-3">
        <h3 className="font-bold mb-1 text-xs">Acknowledgment of learning assumed to be in place by learner:</h3>
        <div className="border border-form-border">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <div className="col-span-2 border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">
              Basic Numeric Literacy
            </div>
            <div className="border-r border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">Yes</div>
            <div className="border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">No</div>
            
            <div className="col-span-2 border-r border-form-border p-1"></div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="basicNumericLiteracy"
                checked={pageData.basicNumericLiteracy === 'yes'}
                onChange={() => handleInputChange('basicNumericLiteracy', 'yes')}
                className="w-3 h-3"
              />
            </div>
            <div className="border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="basicNumericLiteracy"
                checked={pageData.basicNumericLiteracy === 'no'}
                onChange={() => handleInputChange('basicNumericLiteracy', 'no')}
                className="w-3 h-3"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <div className="col-span-2 border-r border-form-border p-1 bg-form-header font-semibold text-xs">
              Basic Communication
            </div>
            <div className="border-r border-form-border p-1 text-center bg-form-header font-semibold text-xs">Yes</div>
            <div className="border-form-border p-1 text-center bg-form-header font-semibold text-xs">No</div>
            
            <div className="col-span-2 border-r border-form-border p-1"></div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="basicCommunication"
                checked={pageData.basicCommunication === 'yes'}
                onChange={() => handleInputChange('basicCommunication', 'yes')}
                className="w-3 h-3"
              />
            </div>
            <div className="border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="basicCommunication"
                checked={pageData.basicCommunication === 'no'}
                onChange={() => handleInputChange('basicCommunication', 'no')}
                className="w-3 h-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Special Need Requirement Section */}
      <div className="mb-3">
        <h3 className="font-bold mb-1 text-xs">
          Learner with Special Need requirement (Pre-Training requirement)
          <span className="text-xs font-normal"> (Interpreter & Witness shall only be present during assessment to assist the learner in understanding the instructions by the Assessor & they shall not be part of Evaluation process)</span>
        </h3>
        
        <div className="border border-form-border mb-2">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            <div className="border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">Observer or Witness</div>
            <div className="border-r border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">Yes</div>
            <div className="border-r border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">No</div>
            <div className="border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">Name/ Surname</div>
            <div className="border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">Phone Number</div>
            <div className="border-b border-form-border p-1 bg-form-header font-semibold text-xs">ID Number</div>
            
            <div className="border-r border-form-border p-1"></div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="observerWitnessRequired"
                checked={pageData.observerWitnessRequired === 'yes'}
                onChange={() => handleInputChange('observerWitnessRequired', 'yes')}
                className="w-3 h-3"
              />
            </div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="observerWitnessRequired"
                checked={pageData.observerWitnessRequired === 'no'}
                onChange={() => handleInputChange('observerWitnessRequired', 'no')}
                className="w-3 h-3"
              />
            </div>
            <div className="border-r border-form-border p-2">
              <Input
                value={pageData.observerWitnessName}
                onChange={(e) => handleInputChange('observerWitnessName', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            <div className="border-r border-form-border p-2">
              <Input
                value={pageData.observerWitnessPhone}
                onChange={(e) => handleInputChange('observerWitnessPhone', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            <div className="border-form-border p-2">
              <Input
                value={pageData.observerWitnessIdNumber}
                onChange={(e) => handleInputChange('observerWitnessIdNumber', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border border-form-border mb-2">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            <div className="border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">Interpreter</div>
            <div className="border-r border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">Yes</div>
            <div className="border-r border-b border-form-border p-1 text-center bg-form-header font-semibold text-xs">No</div>
            <div className="border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">Name/ Surname</div>
            <div className="border-r border-b border-form-border p-1 bg-form-header font-semibold text-xs">Phone Number</div>
            <div className="border-b border-form-border p-1 bg-form-header font-semibold text-xs">ID Number</div>
            
            <div className="border-r border-form-border p-1"></div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="interpreterRequired"
                checked={pageData.interpreterRequired === 'yes'}
                onChange={() => handleInputChange('interpreterRequired', 'yes')}
                className="w-3 h-3"
              />
            </div>
            <div className="border-r border-form-border p-1 flex justify-center">
              <input
                type="radio"
                name="interpreterRequired"
                checked={pageData.interpreterRequired === 'no'}
                onChange={() => handleInputChange('interpreterRequired', 'no')}
                className="w-3 h-3"
              />
            </div>
            <div className="border-r border-form-border p-2">
              <Input
                value={pageData.interpreterName}
                onChange={(e) => handleInputChange('interpreterName', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            <div className="border-r border-form-border p-2">
              <Input
                value={pageData.interpreterPhone}
                onChange={(e) => handleInputChange('interpreterPhone', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
            <div className="border-form-border p-2">
              <Input
                value={pageData.interpreterIdNumber}
                onChange={(e) => handleInputChange('interpreterIdNumber', e.target.value)}
                className="border-0 focus:ring-0 h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border border-form-border">
          <div className="border-b border-form-border p-1 bg-form-header font-semibold text-xs">Additional Requirements</div>
          <div className="p-1">
            <Textarea
              value={pageData.additionalRequirements}
              onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
              className="border-0 focus:ring-0 min-h-[40px] text-xs"
            />
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div className="border border-form-border">
          <div className="border-b border-form-border p-1 bg-form-header font-semibold text-xs">Learner Signature</div>
          <div className="p-2 h-20">
            <div className="text-xs text-gray-600 mb-1">Required: 325px × 96px</div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload('learnerSignatureImage', file);
                  }
                }}
                className="text-xs"
              />
              {pageData.learnerSignatureImage && (
                <img 
                  src={pageData.learnerSignatureImage} 
                  alt="Learner Signature" 
                  className="w-8 h-8 object-cover border rounded"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="border border-form-border">
          <div className="border-b border-form-border p-1 bg-form-header font-semibold text-xs">Assessor / Facilitator Signature</div>
          <div className="p-2 h-20">
            <div className="text-xs text-gray-600 mb-1">Required: 325px × 96px</div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload('assessorSignatureImage', file);
                  }
                }}
                className="text-xs"
              />
              {pageData.assessorSignatureImage && (
                <img 
                  src={pageData.assessorSignatureImage} 
                  alt="Assessor Signature" 
                  className="w-8 h-8 object-cover border rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs">
        <div className="mb-1 text-right">Page | 2</div>
      </div>
      </Card>
    </div>
  );
};

export default FormPage2;