// Batch PDF Generator - Uses complete page generators from pdfGenerator.ts and moderationPdfGenerator.ts
// Combines Attendance + FormPages (1-17) for all learners + ModerationPages (1-6)

import { getFullPrintStyles, getAllFormPagesHTML } from './pdfGenerator';
import { getAllModerationPagesHTML, getModerationPrintStyles } from './moderationPdfGenerator';
import { FormData } from '@/types/form';

export interface BatchPDFData {
  uid: string;
  attendance?: any;
  students?: any[]; // Each student has form_data (FormPage 1-17)
  moderation?: any; // ModerationPage 1-6 data
}

// Initialize form data with all required page properties to prevent undefined errors
const initializeFormData = (rawData: any): FormData => {
  return {
    applicationId: rawData.applicationId || '',
    page1: {
      learnerName: rawData.page1?.learnerName || '',
      idNumber: rawData.page1?.idNumber || '',
      companyName: rawData.page1?.companyName || '',
      date: rawData.page1?.date || '',
      uid: rawData.page1?.uid || '',
      assessorName: rawData.page1?.assessorName || '',
      assessorIdNumber: rawData.page1?.assessorIdNumber || '',
      moderatorName: rawData.page1?.moderatorName || '',
      moderatorIdNumber: rawData.page1?.moderatorIdNumber || '',
      originalIdCopy: rawData.page1?.originalIdCopy || false,
      digitalIdPhoto: rawData.page1?.digitalIdPhoto || false,
      medicalCertificate: rawData.page1?.medicalCertificate || false,
    },
    page2: {
      name: rawData.page2?.name || '',
      dateOfBirth: rawData.page2?.dateOfBirth || '',
      gender: rawData.page2?.gender || '',
      govtId: rawData.page2?.govtId || '',
      designation: rawData.page2?.designation || '',
      employeeId: rawData.page2?.employeeId || '',
      phoneNumber: rawData.page2?.phoneNumber || '',
      email: rawData.page2?.email || '',
      emergencyContactPhone: rawData.page2?.emergencyContactPhone || '',
      emergencyContactEmail: rawData.page2?.emergencyContactEmail || '',
      emergencyContactRelationship: rawData.page2?.emergencyContactRelationship || '',
      employerName: rawData.page2?.employerName || '',
      employerTelNumber: rawData.page2?.employerTelNumber || '',
      courseDetails: rawData.page2?.courseDetails || '',
      firstAttempt: rawData.page2?.firstAttempt || false,
      secondAttempt: rawData.page2?.secondAttempt || false,
      basicNumericLiteracy: rawData.page2?.basicNumericLiteracy || '',
      basicCommunication: rawData.page2?.basicCommunication || '',
      observerWitnessRequired: rawData.page2?.observerWitnessRequired || '',
      observerWitnessIdNumber: rawData.page2?.observerWitnessIdNumber || '',
      observerWitnessName: rawData.page2?.observerWitnessName || '',
      observerWitnessPhone: rawData.page2?.observerWitnessPhone || '',
      interpreterRequired: rawData.page2?.interpreterRequired || '',
      interpreterIdNumber: rawData.page2?.interpreterIdNumber || '',
      interpreterName: rawData.page2?.interpreterName || '',
      interpreterPhone: rawData.page2?.interpreterPhone || '',
      additionalRequirements: rawData.page2?.additionalRequirements || '',
      learnerSignature: rawData.page2?.learnerSignature || '',
      assessorSignature: rawData.page2?.assessorSignature || '',
      learnerSignatureImage: rawData.page2?.learnerSignatureImage || '',
      assessorSignatureImage: rawData.page2?.assessorSignatureImage || '',
    },
    page3: {
      knowledgeWritten: rawData.page3?.knowledgeWritten || false,
      knowledgeOtherSpecify: rawData.page3?.knowledgeOtherSpecify || '',
      knowledgeOtherTick: rawData.page3?.knowledgeOtherTick || false,
      practicalApplication: rawData.page3?.practicalApplication || false,
      practicalOthersSpecify: rawData.page3?.practicalOthersSpecify || '',
      practicalOthersTick: rawData.page3?.practicalOthersTick || false,
      externalSourceReferred: rawData.page3?.externalSourceReferred || '',
      learnerSignaturePage3: rawData.page3?.learnerSignaturePage3 || '',
      assessorFacilitatorSignature: rawData.page3?.assessorFacilitatorSignature || '',
    },
    page4: {
      learnerSignature: rawData.page4?.learnerSignature || '',
      assessorFacilitatorSignature: rawData.page4?.assessorFacilitatorSignature || '',
    },
    page5: {
      outcome1: rawData.page5?.outcome1 || false,
      outcome2: rawData.page5?.outcome2 || false,
      outcome3: rawData.page5?.outcome3 || false,
      outcome4: rawData.page5?.outcome4 || false,
      outcome5: rawData.page5?.outcome5 || false,
      outcome6: rawData.page5?.outcome6 || false,
      outcome7: rawData.page5?.outcome7 || false,
      outcome8: rawData.page5?.outcome8 || false,
      outcome9: rawData.page5?.outcome9 || false,
      outcome10: rawData.page5?.outcome10 || false,
      facilitatorRecommendation: rawData.page5?.facilitatorRecommendation || '',
      facilitatorSignature: rawData.page5?.facilitatorSignature || '',
      learnerSignature: rawData.page5?.learnerSignature || '',
      assessorFacilitatorSignature: rawData.page5?.assessorFacilitatorSignature || '',
    },
    page6: rawData.page6 || { question1: '', question2: '', question3: '', question4: '', question5: '', question6: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page7: rawData.page7 || { question7: '', question8: '', question9: '', question10: '', question11: '', question12: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page8: rawData.page8 || { question13: '', question14: '', question15: '', question16: '', question17: '', question18: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page9: rawData.page9 || { question19: '', question20: '', question21: '', question22: '', question23: '', question24: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page10: rawData.page10 || { question25: '', question26: '', question27: '', question28: '', question29: '', question30: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page11: rawData.page11 || { question31: '', question32: [], learnerSignature: '', assessorFacilitatorSignature: '' },
    page12: rawData.page12 || { question33: '', question34: '', inspectedBy: '', inspectionDate: '', slingInspection: [], safetyHarnessInspection: [], safetyHelmetInspection: [], learnerSignature: '', assessorFacilitatorSignature: '' },
    page13: rawData.page13 || { safetyRopesInspection: [], shockAbsorberInspection: [], connectorInspection: [], doubleLockingInspection: [], fallArrestDeviceInspection: [], workPositioningInspection: [], task2Results: [], task3Results: [], learnerSignature: '', assessorFacilitatorSignature: '' },
    page14: rawData.page14 || { shockAbsorbingLanyards: [], workPositioningSystem: [], fallArrestSystem: [], safeMovementStructures: [], task4Results: [], task5Results: [], task6Results: [], fallArrestPracticalResult: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page15: rawData.page15 || { workplaceInstructions: '', observationOneHour: '', observationDate: '', observationPlace: '', observationJobDescription: '', supervisorName: '', supervisorId: '', supervisorContact: '', supervisorSignature: '', timeManagement: '', trainingStandard: '', equipmentImpression: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page16: rawData.page16 || { knowledgeUseful: '', satisfiedProcedure: '', accurateFeedback: '', satisfiedAssessor: '', beforeAssessment: [], duringAfterAssessment: [], learnerComments: '', learnerSignature: '', assessorFacilitatorSignature: '' },
    page17: rawData.page17 || { specificOutcomes: [], knowledgeResults: '', observationResults: '', assessmentResult: '', assessmentDate: '', summativeResults: '', summativeDate: '', moderationDate: '', moderatorName: '', moderatorSignature: '', learnerSignature: '', assessorFacilitatorSignature: '' },
  };
};

export const generateBatchPDF = async (data: BatchPDFData, toast: any) => {
  console.log('=== BATCH PDF GENERATION STARTED ===');
  console.log('UID:', data.uid);
  console.log('Students:', data.students?.length || 0);
  console.log('Attendance:', data.attendance ? 'Yes' : 'No');
  console.log('Moderation:', data.moderation ? 'Yes' : 'No');

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    toast({
      title: 'Generating Batch PDF...',
      description: `Processing ${data.students?.length || 0} learners`
    });

    // Generate all sections
    const attendanceHTML = generateAttendanceHTML(data);

    // Generate FormPage 1-17 for each student
    let allStudentsHTML = '';
    const students = data.students || [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const rawFormData = student.form_data || {};

      // Initialize form data with all required page properties
      const formData = initializeFormData(rawFormData);

      // Add learner divider page
      allStudentsHTML += generateLearnerDivider(student, i + 1, students.length, data.uid);

      // Generate all 17 form pages using the exported function
      allStudentsHTML += await getAllFormPagesHTML(formData);
    }

    // Generate ModerationPage 1-6
    const moderationData = data.moderation?.form_data || data.moderation || {};
    let moderationHTML = '';
    if (Object.keys(moderationData).length > 0) {
      moderationHTML = generateModerationDivider(data.uid);
      moderationHTML += getAllModerationPagesHTML(moderationData);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Batch PDF - UID: ${data.uid}</title>
        <style>
          ${getFullPrintStyles()}
          ${getModerationPrintStyles()}
          
          /* Additional batch styles */
          .divider-page {
            page-break-after: always !important;
            min-height: 100vh;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center;
            background: white !important;
            padding: 40px !important;
          }
          
          .divider-card {
            border: 3px solid #000 !important;
            padding: 40px !important;
            background: white !important;
            width: 80% !important;
            max-width: 500px !important;
          }
          
          .divider-logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
          }
          
          .divider-title {
            font-size: 28px !important;
            font-weight: bold !important;
            margin: 20px 0 !important;
          }
          
          .divider-subtitle {
            font-size: 20px !important;
            margin: 10px 0 !important;
          }
          
          .divider-uid {
            background: #3b82f6 !important;
            color: white !important;
            padding: 10px 30px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            margin-top: 20px !important;
            display: inline-block !important;
          }
          
          .divider-badge-green {
            background: #10b981 !important;
            color: white !important;
            padding: 10px 30px !important;
            font-size: 14px !important;
            font-weight: bold !important;
            margin-top: 15px !important;
            display: inline-block !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: white;">
        <div class="print-container">
          ${attendanceHTML}
          ${allStudentsHTML}
          ${moderationHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast({
      title: "Batch PDF Ready!",
      description: `Attendance + ${students.length} Learners (17 pages each) + Moderation (6 pages)`,
    });

  } catch (error) {
    console.error('Batch PDF Error:', error);
    toast({
      title: "PDF Failed",
      description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
  }
};

// Learner Divider Page
const generateLearnerDivider = (student: any, num: number, total: number, uid: string) => {
  return `
    <div class="divider-page">
      <div class="divider-card">
        <div class="divider-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" style="width: 100px; height: 100px; object-fit: contain;" onerror="this.style.display='none'" />
        </div>
        <div class="divider-title">LEARNER ${num} OF ${total}</div>
        <div class="divider-subtitle">${student.learner_name || student.form_data?.page1?.learnerName || 'Unknown'}</div>
        <p style="font-size: 14px; color: #666; margin: 10px 0;">
          Company: ${student.company_name || student.form_data?.page1?.companyName || 'N/A'}
        </p>
        <p style="font-size: 12px; color: #999;">
          Student ID: ${student.student_id || ''}
        </p>
        <div class="divider-uid">UID: ${uid}</div>
        <div class="divider-badge-green">17 FORM PAGES FOLLOW</div>
      </div>
    </div>
  `;
};

// Moderation Divider Page
const generateModerationDivider = (uid: string) => {
  return `
    <div class="divider-page">
      <div class="divider-card">
        <div class="divider-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" style="width: 100px; height: 100px; object-fit: contain;" onerror="this.style.display='none'" />
        </div>
        <div class="divider-title">MODERATION PLAN</div>
        <div class="divider-subtitle">Quality Assurance Documentation</div>
        <div class="divider-uid">UID: ${uid}</div>
        <div class="divider-badge-green">6 MODERATION PAGES FOLLOW</div>
      </div>
    </div>
  `;
};

// Attendance Sheet
const generateAttendanceHTML = (data: BatchPDFData) => {
  const att = data.attendance || {};
  const attendees = att.attendees || [];

  let attendeesHTML = '';
  const maxRows = Math.max(attendees.length, 10);
  for (let i = 0; i < maxRows; i++) {
    const a = attendees[i] || {};
    attendeesHTML += `
      <tr>
        <td style="text-align: center; font-weight: bold;">${i + 1}</td>
        <td>${a.learnerName || a.name || ''}</td>
        <td>${a.companyName || a.company || ''}</td>
        <td>${a.designation || ''}</td>
        <td>${a.employeeId || ''}</td>
        <td>${a.phoneNumber || a.phone || ''}</td>
        <td>${a.email || ''}</td>
        <td>${a.govtId || a.idNumber || ''}</td>
        <td>${a.emergencyContact || ''}</td>
      </tr>
    `;
  }

  return `
    <div class="form-page">
      <div class="card" style="height: 100%; display: flex; flex-direction: column;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="/images/logo.png" alt="SSIPL Logo" style="width: 80px; height: 80px; object-fit: contain;" onerror="this.style.display='none'" />
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 18px; font-weight: bold; margin: 0;">RISE-Q : ATTENDANCE SHEET</h1>
          <p style="font-size: 9px; color: #666; margin: 5px 0;">Rescue, Inspection, Safety, Elevation – Quality</p>
          <div style="background: #3b82f6; color: white; padding: 5px 15px; display: inline-block; margin-top: 5px; font-weight: bold; font-size: 12px;">
            UID: ${data.uid}
          </div>
        </div>
        
        <div style="flex-grow: 1;">
          <table style="margin-bottom: 15px;">
            <tr>
              <td style="background: #f3f4f6; font-weight: bold; width: 20%;">Client Name:</td>
              <td style="width: 30%;">${att.clientName || ''}</td>
              <td style="background: #f3f4f6; font-weight: bold; width: 20%;">Date From:</td>
              <td style="width: 30%;">${att.dateFrom || ''}</td>
            </tr>
            <tr>
              <td style="background: #f3f4f6; font-weight: bold;">Training Location:</td>
              <td>${att.trainingLocation || ''}</td>
              <td style="background: #f3f4f6; font-weight: bold;">Date To:</td>
              <td>${att.dateTo || ''}</td>
            </tr>
            <tr>
              <td style="background: #f3f4f6; font-weight: bold;">Training Circle:</td>
              <td>${att.trainingCircle || ''}</td>
              <td style="background: #f3f4f6; font-weight: bold;">Training Coordinator:</td>
              <td>${att.trainingCoordinator || ''}</td>
            </tr>
            <tr>
              <td style="background: #f3f4f6; font-weight: bold;">SSIPL Trainer:</td>
              <td colspan="3">${att.ssiplTrainer || att.trainerName || ''}</td>
            </tr>
          </table>
          
          <h3 style="font-size: 11px; font-weight: bold; margin: 10px 0 5px;">ATTENDEES LIST</h3>
          <table style="font-size: 7px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="width: 4%; padding: 3px;">S.No</th>
                <th style="padding: 3px;">Learner Name</th>
                <th style="padding: 3px;">Company</th>
                <th style="padding: 3px;">Designation</th>
                <th style="padding: 3px;">Emp ID</th>
                <th style="padding: 3px;">Phone</th>
                <th style="padding: 3px;">Email</th>
                <th style="padding: 3px;">Govt ID</th>
                <th style="padding: 3px;">Emergency</th>
              </tr>
            </thead>
            <tbody>
              ${attendeesHTML}
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: auto; padding-top: 10px; border-top: 2px solid #000; text-align: center;">
          <p style="font-size: 8px; font-weight: bold; margin: 0;">ATTENDANCE SHEET - UID: ${data.uid}</p>
          <p style="font-size: 7px; color: #666; margin: 2px 0;">Total Attendees: ${attendees.length}</p>
        </div>
      </div>
    </div>
  `;
};
