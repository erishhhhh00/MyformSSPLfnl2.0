import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModerationForm } from '@/context/ModerationFormContext';

const ModerationPage1: React.FC = () => {
  const { formData, updateFormData } = useModerationForm();
  const pageData = formData.moderationPage1 || {
    documentTitle: 'MHTA Moderation Plan',
    type: 'Quality Assurance',
    documentNumber: 'SSIPL - MMP001',
    dateOfImplementation: '01/11/2025',
    language: 'English',
    revision: '00'
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('moderationPage1', { ...pageData, [field]: value });
  };

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2 print:p-1 print:space-y-1">
      <Card className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 border-2 border-form-border h-full">
        {/* Header Section with Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="SSIPL Logo"
              className="object-contain"
              style={{ width: '100px', height: '100px' }}
            />
          </div>
          <div className="mb-2">
            <span className="text-2xl font-bold">SSIPL </span>
            <span className="text-2xl font-bold bg-blue-500 text-white px-3 py-1">MODERATION</span>
            <span className="text-2xl font-bold"> PLAN</span>
          </div>
        </div>

        {/* Document Information Table */}
        <div className="border-2 border-form-border mb-4">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-form-border">
            <div className="border-r-2 border-form-border p-2 bg-gray-100">
              <Label className="text-sm font-bold">Document Title:</Label>
            </div>
            <div className="border-r-2 border-form-border p-2 bg-gray-100">
              <Label className="text-sm font-bold">Type:</Label>
            </div>
            <div className="p-2 bg-gray-100">
              <Label className="text-sm font-bold">Document Number:</Label>
            </div>
          </div>

          {/* Second Row - Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-form-border">
            <div className="border-r-2 border-form-border p-2">
              <Input
                value={pageData.documentTitle}
                onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                className="border-0 text-center h-8"
              />
            </div>
            <div className="border-r-2 border-form-border p-2">
              <Input
                value={pageData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="border-0 text-center h-8"
              />
            </div>
            <div className="p-2">
              <Input
                value={pageData.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                className="border-0 text-center h-8"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-form-border">
            <div className="border-r-2 border-form-border p-2 bg-gray-100">
              <Label className="text-sm font-bold">Date of Implementation:</Label>
            </div>
            <div className="border-r-2 border-form-border p-2 bg-gray-100">
              <Label className="text-sm font-bold">Language:</Label>
            </div>
            <div className="p-2 bg-gray-100">
              <Label className="text-sm font-bold">Revision:</Label>
            </div>
          </div>

          {/* Fourth Row - Values */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="border-r-2 border-form-border p-2">
              <Input
                value={pageData.dateOfImplementation}
                onChange={(e) => handleInputChange('dateOfImplementation', e.target.value)}
                className="border-0 text-center h-8"
              />
            </div>
            <div className="border-r-2 border-form-border p-2">
              <Input
                value={pageData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="border-0 text-center h-8"
              />
            </div>
            <div className="p-2">
              <Input
                value={pageData.revision}
                onChange={(e) => handleInputChange('revision', e.target.value)}
                className="border-0 text-center h-8"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-form-border">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">1 | Page</p>
            <p className="font-semibold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
            <p>Format created on - 01/11/2025</p>
            <p>Format updated on - 01/11/2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage1;
