import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@/context/FormContext';
import { useAuth } from '@/context/AuthContext';

const FormPage1: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const { isAdmin } = useAuth();
  const pageData = formData.page1;

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData('page1', { [field]: value });
  };

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 print:p-1 print:space-y-1">
      <Card className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 border-2 border-form-border h-full">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 sm:gap-2 mb-2 sm:mb-3">
        <div className="md:col-span-2">
          <div className="border-2 border-form-border p-2 mb-2 h-20">
            <Label htmlFor="learnerName" className="text-sm font-semibold">Learner name</Label>
            <Input
              id="learnerName"
              value={pageData.learnerName}
              onChange={(e) => handleInputChange('learnerName', e.target.value)}
              className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary h-8"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            <div className="border-2 border-form-border p-2 h-20">
              <Label htmlFor="idNumber" className="text-sm font-semibold">ID number</Label>
              <Input
                id="idNumber"
                value={pageData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary h-8"
              />
            </div>
            
            <div className="border-2 border-form-border p-2 h-20">
              <Label htmlFor="companyName" className="text-sm font-semibold">Company Name</Label>
              <Input
                id="companyName"
                value={pageData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary h-8"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="border-2 border-form-border p-2 h-20">
            <Label htmlFor="date" className="text-sm font-semibold">Date</Label>
            <Input
              id="date"
              type="date"
              value={pageData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary h-8"
            />
          </div>
          
          <div className="border-2 border-form-border p-2 h-20">
            <Label htmlFor="uid" className="text-sm font-semibold">UID</Label>
            <Input
              id="uid"
              value={pageData.uid}
              onChange={(e) => handleInputChange('uid', e.target.value)}
              className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary h-8"
            />
          </div>
        </div>
      </div>

      {/* Company Logo and Title Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="bg-red-500 text-white px-3 py-1 text-sm font-bold mr-2">SSIPL</div>
              <div className="text-2xl font-bold">Shield Skills Institute</div>
            </div>
            <div className="text-xl font-bold">Portfolio of Evidence(POE)</div>
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

      {/* Radio Tower Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 flex items-center justify-center">
          <img 
            src="/images/towricon.png" 
            alt="Tower Icon" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Bottom Section with Assessor and Learner Admin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessor Section */}
        <div className="border-2 border-form-border">
          <div className="bg-form-header p-2 border-b border-form-border">
            <h3 className="font-semibold">Assessor name</h3>
          </div>
          <div className="p-2 space-y-2">
            <Input
              value={pageData.assessorName}
              onChange={(e) => handleInputChange('assessorName', e.target.value)}
              className="form-professional-input bg-yellow-50 border-yellow-300 focus:border-yellow-500"
              disabled={!isAdmin}
            />
            {!isAdmin && <span className="text-red-500 text-xs">(Admin Only)</span>}
            
            <div className="border-t border-form-border pt-2">
              <Label className="text-sm font-semibold">ID number</Label>
              <Input
                value={pageData.assessorIdNumber}
                onChange={(e) => handleInputChange('assessorIdNumber', e.target.value)}
                className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary"
                disabled={!isAdmin}
              />
              {!isAdmin && <span className="text-red-500 text-xs">(Admin Only)</span>}
            </div>
            
            <div className="border-t border-form-border pt-2">
              <Label className="text-sm font-semibold">Moderator name</Label>
              <Input
                value={pageData.moderatorName}
                onChange={(e) => handleInputChange('moderatorName', e.target.value)}
                className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary"
                disabled={!isAdmin}
              />
              {!isAdmin && <span className="text-red-500 text-xs">(Admin Only)</span>}
            </div>
            
            <div className="border-t border-form-border pt-2">
              <Label className="text-sm font-semibold">ID number</Label>
              <Input
                value={pageData.moderatorIdNumber}
                onChange={(e) => handleInputChange('moderatorIdNumber', e.target.value)}
                className="border-0 border-b border-form-border rounded-none focus:ring-0 focus:border-b-2 focus:border-primary"
                disabled={!isAdmin}
              />
              {!isAdmin && <span className="text-red-500 text-xs">(Admin Only)</span>}
            </div>
          </div>
        </div>

        {/* Learner Admin Section */}
        <div className="border-2 border-form-border">
          <div className="bg-form-header p-2 border-b border-form-border">
            <h3 className="font-semibold">Learner admin</h3>
          </div>
          <div className="p-2 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="originalId"
                checked={pageData.originalIdCopy}
                onCheckedChange={(checked) => handleInputChange('originalIdCopy', checked as boolean)}
              />
              <Label htmlFor="originalId" className="text-sm">1 x Original copy of ID</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="digitalPhoto"
                checked={pageData.digitalIdPhoto}
                onCheckedChange={(checked) => handleInputChange('digitalIdPhoto', checked as boolean)}
              />
              <Label htmlFor="digitalPhoto" className="text-sm">1 x Digital ID Photo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medicalCert"
                checked={pageData.medicalCertificate}
                onCheckedChange={(checked) => handleInputChange('medicalCertificate', checked as boolean)}
              />
              <Label htmlFor="medicalCert" className="text-sm">1 x Copy of Medical Certificate</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="text-lg font-bold">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
        <div className="text-sm text-muted-foreground mt-2">Version 1.0</div>
      </div>
      </Card>
    </div>
  );
};

export default FormPage1;