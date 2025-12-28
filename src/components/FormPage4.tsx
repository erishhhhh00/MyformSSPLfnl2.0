import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@/context/FormContext';

const FormPage4: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page4;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page4', { [field]: value });
  };

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

          {/* Policies Content */}
          <div className="space-y-3 text-sm leading-relaxed form-section">
            <div className="space-y-4">
              <p>
                <strong>• Appeal against an assessment outcome</strong>, the training provider's appeals procedure should be followed
              </p>
              <p>
                <strong>• Make use of an interpreter</strong> (with no technical knowledge of the subject matter) where language barriers may exist.
              </p>
              <p>
                <strong>• Make use of a witness to the assessment.</strong> The witness may only observe the assessment, but may not take any part in the assessment.
              </p>
              <p>
                <strong>Receive feedback from the Assessor.</strong> Should the assessment outcome be determined as 'not yet competent', relevant information to the area in question will be communicated to the learner for use in a re-assessment
              </p>
            </div>

            <div className="mt-8 form-section">
              <p><strong>Confidentiality:</strong></p>
              <p className="mt-2">
                All information related to this Portfolio of Evidence and assessment will be treated as confidential. To ensure that the information and results are used solely for the record keeping and internal process related to assessment, moderation and certification.
              </p>
            </div>

            <div className="mt-8 space-y-6 form-section">
              <div>
                <p><strong>3.1.3. Assessment and moderation policy :</strong></p>
                <p className="mt-2">
                  The learner and the Assessor must use the information displayed on this page to familiarize themselves with the Standards, assessment and moderation procedure.
                </p>
              </div>

              <div>
                <p><strong>3.1.4. Appeals procedure :</strong></p>
                <p className="mt-2">
                  The learner and Assessor must use the information displayed on this page to familiarize themselves with the appeals procedure. An appeals form may be obtained from the training provider on request.
                </p>
              </div>

              <div>
                <p><strong>3.1.5. Re-assessment:</strong></p>
                <p className="mt-2">
                  All learners are entitled to be re-assessed in line with the training provider's assessment policy. Re-assessment decisions may incorporate past assessment results
                </p>
              </div>

              <div>
                <p><strong>3.1.6. Certification :</strong></p>
                <p className="mt-2">
                  Additional administrative and identification documentation is required for successful certification.
                </p>
                <p className="mt-2">
                  This is a legally binding document in its entirety. If any page(s) must be completed and present. Any additional evidence/ pages must be declared in the declaration of authenticity. Signatures on the feedback and evaluation of assessment forms are acceptance of the contents and evaluation contained in this document.
                </p>
                <p className="mt-2">
                  I declare that I have been explained and understand all parts of this contract
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted rounded form-section">
              <h3 className="font-bold text-lg mb-3">4. FORMATIVE ASSESSMENT:</h3>
              <h4 className="font-bold mb-3">FALL ARREST & RESCUE MANAGEMENT - TOWER CLIMBER (FARM-TOCLI)</h4>
              <p className="italic text-sm leading-relaxed">
                Instructions: This serves as a guide for training and assists the trainer in the evaluation of a learner's performance before assessment as well as the readiness for the actual assessment.
              </p>
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
          <div className="form-footer">
            <div className="text-center">
              <div className="text-lg font-bold mb-3">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
              <div className="text-sm text-muted-foreground flex justify-end">
                <span>Page | 4</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage4;