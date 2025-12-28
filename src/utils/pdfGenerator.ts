import { FormData } from '@/types/form';

export const generateFormPDF = async (formData: FormData, toast: any) => {
  console.log('=== PDF GENERATION STARTED ===');
  console.log('Full form data received:', JSON.stringify(formData, null, 2));

  try {
    // Create a new window with the form content for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Create the HTML content for the print window
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>FARM Assessment - ${formData.applicationId || 'Form'}</title>
        <style>
          ${getFullPrintStyles()}
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: white;">
        <div class="print-container">
          ${await getAllFormPagesHTML(formData)}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    console.log('PDF generation initiated via browser print');

    toast({
      title: "PDF Generation Started!",
      description: "A print dialog will open. Choose 'Save as PDF' to download your form.",
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    toast({
      title: "PDF Generation Failed",
      description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      variant: "destructive",
    });
  }
};

// Get comprehensive print styles that preserve all browser styling
export const getFullPrintStyles = () => {
  return `
    @page {
      size: A4;
      margin: 0.2in;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
      font-family: Arial, sans-serif !important;
      font-size: 10px !important;
    }
    
    body, html {
      font-family: Arial, sans-serif !important;
      font-size: 12px !important;
      line-height: 1.5 !important;
      color: #000 !important;
      margin: 0;
      padding: 0;
      background: white !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: bold !important;
      font-family: Arial, sans-serif !important;
      color: #000 !important;
    }
    
    .form-page {
      page-break-after: always !important;
      page-break-inside: avoid !important;
      min-height: 100vh;
      max-height: 100vh;
      background: white !important;
      padding: 15px !important;
      margin: 0 !important;
      overflow: hidden !important;
      font-size: 10px !important;
      width: 100% !important;
      height: 100vh !important;
      display: flex !important;
      flex-direction: column !important;
    }
    
    .form-page:last-child {
      page-break-after: auto !important;
    }
    
    .page-break {
      page-break-before: always !important;
    }
    
    .no-break {
      page-break-inside: avoid !important;
    }
    
    .print-container {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    
    /* Responsive content fitting */
    .responsive-text {
      font-size: 9px !important;
      line-height: 1.3 !important;
    }
    
    .responsive-table {
      font-size: 8px !important;
      table-layout: fixed !important;
      width: 100% !important;
    }
    
    .responsive-table th,
    .responsive-table td {
      font-size: 8px !important;
      padding: 3px !important;
      word-wrap: break-word !important;
      overflow: hidden !important;
    }
    
    .full-page-content {
      height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
    }
    
    .content-section {
      flex-grow: 1 !important;
      margin: 10px 0 !important;
    }
    
    .compact-spacing {
      margin: 5px !important;
      padding: 5px !important;
    }
    
    .page {
      page-break-after: always !important;
    }
    
    .section {
      margin-bottom: 20px !important;
    }
    
    .card {
      background: white !important;
      border: 1px solid #000 !important;
      border-radius: 4px !important;
      padding: 15px !important;
      margin: 0 !important;
      height: 100% !important;
      width: 100% !important;
      overflow: hidden !important;
      font-size: 10px !important;
      min-height: calc(100vh - 30px) !important;
      display: flex !important;
      flex-direction: column !important;
    }
    
    table, th, td {
      border: 1px solid #000 !important;
      border-collapse: collapse !important;
      font-size: 9px !important;
      padding: 4px !important;
      margin: 0 !important;
    }
    
    table {
      width: 100% !important;
      table-layout: fixed !important;
      font-size: 9px !important;
    }
    
    th {
      font-size: 9px !important;
      font-weight: bold !important;
      padding: 5px !important;
      background: #f3f4f6 !important;
    }
    
    td {
      font-size: 9px !important;
      padding: 4px !important;
      vertical-align: top !important;
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 20px;
      font-size: 10px !important;
    }
    
    .form-field {
      margin-bottom: 10px !important;
      font-size: 9px !important;
    }
    
    .form-field label {
      font-size: 9px !important;
      font-weight: bold !important;
    }
    
    .form-field-value {
      font-size: 9px !important;
      padding: 4px !important;
      border: 1px solid #ccc !important;
      min-height: 20px !important;
    }
    
    .signature-field {
      font-size: 9px !important;
      padding: 4px !important;
      border: 1px solid #ccc !important;
      min-height: 20px !important;
    }
    
    .mhta-badge {
      background-color: #ef4444 !important;
      color: white !important;
      padding: 4px 12px !important;
      font-size: 10px !important;
      font-weight: bold !important;
      margin-right: 8px !important;
      display: inline-block !important;
    }
    
    .medihse-title {
      font-size: 20px !important;
      font-weight: bold !important;
      display: inline-block !important;
    }
    
    .subtitle {
      font-size: 9px !important;
      color: #6b7280 !important;
      margin-top: 4px !important;
    }
    
    .form-grid {
      display: grid;
      gap: 16px;
      margin: 20px 0;
    }
    
    .form-grid-2 {
      grid-template-columns: 1fr 1fr;
    }
    
    .form-grid-3 {
      grid-template-columns: 1fr 1fr 1fr;
    }
    
    .form-grid-4 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    
    .form-field {
      border: 1px solid #000 !important;
      background: white !important;
      padding: 15px !important;
      border-radius: 4px !important;
    }
    
    .form-field label {
      font-weight: 600 !important;
      color: #000 !important;
      font-size: 10px !important;
      display: block !important;
      margin-bottom: 6px !important;
    }
    
    .form-field-value {
      font-size: 12px !important;
      color: #000 !important;
      min-height: 20px !important;
    }
    
    .question-section {
      margin: 30px 0;
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .question-title {
      font-weight: 700 !important;
      font-size: 14px !important;
      margin-bottom: 18px !important;
      color: #1f2937 !important;
      line-height: 1.4 !important;
    }
    
    .question-options {
      margin-left: 0;
      padding-left: 15px;
    }
    
    .question-option {
      display: flex;
      align-items: flex-start;
      margin: 12px 0;
      padding: 8px 0;
    }
    
    .radio-button {
      width: 14px !important;
      height: 14px !important;
      border: 1px solid #000 !important;
      border-radius: 50% !important;
      margin-right: 8px !important;
      margin-top: 2px !important;
      background: white !important;
      flex-shrink: 0;
    }
    
    input[type=checkbox], input[type=radio] {
      margin-right: 6px !important;
    }
    
    .radio-button.selected {
      background: #000 !important;
      border: 2px solid #000 !important;
    }
    
    .checkbox {
      width: 14px !important;
      height: 14px !important;
      border: 1px solid #000 !important;
      margin-right: 8px !important;
      margin-top: 2px !important;
      background: white !important;
      flex-shrink: 0;
    }
    
    .checkbox.checked {
      background: #000 !important;
      color: white !important;
      text-align: center !important;
      line-height: 10px !important;
      font-size: 8px !important;
    }
    
    .option-text {
      font-size: 11px !important;
      line-height: 1.5 !important;
      color: #374151 !important;
      font-weight: 400 !important;
    }
    
    .signatures-section {
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #000 !important;
      display: flex;
      justify-content: space-between;
      gap: 15px;
      font-size: 9px !important;
    }
    
    .signatures-section > div {
      flex: 1;
      width: 45%;
    }
    
    .signature-field {
      border-bottom: 1px solid #000 !important;
      padding-bottom: 6px;
      min-height: 25px;
      width: 100%;
      font-size: 9px !important;
    }
    
    .signature-label {
      font-size: 9px !important;
      font-weight: 700 !important;
      margin-bottom: 8px !important;
      display: block !important;
      color: #000 !important;
    }
    
    .form-footer {
      margin-top: 15px !important;
      padding-top: 15px;
      border-top: 1px solid #000 !important;
      text-align: center;
      font-size: 9px !important;
    }
    
    .footer-title {
      font-size: 10px !important;
      font-weight: 700 !important;
      margin-bottom: 8px !important;
      color: #000 !important;
    }
    
    .footer-details {
      font-size: 8px !important;
      color: #4b5563 !important;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px !important;
      padding: 0 8px !important;
    }
    
    .gray-bg {
      background-color: #f3f4f6 !important;
      padding: 15px !important;
      border-radius: 6px !important;
      border: 1px solid #d1d5db !important;
    }
    
    .text-section {
      font-size: 10px;
      line-height: 1.6;
      margin: 16px 0;
    }
    
    .text-section p {
      margin: 8px 0;
    }
    
    .text-section strong {
      font-weight: 700;
    }
    
    .placeholder-image {
      width: 120px;
      height: 90px;
      border: 2px solid #000 !important;
      background: #f8fafc !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px !important;
      font-weight: 600 !important;
      color: #374151 !important;
      margin: 15px auto;
      border-radius: 4px;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    
    .table th,
    .table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      font-size: 9px;
    }
    
    .table th {
      background-color: #f3f4f6;
      font-weight: 700;
    }
  `;
};

// Generate HTML for all form pages with exact styling
export const getAllFormPagesHTML = async (formData: FormData) => {
  const pages = [];

  // Generate all 17 pages with proper content and page breaks
  pages.push(generatePage1HTML(formData));
  pages.push(generatePage2HTML(formData));
  pages.push(generatePage3HTML(formData));
  pages.push(generatePage4HTML(formData));
  pages.push(generatePage5HTML(formData));
  pages.push(generatePage6HTML(formData));
  pages.push(generatePage7HTML(formData));
  pages.push(generatePage8HTML(formData));
  pages.push(generatePage9HTML(formData));
  pages.push(generatePage10HTML(formData));
  pages.push(generatePage11HTML(formData));
  pages.push(generatePage12HTML(formData));
  pages.push(generatePage13HTML(formData));
  pages.push(generatePage14HTML(formData));
  pages.push(generatePage15HTML(formData));
  pages.push(generatePage16HTML(formData));
  pages.push(generatePage17HTML(formData));

  return pages.join('\n');
};

// Generate HTML for individual pages with exact browser styling
const generateFormHeader = () => {
  return `
    <div class="form-header">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="flex: 1; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
              <div class="mhta-badge">SSIPL</div>
              <div class="medihse-title">Shield Skills Institute</div>
      </div>
          </div>
          <div style="width: 87px; height: 73px; display: flex; align-items: center; justify-content: center;">
            <img 
              src="/images/logo.png" 
              alt="Shield Skills Institute Logo" 
              style="width: 87px; height: 73px; object-fit: contain;"
            />
          </div>
        </div>
    </div>
  `;
};

const generateFormFooter = (pageNum: number) => {
  return `
    <div class="form-footer">
      <div class="footer-title">FALL ARREST & RESCUE MANAGEMENT - ToCif</div>
      <div class="footer-details" style="text-align: right;">
        <span>Page | ${pageNum}</span>
      </div>
    </div>
  `;
};

const generateSignatureSection = (learnerSig: string = '', assessorSig: string = '', learnerImage?: string, assessorImage?: string) => {
  return `
    <div style="display: flex; justify-content: space-between; margin-top: 15px;">
      <div style="width: 48%; text-align: center;">
        <strong style="font-size: 7px;">Learner Signature</strong>
        ${learnerImage ? `<img src="${learnerImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
        <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
      </div>
      <div style="width: 48%; text-align: center;">
        <strong style="font-size: 7px;">Assessor / Facilitator Signature</strong>
        ${assessorImage ? `<img src="${assessorImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
        <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
      </div>
    </div>
  `;
};

// Page 1: Portfolio Cover Page HTML
const generatePage1HTML = (formData: FormData) => {
  const page1 = formData.page1;
  return `
    <div class="form-page">
      <div class="card" style="height: 100%; display: flex; flex-direction: column;">
        ${generateFormHeader()}
        
        <!-- Learner Information Section -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin: 20px 0;">
          <div>
            <div style="border: 1px solid #000; padding: 12px; height: 80px; margin-bottom: 12px;">
              <label style="font-size: 10px; font-weight: bold; display: block; margin-bottom: 6px;">Learner name</label>
              <div style="border-bottom: 1px solid #000; height: 35px; font-size: 10px; padding: 4px;">${page1.learnerName || ''}</div>
          </div>
          
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div style="border: 1px solid #000; padding: 12px; height: 80px;">
                <label style="font-size: 10px; font-weight: bold; display: block; margin-bottom: 6px;">ID number</label>
                <div style="border-bottom: 1px solid #000; height: 35px; font-size: 10px; padding: 4px;">${page1.idNumber || ''}</div>
          </div>
          
              <div style="border: 1px solid #000; padding: 12px; height: 80px;">
                <label style="font-size: 10px; font-weight: bold; display: block; margin-bottom: 6px;">Company Name</label>
                <div style="border-bottom: 1px solid #000; height: 35px; font-size: 10px; padding: 4px;">${page1.companyName || ''}</div>
              </div>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="border: 1px solid #000; padding: 12px; height: 80px;">
              <label style="font-size: 10px; font-weight: bold; display: block; margin-bottom: 6px;">Date</label>
              <div style="border-bottom: 1px solid #000; height: 35px; font-size: 10px; padding: 4px;">${page1.date || ''}</div>
          </div>
          
            <div style="border: 1px solid #000; padding: 12px; height: 80px;">
              <label style="font-size: 10px; font-weight: bold; display: block; margin-bottom: 6px;">UID</label>
              <div style="border-bottom: 1px solid #000; height: 35px; font-size: 10px; padding: 4px;">${page1.uid || ''}</div>
            </div>
          </div>
        </div>
        
        <!-- Portfolio of Evidence Section -->
        <div style="text-align: center; margin: 40px 0; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; min-height: 200px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 30px;">Portfolio of Evidence(POE)</h1>
          <div style="width: 180px; height: 140px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <img src="/images/towricon.png" 
                 style="max-width: 100%; max-height: 100%; object-fit: contain;" 
                 alt="Tower Icon" />
          </div>
        </div>
        
        <!-- Assessor and Learner Admin Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-top: 30px; flex-grow: 1;">
          <div style="border: 1px solid #000; min-height: 180px;">
            <div style="background: #f3f4f6; padding: 12px; border-bottom: 1px solid #000;">
              <label style="font-weight: bold; font-size: 14px;">Assessor name</label>
            </div>
            <div style="padding: 20px;">
              <div style="margin-bottom: 20px; font-size: 11px; border-bottom: 1px solid #ccc; height: 25px; padding: 4px;">${page1.assessorName || ''}</div>
              <div style="margin-bottom: 20px; font-size: 11px;"><strong>ID number:</strong> ${page1.assessorIdNumber || ''}</div>
              <div style="margin-bottom: 20px; font-size: 11px;"><strong>Moderator name:</strong> ${page1.moderatorName || ''}</div>
              <div style="font-size: 11px;"><strong>ID number:</strong> ${page1.moderatorIdNumber || ''}</div>
            </div>
          </div>
          
          <div style="border: 1px solid #000; min-height: 180px;">
            <div style="background: #f3f4f6; padding: 12px; border-bottom: 1px solid #000;">
              <label style="font-weight: bold; font-size: 14px;">Learner admin</label>
            </div>
            <div style="padding: 20px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div class="checkbox${page1.originalIdCopy ? ' checked' : ''}" style="width: 16px; height: 16px; border: 1px solid #000; display: inline-block; margin-right: 10px;">${page1.originalIdCopy ? '✓' : ''}</div>
                <span style="font-size: 12px;">1 x Original copy of ID</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div class="checkbox${page1.digitalIdPhoto ? ' checked' : ''}" style="width: 16px; height: 16px; border: 1px solid #000; display: inline-block; margin-right: 10px;">${page1.digitalIdPhoto ? '✓' : ''}</div>
                <span style="font-size: 12px;">1 x Digital ID Photo</span>
              </div>
              <div style="display: flex; align-items: center;">
                <div class="checkbox${page1.medicalCertificate ? ' checked' : ''}" style="width: 16px; height: 16px; border: 1px solid #000; display: inline-block; margin-right: 10px;">${page1.medicalCertificate ? '✓' : ''}</div>
                <span style="font-size: 12px;">1 x Copy of Medical Certificate</span>
              </div>
            </div>
          </div>
        </div>
        
        ${generateFormFooter(1)}
      </div>
    </div>
  `;
};

// Page 2: Personal Information HTML - Exact match to screenshot
const generatePage2HTML = (formData: FormData) => {
  const page2 = formData.page2;
  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        
        <!-- 1. LEARNER INFORMATION FOR REGISTRATION FORM -->
        <table class="table" style="width: 100%; border-collapse: collapse; margin: 8px 0; border: 1px solid #000;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th colspan="2" style="text-align: left; font-weight: bold; padding: 6px; border: 1px solid #000; font-size: 9px;">1. LEARNER INFORMATION FOR REGISTRATION FORM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9; width: 25%;">Name</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.name || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Date of Birth</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.dateOfBirth || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Gender</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.gender || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Govt ID</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.govtId || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Designation (in)</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.designation || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Employee ID</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.employeeId || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Phone Number</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.phoneNumber || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">E-mail</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.email || ''}</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="border: 1px solid #000; padding: 2px; font-size: 7px; font-weight: bold;">Learner Emergency Contact Details/ Next of Kin</td>
              <td style="border: 1px solid #000; padding: 2px; font-size: 7px;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Phone Number</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.emergencyContactPhone || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">E-mail</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.emergencyContactEmail || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Relationship</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.emergencyContactRelationship || ''}</td>
            </tr>
          </tbody>
        </table>

        <!-- Employer Details -->
        <table class="table" style="width: 100%; border-collapse: collapse; margin: 5px 0; border: 1px solid #000;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th colspan="2" style="text-align: left; font-weight: bold; padding: 3px; border: 1px solid #000; font-size: 8px;">Employer Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9; width: 25%;">Employer Name</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.employerName || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; font-size: 8px; font-weight: bold; background: #f9f9f9;">Tel Number</td>
              <td style="border: 1px solid #000; padding: 5px; font-size: 9px; min-height: 20px;">${page2.employerTelNumber || ''}</td>
            </tr>
          </tbody>
        </table>

        <!-- Course Details -->
        <table class="table" style="width: 100%; border-collapse: collapse; margin: 5px 0; border: 1px solid #000;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th colspan="4" style="text-align: left; font-weight: bold; padding: 3px; border: 1px solid #000; font-size: 8px;">Course Details</th>
            </tr>
            <tr style="background: #f3f4f6;">
              <th colspan="2" style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px;">Fall Arrest & Rescue Management (FARM)</th>
              <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px;">1st Attempt</th>
              <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px;">2nd Attempt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2" style="border: 1px solid #000; padding: 2px; font-size: 8px;"></td>
              <td style="border: 1px solid #000; padding: 2px; text-align: center;">
              <div class="checkbox${page2.firstAttempt ? ' checked' : ''}">${page2.firstAttempt ? '✓' : ''}</div>
              </td>
              <td style="border: 1px solid #000; padding: 2px; text-align: center;">
              <div class="checkbox${page2.secondAttempt ? ' checked' : ''}">${page2.secondAttempt ? '✓' : ''}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Acknowledgment of learning assumed to be in place by learner -->
        <div style="margin: 5px 0;">
          <h3 style="font-size: 8px; font-weight: bold; margin-bottom: 3px;">Acknowledgment of learning assumed to be in place by learner:</h3>
          
          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="text-align: left; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px; width: 50%;">Basic Numeric Literacy</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px; width: 25%;">Yes</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px; width: 25%;">No</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 2px; font-size: 8px; width: 50%;"></td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 25%;">
                  <div class="radio-button${page2.basicNumericLiteracy === 'yes' ? ' selected' : ''}"></div>
                </td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 25%;">
                  <div class="radio-button${page2.basicNumericLiteracy === 'no' ? ' selected' : ''}"></div>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-top: 2px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="text-align: left; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px; width: 50%;">Basic Communication</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px; width: 25%;">Yes</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px; width: 25%;">No</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 2px; font-size: 8px; width: 50%;"></td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 25%;">
                  <div class="radio-button${page2.basicCommunication === 'yes' ? ' selected' : ''}"></div>
                </td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 25%;">
                  <div class="radio-button${page2.basicCommunication === 'no' ? ' selected' : ''}"></div>
                </td>
              </tr>
            </tbody>
          </table>
            </div>

        <!-- Learner with Special Need requirement -->
        <div style="margin: 5px 0;">
          <h3 style="font-size: 7px; font-weight: bold; margin-bottom: 3px;">Learner with Special Need requirement (Pre-Training requirement) <span style="font-size: 6px; font-weight: normal;">(Interpreter & Witness shall only be present during assessment to assist the learner in understanding the instructions by the Assessor & they shall not be part of Evaluation process)</span></h3>
          
          <!-- Observer or Witness Table -->
          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 3px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="text-align: left; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">Observer or Witness</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 10%;">Yes</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 10%;">No</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">Name/ Surname</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">Phone Number</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">ID Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 2px; font-size: 7px; width: 20%;"></td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 10%;">
                  <div class="radio-button${page2.observerWitnessRequired === 'yes' ? ' selected' : ''}"></div>
                </td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 10%;">
                  <div class="radio-button${page2.observerWitnessRequired === 'no' ? ' selected' : ''}"></div>
                </td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 20%; min-height: 18px;">${page2.observerWitnessName || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 20%; min-height: 18px;">${page2.observerWitnessPhone || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 20%; min-height: 18px;">${page2.observerWitnessIdNumber || ''}</td>
              </tr>
            </tbody>
          </table>

          <!-- Interpreter Table -->
          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 3px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="text-align: left; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">Interpreter</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 10%;">Yes</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 10%;">No</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">Name/ Surname</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">Phone Number</th>
                <th style="text-align: center; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 6px; width: 20%;">ID Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 2px; font-size: 7px; width: 20%;"></td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 10%;">
                  <div class="radio-button${page2.interpreterRequired === 'yes' ? ' selected' : ''}"></div>
                </td>
                <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 10%;">
                  <div class="radio-button${page2.interpreterRequired === 'no' ? ' selected' : ''}"></div>
                </td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 20%; min-height: 18px;">${page2.interpreterName || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 20%; min-height: 18px;">${page2.interpreterPhone || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 20%; min-height: 18px;">${page2.interpreterIdNumber || ''}</td>
              </tr>
            </tbody>
          </table>

          <!-- Additional Requirements -->
          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="text-align: left; font-weight: bold; padding: 2px; border: 1px solid #000; font-size: 7px;">Additional Requirements</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; min-height: 20px;">${page2.additionalRequirements || ''}</td>
              </tr>
            </tbody>
          </table>
          </div>

        <!-- Signatures Section -->
        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
          <div style="width: 48%; text-align: center;">
            <strong style="font-size: 7px;">Learner Signature</strong>
            ${page2.learnerSignatureImage ? `<img src="${page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <strong style="font-size: 7px;">Assessor / Facilitator Signature</strong>
            ${page2.assessorSignatureImage ? `<img src="${page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 8px; font-size: 7px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #000; padding-top: 3px;">
            <span>Page | 2</span>
        </div>
        </div>
      </div>
    </div>
  `;
};

// Page 3: Assessment Methods HTML
const generatePage3HTML = (formData: FormData) => {
  const page3 = formData.page3;
  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <h2 style="text-align: center; font-size: 10px; font-weight: bold; margin: 10px 0;">ASSESSMENT METHODS</h2>
        
        <table class="table" style="margin: 8px 0; font-size: 8px;">
          <thead>
            <tr>
              <th style="background: #f3f4f6; font-weight: bold; text-align: left; padding: 3px; border: 1px solid #000;">Component Type</th>
              <th style="background: #f3f4f6; font-weight: bold; text-align: left; padding: 3px; border: 1px solid #000;">Type of Evidence</th>
              <th style="background: #f3f4f6; font-weight: bold; text-align: center; width: 40px; padding: 3px; border: 1px solid #000;">Tick</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2" style="font-weight: bold; vertical-align: top; padding: 3px; border: 1px solid #000;">Knowledge</td>
              <td style="padding: 3px; border: 1px solid #000;">Written</td>
              <td style="text-align: center; padding: 3px; border: 1px solid #000;">
                <div class="checkbox${page3.knowledgeWritten ? ' checked' : ''}">${page3.knowledgeWritten ? '✓' : ''}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 3px; border: 1px solid #000;">Other (Please Specify type): ${page3.knowledgeOtherSpecify || ''}</td>
              <td style="text-align: center; padding: 3px; border: 1px solid #000;">
                <div class="checkbox${page3.knowledgeOtherTick ? ' checked' : ''}">${page3.knowledgeOtherTick ? '✓' : ''}</div>
              </td>
            </tr>
            <tr>
              <td rowspan="2" style="font-weight: bold; vertical-align: top; padding: 3px; border: 1px solid #000;">Practical</td>
              <td style="padding: 3px; border: 1px solid #000;">Practical application</td>
              <td style="text-align: center; padding: 3px; border: 1px solid #000;">
                <div class="checkbox${page3.practicalApplication ? ' checked' : ''}">${page3.practicalApplication ? '✓' : ''}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 3px; border: 1px solid #000;">Others (Please Specify): ${page3.practicalOthersSpecify || ''}</td>
              <td style="text-align: center; padding: 3px; border: 1px solid #000;">
                <div class="checkbox${page3.practicalOthersTick ? ' checked' : ''}">${page3.practicalOthersTick ? '✓' : ''}</div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin: 10px 0;">
          <h3 style="font-size: 10px; font-weight: bold; margin-bottom: 8px;">2. LEARNER DECLARATION OF AUTHENTICITY</h3>
          <p style="margin-bottom: 8px; font-size: 8px;">
            I declare that the evidence submitted for assessment purposes is my own work and authentic.
          </p>
          <div style="margin-bottom: 8px;">
            <strong style="font-size: 8px;">External Source referred:</strong> ${page3.externalSourceReferred || ''}
            </div>
        </div>
        
        <div style="margin: 10px 0;">
          <h3 style="font-size: 10px; font-weight: bold; margin-bottom: 8px;">3. ASSESSMENT CONTRACT</h3>
          <p style="margin-bottom: 5px; font-size: 8px;">
            I declare that the assessment plan has been agreed upon by me and the Assessor as stated in the assessment plan.
          </p>
          <table class="table" style="margin: 8px 0; font-size: 8px;">
            <thead>
              <tr>
                <th style="background: #f3f4f6; padding: 3px; border: 1px solid #000;">Type of Assessment</th>
                <th style="background: #f3f4f6; padding: 3px; border: 1px solid #000;">Methodology</th>
                <th style="background: #f3f4f6; padding: 3px; border: 1px solid #000;">Minimum Pass Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 3px; border: 1px solid #000;">Knowledge</td>
                <td style="padding: 3px; border: 1px solid #000;">Written</td>
                <td style="padding: 3px; border: 1px solid #000;">70%</td>
              </tr>
              <tr>
                <td style="padding: 3px; border: 1px solid #000;">Skill</td>
                <td style="padding: 3px; border: 1px solid #000;">Practical</td>
                <td style="padding: 3px; border: 1px solid #000;">100%</td>
              </tr>
            </tbody>
          </table>
          </div>
        
        ${generateSignatureSection(page3.learnerSignaturePage3, page3.assessorFacilitatorSignature, formData.page2.learnerSignatureImage, formData.page2.assessorSignatureImage)}
        ${generateFormFooter(3)}
      </div>
    </div>
  `;
};

// Page 4: Policies and Procedures HTML
const generatePage4HTML = (formData: FormData) => {
  const page4 = formData.page4;
  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 8px 0; font-size: 8px; line-height: 1.2;">
          <!-- Appeal bullet point -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0;"><strong>•Appeal against an assessment outcome, the training providers appeals procedure should be followed</strong></p>
          </div>

          <!-- Make use of interpreter bullet point -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0;"><strong>•Make use of an interpreter (with no technical knowledge of the subject matter) where language barriers may exist.</strong></p>
        </div>
        
          <!-- Make use of witness bullet point -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0;"><strong>•Make use of a witness to the assessment. The witness may only observe the assessment, but may not take any part in the assessment.</strong></p>
          </div>

          <!-- Receive feedback section -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0;">Receive feedback from the Assessor. Should the assessment outcome be determined as 'not yet competent', relevant information to the area in question will be communicated to you and kept on record for use in a re-assessment</p>
          </div>

          <!-- Confidentiality section -->
          <div style="margin-bottom: 12px;">
            <p style="margin: 0; margin-bottom: 4px;"><strong>Confidentiality:</strong></p>
            <p style="margin: 0;">All information related to this Portfolio of Evidence and assessment will be treated as confidential. To ensure that the information and results are used solely for the record keeping and internal process related to assessment, moderation and certification.</p>
          </div>

          <!-- 3.1.3. Assessment and moderation policy -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; margin-bottom: 3px;"><strong>3.1.3. Assessment and moderation policy:</strong></p>
            <p style="margin: 0;">The learner and the Assessor must use the information displayed on this page to familiarize themselves with the Standards, assessment and moderation procedures.</p>
          </div>

          <!-- 3.1.4. Appeals procedure -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; margin-bottom: 3px;"><strong>3.1.4. Appeals procedure:</strong></p>
            <p style="margin: 0;">The learner and Assessor must use the information displayed on this page to familiarize themselves with the appeals procedure. An appeals form may be obtained from the training provider upon request.</p>
          </div>

          <!-- 3.1.5. Re-assessment -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; margin-bottom: 3px;"><strong>3.1.5. Re-assessment:</strong></p>
            <p style="margin: 0;">All learners are entitled to be re-assessed in line with the training provider's assessment policy. Re-assessment decisions may incorporate past assessment results</p>
          </div>

          <!-- 3.1.6. Certification -->
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; margin-bottom: 3px;"><strong>3.1.6. Certification:</strong></p>
            <p style="margin: 0;">Additional administrative and identification documentation is required for successful certification.</p>
            <p style="margin: 0;">This is a legally binding document in its entirety. All pages must be completed and present. Any additional evidence/ pages must be declared in the declaration of authenticity. Signatures on the feedback and evaluation of assessment forms are acceptance of the entire document.</p>
            <p style="margin: 0;">I declare that I have been explained and understand all parts of this contract</p>
          </div>

          <!-- 4. FORMATIVE ASSESSMENT -->
          <div style="margin-top: 15px; margin-bottom: 10px;">
            <h2 style="font-size: 9px; font-weight: bold; margin: 0; margin-bottom: 3px;"><strong>4. FORMATIVE ASSESSMENT:</strong></h2>
            <h3 style="font-size: 8px; font-weight: bold; margin: 0; margin-bottom: 5px;"><strong>FALL ARREST & RESCUE MANAGEMENT –TOWER CLIMBER (FARM-TOCLI)</strong></h3>
            <p style="margin: 0; font-style: italic; font-size: 7px;"><em>Instructions: This serves as a guide for training and assists the trainer in the evaluation of a learner's performance before assessment as well as the readiness for the actual assessment.</em></p>
          </div>
        </div>

        <!-- Signatures Section -->
        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
          <div style="width: 48%; text-align: center;">
            <strong style="font-size: 7px;">Learner Signature</strong>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <strong style="font-size: 7px;">Assessor / Facilitator Signature</strong>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 8px; font-size: 7px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #000; padding-top: 3px;">
            <span>Page | 4</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Page 5: Formative Assessment HTML
const generatePage5HTML = (formData: FormData) => {
  const page5 = formData.page5;
  const outcomes = [
    { id: 'outcome1', text: 'Explain the use of a range of fall arrest equipment and knowledge of applicable regulations regarding fall arrest equipment' },
    { id: 'outcome2', text: 'Explain and use basic rope work. Include: joints limited to: Figure 8 stopper knot, Figure 8 on a bight, Double figure of 8 and the Munter knot' },
    { id: 'outcome3', text: 'Install and use Fall Arrest Systems' },
    { id: 'outcome4', text: 'Perform basic inspection and assemble full arrest equipment and systems' },
    { id: 'outcome5', text: 'Interpret and implement a fall arrest risk assessment' },
    { id: 'outcome6', text: 'Perform a fall arrest rescue to bring a casualty down to safety' },
    { id: 'outcome7', text: 'Select suitable anchor points' },
    { id: 'outcome8', text: 'Explain relevant regulations pertaining to Standards and country regulations' },
    { id: 'outcome9', text: 'Demonstrate and explain safe access to fall arrest structures relating to telecommunications' },
    { id: 'outcome10', text: 'Conduct rope rigging practices in accordance with the legislative safety Standards and job requirements. This includes the inspection, selection and use of slings and lifting tackle to safely lift tools up to a maximum of 20kg' }
  ];

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="background: #f3f4f6; padding: 8px; margin: 10px 0; border: 1px solid #000;">
          <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
            <tr>
              <td style="border: 1px solid #000; padding: 6px; background: #e5e7eb; font-weight: bold; text-align: center;">Specific Outcome</td>
              <td style="border: 1px solid #000; padding: 6px; background: #e5e7eb; font-weight: bold; text-align: center;">FALL ARREST & RESCUE MANAGEMENT - (FARM)</td>
              <td style="border: 1px solid #000; padding: 6px; background: #e5e7eb; font-weight: bold; text-align: center;">Facilitator to Tick once Learner completed task</td>
            </tr>
          </table>
        </div>

        <div style="margin: 8px 0;">
          ${outcomes.map((outcome, index) => `
            <div style="border: 1px solid #000; margin-bottom: 2px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px; font-weight: bold; background: #f9f9f9; width: 100px; border-right: 1px solid #000; font-size: 8px;">Specific Outcome ${index + 1}</td>
                  <td style="padding: 4px; background: #f9f9f9; border-right: 1px solid #000; font-size: 8px; line-height: 1.2;">${outcome.text}</td>
                  <td style="padding: 4px; background: #f9f9f9; text-align: center; width: 40px;">
                    <div class="checkbox${page5[outcome.id as keyof typeof page5] ? ' checked' : ''}" style="width: 12px; height: 12px; font-size: 8px;">${page5[outcome.id as keyof typeof page5] ? '✓' : ''}</div>
                  </td>
                </tr>
              </table>
            </div>
          `).join('')}
        </div>
        
        <div style="margin: 15px 0;">
          <h3 style="font-size: 10px; font-weight: bold; margin-bottom: 8px;">Motivation for Assessment</h3>
          <p style="font-size: 8px; margin-bottom: 4px;"><strong>Learner request for Assessment</strong></p>
          <p style="font-size: 8px; margin-bottom: 8px; line-height: 1.2;">
            This is to declare that I have completed the required training and formative assessment according to the Standards agreed upon. I would like to request to be assessed.
          </p>
          
          <div style="border: 1px solid #000; padding: 8px; margin: 8px 0;">
            <p style="font-size: 8px; font-weight: bold; margin-bottom: 4px;">Facilitator recommendation for assessment:</p>
            <div style="display: flex; gap: 15px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 3px;">
                <div class="radio-button${page5.facilitatorRecommendation === 'yes' ? ' selected' : ''}" style="width: 10px; height: 10px;"></div>
                <span style="font-size: 8px;">Yes</span>
              </div>
              <div style="display: flex; align-items: center; gap: 3px;">
                <div class="radio-button${page5.facilitatorRecommendation === 'no' ? ' selected' : ''}" style="width: 10px; height: 10px;"></div>
                <span style="font-size: 8px;">No</span>
              </div>
            </div>
            <div style="margin-top: 4px;">
              <strong style="font-size: 8px;">Facilitator Signature:</strong> ${page5.facilitatorSignature || ''}
            </div>
          </div>
        </div>

        <div style="background: #f3f4f6; padding: 8px; margin: 10px 0; border: 1px solid #000;">
          <h3 style="font-size: 10px; font-weight: bold; margin-bottom: 4px;">5. KNOWLEDGE QUESTIONNAIRE (30 marks):</h3>
          <div style="font-size: 8px; line-height: 1.2;">
            <p><strong>Instructions:</strong></p>
            <p>1. Learners are required to answer all questions (written and oral answers are accepted).</p>
            <p>2. Assessor may supplement any answer by referring to practical observation.</p>
            <p>3. A 70% average must be achieved before any may be awarded against the knowledge component. Each question carries 1 mark.</p>
          </div>
        </div>
        
        <div style="margin: 10px 0; display: flex; justify-content: space-between;">
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Learner Signature</label>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Assessor / Facilitator Signature</label>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
        </div>
        
        ${generateFormFooter(5)}
      </div>
    </div>
  `;
};

// Page 6: Questions 1-6
const generatePage6HTML = (formData: FormData) => {
  const page6 = formData.page6;

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 20px 0; font-size: 10px;">
          
          <!-- Question 1 -->
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 10px;">1. What are the risks when using a work positioning Lanyard to arrest a fall</div>
            <div style="margin-left: 15px;">
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question1 === 'a. There is no risk and a work positioning lanyard is safe to use' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a. There is no risk and a work positioning lanyard is safe to use</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question1 === 'b. The only risk is working too hard' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b. The only risk is working too hard</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question1 === 'c. There is serious risk of injury or death due to high shock load' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c. There is serious risk of injury or death due to high shock load</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question1 === 'd. It is safe to use for person under 70kg' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d. It is safe to use for person under 70kg</div>
            </div>
          </div>

          <!-- Question 2 with image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">2. The picture is an example of what?</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question2 === 'a. Fall arrest' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a. Fall arrest</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question2 === 'b. Rope Access' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b. Rope Access</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question2 === 'c. Work restraint' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c. Work restraint</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question2 === 'd. Work Positioning' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d. Work Positioning</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/qusimage2.png" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Work positioning illustration" />
            </div>
          </div>

          <!-- Question 3 with image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">3. What is the use of the following piece of fall arrest equipment?</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question3 === 'a) To arrest a fall' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) To arrest a fall</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question3 === 'b) To allow for hands free work' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) To allow for hands free work</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question3 === 'c) To rescue a person' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) To rescue a person</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question3 === 'd) To use a vertical life line' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) To use a vertical life line</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/qusimage3.png" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Shock Absorber Equipment" />
            </div>
          </div>

          <!-- Question 4 with image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">4. What is the use of the following piece of fall arrest equipment</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question4 === 'a) To arrest a fall' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) To arrest a fall</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question4 === 'b) To allow for hands free work' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) To allow for hands free work</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question4 === 'c) To rescue a person' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) To rescue a person</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question4 === 'd) To use a vertical life line' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) To use a vertical life line</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/qusimage4.png" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Lanyard Equipment" />
            </div>
          </div>

          <!-- Question 5 with image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">5. What is the use of the following piece of fall arrest equipment?</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question5 === 'a) To arrest a fall' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) To arrest a fall</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question5 === 'b) To maintain a workers head while working at height' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) To maintain a workers head while working at height</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question5 === 'c) To rescue a person' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) To rescue a person</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question5 === 'd) To use a vertical life line' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) To use a vertical life line</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/qusimage5.png" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Hard Hat Equipment" />
            </div>
          </div>

          <!-- Question 6 with image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">6. What is the use of the following piece of fall arrest equipment?</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question6 === 'a) To arrest a fall' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) To arrest a fall</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question6 === 'b) To allow for hands free' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) To allow for hands free</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question6 === 'c) To connect all the other equipment to and keep a worker safe' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) To connect all the other equipment to and keep a worker safe</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page6.question6 === 'd) To use a vertical life line' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) To use a vertical life line</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/qusimage6.png" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Safety Harness Equipment" />
            </div>
          </div>

        </div>

        ${generateSignatureSection(page6.learnerSignature, page6.assessorFacilitatorSignature, formData.page2.learnerSignatureImage, formData.page2.assessorSignatureImage)}
        ${generateFormFooter(6)}
      </div>
    </div>
  `;
};

// Page 7: Questions 7-12
const generatePage7HTML = (formData: FormData) => {
  const page7 = formData.page7;

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 20px 0; font-size: 10px;">
          
          <!-- Question 7 -->
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">7. Why must an activated shock absorbing lanyard never be used again?</div>
            <div style="margin-left: 15px;">
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question7 === 'a) It can be used again' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) It can be used again</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question7 === 'b) It will not absorb shock load again' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) It will not absorb shock load again</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question7 === 'c) because my boss says so' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) because my boss says so</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question7 === 'd) None of the above' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) None of the above</div>
            </div>
          </div>

          <!-- Question 8 with image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">8. In the picture provided what is wrong with the way the connector is being used?</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question8 === 'a) It is cross loading' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) It is cross loading</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question8 === 'b) Nothing is wrong' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) Nothing is wrong</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question8 === 'c) The slings are too small' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) The slings are too small</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question8 === 'd) The slings are too big' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) The slings are too big</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/qusimage7.png" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Connector Usage Diagram" />
            </div>
          </div>

          <!-- Question 9 with shock absorbing lanyard image -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start; page-break-inside: avoid;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">9. Given the picture provided below, identify the intact (safe to use) shock absorbing Lanyard?</div>
              <div style="margin-left: 15px;">
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question9 === 'a)' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a)</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question9 === 'b)' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b)</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question9 === 'c)' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c)</div>
                <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question9 === 'd)' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d)</div>
              </div>
            </div>
            <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-top: 20px; flex-shrink: 0; overflow: hidden;">
              <img src="/images/shock-absorbing-lanyards.jpg" 
                   style="width: 100%; height: 100%; object-fit: contain;" 
                   alt="Shock Absorbing Lanyards" />
            </div>
          </div>

          <!-- Question 10 -->
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">10. What is the main cause and outcome of suspension Trauma?</div>
            <div style="margin-left: 15px;">
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question10 === 'a) Feeling Sleepy because of lack of sleep during day' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) Feeling Sleepy because of lack of sleep during day</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question10 === 'b) Death due to Hanging stationary in a harness' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) Death due to Hanging stationary in a harness</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question10 === 'c) There is no real risk even if you work too long in the harness' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) There is no real risk even if you work too long in the harness</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question10 === 'd) None of the above' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) None of the above</div>
            </div>
          </div>

          <!-- Question 11 -->
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">11. Why must fall arrest equipment be certified and identified?</div>
            <div style="margin-left: 15px;">
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question11 === 'a) To avoid price fixing' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) To avoid price fixing</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question11 === 'b) To ensure quality management' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) To ensure quality management</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question11 === 'c) To avoid responsibility' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) To avoid responsibility</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question11 === 'd) To ensure quality and that equipment is "Safe for use and fit for purpose"' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) To ensure quality and that equipment is "Safe for use and fit for purpose"</div>
            </div>
          </div>

          <!-- Question 12 -->
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 8px;">12. What is the purpose of an anchor point when arresting a fall?</div>
            <div style="margin-left: 15px;">
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question12 === 'a) To prevent a worker from falling to the ground' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>a) To prevent a worker from falling to the ground</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question12 === 'b) An anchor has no purpose' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>b) An anchor has no purpose</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question12 === 'c) To prevent the structure from falling over' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>c) To prevent the structure from falling over</div>
              <div style="margin: 6px 0; font-size: 9px; display: flex; align-items: center;"><div class="radio-button${page7.question12 === 'd) None of the above' ? ' selected' : ''}" style="margin-right: 6px; display: inline-block; width: 10px; height: 10px;"></div>d) None of the above</div>
            </div>
          </div>

        </div>

        ${generateSignatureSection(page7.learnerSignature, page7.assessorFacilitatorSignature, formData.page2.learnerSignatureImage, formData.page2.assessorSignatureImage)}
        ${generateFormFooter(7)}
      </div>
    </div>
  `;
};

// Page 8: Questions 13-18
const generatePage8HTML = (formData: FormData) => {
  const page8 = formData.page8;
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

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 10px 0; font-size: 8px;">
          ${questions.map((question, index) => `
            <div style="margin-bottom: 12px; page-break-inside: avoid;">
              ${index === 1 ? `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 13}. ${question.text}</div>
                    <div style="margin-left: 10px;">
                ${question.options.map((option, optIndex) => `
                        <div style="margin: 3px 0;">
                          <div class="radio-button${page8[question.id as keyof typeof page8] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                          <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                  </div>
                `).join('')}
              </div>
                  </div>
                  <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                    <img src="/images/qusimage8.png" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Free space diagram" />
                  </div>
                </div>
              ` : index === 3 ? `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 13}. ${question.text}</div>
                    <div style="margin-left: 10px;">
                      ${question.options.map((option, optIndex) => `
                        <div style="margin: 3px 0;">
                          <div class="radio-button${page8[question.id as keyof typeof page8] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                          <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                    <img src="/images/qusimage9.png" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Horizontal lifeline diagram" />
                  </div>
                </div>
              ` : index === 4 ? `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 13}. ${question.text}</div>
                    <div style="margin-left: 10px;">
                      ${question.options.map((option, optIndex) => `
                        <div style="margin: 3px 0;">
                          <div class="radio-button${page8[question.id as keyof typeof page8] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                          <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                    <img src="/images/qusimage10.png" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Y-lanyard diagram" />
                  </div>
                </div>
              ` : `
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 13}. ${question.text}</div>
                <div style="margin-left: 10px;">
                  ${question.options.map((option, optIndex) => `
                    <div style="margin: 3px 0;">
                      <div class="radio-button${page8[question.id as keyof typeof page8] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                      <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          `).join('')}
        </div>
        
        <div style="margin: 10px 0; display: flex; justify-content: space-between;">
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Learner Signature</label>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Assessor / Facilitator Signature</label>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
        </div>
        
        ${generateFormFooter(8)}
      </div>
    </div>
  `;
};

// Page 9: Questions 19-24
const generatePage9HTML = (formData: FormData) => {
  const page9 = formData.page9;
  console.log('Page 9 data:', page9);
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

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 10px 0; font-size: 8px;">
          ${questions.map((question, index) => `
            <div style="margin-bottom: 12px; page-break-inside: avoid;">
              ${index === 1 ? `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 19}. ${question.text}</div>
                    <div style="margin-left: 10px;">
                      ${question.options.map((option, optIndex) => `
                        <div style="margin: 3px 0;">
                          <div class="radio-button${page9[question.id as keyof typeof page9] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                          <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                    <img src="/images/qusimage12.png" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Horizontal lifeline diagram" />
                  </div>
                </div>
              ` : index === 3 ? `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 19}. ${question.text}</div>
                    <div style="margin-left: 10px;">
                      ${question.options.map((option, optIndex) => `
                        <div style="margin: 3px 0;">
                          <div class="radio-button${page9[question.id as keyof typeof page9] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                          <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                    <img src="/images/qusimage11.png" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Falling distance diagram" />
                  </div>
                </div>
              ` : `
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 19}. ${question.text}</div>
                <div style="margin-left: 10px;">
                  ${question.options.map((option, optIndex) => `
                    <div style="margin: 3px 0;">
                      <div class="radio-button${page9[question.id as keyof typeof page9] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                      <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          `).join('')}
        </div>
        
        <div style="margin: 10px 0; display: flex; justify-content: space-between;">
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Learner Signature</label>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Assessor / Facilitator Signature</label>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
        </div>
        
        ${generateFormFooter(9)}
      </div>
    </div>
  `;
};

// Page 10: Questions 25-30
const generatePage10HTML = (formData: FormData) => {
  const page10 = formData.page10;
  console.log('Page 10 data:', page10);
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

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 10px 0; font-size: 8px;">
          ${questions.map((question, index) => `
            <div style="margin-bottom: 12px; page-break-inside: avoid;">
              ${index === 3 ? `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 25}. ${question.text}</div>
                    <div style="margin-left: 10px;">
                      ${question.options.map((option, optIndex) => `
                        <div style="margin: 3px 0;">
                          <div class="radio-button${page10[question.id as keyof typeof page10] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                          <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                    <img src="/images/qusimage13.png" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Pulley system diagram" />
                  </div>
                </div>
              ` : `
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 8px;">${index + 25}. ${question.text}</div>
                <div style="margin-left: 10px;">
                  ${question.options.map((option, optIndex) => `
                    <div style="margin: 3px 0;">
                      <div class="radio-button${page10[question.id as keyof typeof page10] === option ? ' selected' : ''}" style="margin-right: 4px; display: inline-block; width: 8px; height: 8px;"></div>
                      <span style="font-size: 7px; line-height: 1.2; color: #374151;">${option}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          `).join('')}
        </div>
        
        <div style="margin: 10px 0; display: flex; justify-content: space-between;">
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Learner Signature</label>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 2px;">Assessor / Facilitator Signature</label>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
          </div>
        </div>
        
        ${generateFormFooter(10)}
      </div>
    </div>
  `;
};

// Page 11: Risk Assessment Table
const generatePage11HTML = (formData: FormData) => {
  const page11 = formData.page11;
  console.log('Page 11 data:', page11);
  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <div style="margin: 8px 0; font-size: 8px;">
          
          <!-- Question 31 -->
          <div style="margin-bottom: 10px;">
            <div style="font-weight: bold; margin-bottom: 5px; font-size: 8px;">31. Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)</div>
            <div style="display: flex; justify-content: center; margin: 8px 0; gap: 15px;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                  <img src="images/image14.png" alt="Phone icon" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="width: 14px; height: 14px; border: 2px solid #000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${page11.question31 === 'A' ? '●' : ''}</span>
                  <span style="font-weight: bold; font-size: 10px;">A</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                  <img src="images/image15.png" alt="Warning hand" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="width: 14px; height: 14px; border: 2px solid #000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${page11.question31 === 'B' ? '●' : ''}</span>
                  <span style="font-weight: bold; font-size: 10px;">B</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100px; height: 80px; border: 2px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                  <img src="images/image16.png" alt="Car icon" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="width: 14px; height: 14px; border: 2px solid #000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${page11.question31 === 'C' ? '●' : ''}</span>
                  <span style="font-weight: bold; font-size: 10px;">C</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 32 - Risk Assessment Table -->
          <div style="margin-bottom: 10px;">
            <div style="font-weight: bold; margin-bottom: 5px; font-size: 7px;">32. Complete the risk assessment form for antenna alignment/installation at 40 meters (2 marks only if complete risk assessment is done for one of the task)</div>
            
            <table class="table" style="width: 100%; border-collapse: collapse; margin: 8px 0; border: 1px solid #000; font-size: 6px; table-layout: fixed;">
          <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 2px; text-align: left; font-weight: bold; width: 5%;" rowspan="2">
                    <div style="line-height: 1.1;">
                      <div>Sr.</div>
                      <div>No.</div>
                    </div>
                  </th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;" rowspan="2">Activity</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;" rowspan="2">Hazard</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;" rowspan="2">Risk Involved</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 24%;" colspan="3">Risk Analysis</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;" rowspan="2">Control Measures</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 24%;" colspan="3">Risk Analysis after Control</th>
                </tr>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">Severity (A)</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">Occurrence (B)</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">Risk Level AxB</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">Severity (A')</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">Occurrence (B')</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">Residue Risk Level (A'xB')</th>
                </tr>
              </thead>
              <tbody>
                ${[...Array(8)].map((_, index) => `
                  <tr>
                    <td style="border: 1px solid #000; padding: 2px; text-align: left; width: 5%; overflow: hidden; word-wrap: break-word;">${index + 1}</td>
                    <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.activity || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.hazard || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.riskInvolved || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.severityA || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.occuranceB || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.riskLevelAxB || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.controlMeasures || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.severityA2 || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.occuranceB2 || ''}</td>
                    <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 9%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page11.question32?.[index]?.residueRiskLevel || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        ${generateSignatureSection(page11.learnerSignature, page11.assessorFacilitatorSignature, formData.page2.learnerSignatureImage, formData.page2.assessorSignatureImage)}
        ${generateFormFooter(11)}
      </div>
    </div>
  `;
};

// Page 12: Equipment Inspection Record
const generatePage12HTML = (formData: FormData) => {
  const page12 = formData.page12;
  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <h2 style="text-align: center; font-size: 9px; font-weight: bold; margin: 8px 0;">7. EQUIPMENT INSPECTION RECORD</h2>
        
        <div style="margin: 8px 0;">
          <div style="display: flex; gap: 8px; margin-bottom: 5px;">
            <div style="flex: 1;">
              <strong style="font-size: 7px;">Inspected by:</strong> ${page12.inspectedBy || ''}
            </div>
            <div style="flex: 1;">
              <strong style="font-size: 7px;">Inspection Date:</strong> ${page12.inspectionDate || ''}
            </div>
          </div>

          <!-- Question 33 -->
          <div style="margin: 8px 0;">
            <div style="font-weight: bold; margin-bottom: 4px; font-size: 7px;">33. Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)</div>
            <div style="display: flex; justify-content: center; margin: 8px 0;">
              <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 4px;">
                <img src="images/image17.png" alt="Excavator" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 4px;">
                <img src="images/image18.png" alt="Tower" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 4px;">
                <img src="images/image19.png" alt="Person" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </div>
            <div style="border: 1px solid #000; padding: 3px; margin-top: 3px; min-height: 18px; background: #f9f9f9; font-size: 6px;">
              ${page12.question33 || ''}
            </div>
          </div>

          <!-- Question 34 -->
          <div style="margin: 8px 0;">
            <div style="font-weight: bold; margin-bottom: 4px; font-size: 7px;">34. Which of the following is a typical telecom tower site hazard during work at height work? (1 Mark)</div>
            <div style="display: flex; justify-content: center; margin: 8px 0;">
              <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 4px;">
                <img src="images/image20.png" alt="Crane" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 4px;">
                <img src="images/image21.png" alt="Warning" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <div style="width: 100px; height: 80px; border: 1px solid #000; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 4px;">
                <img src="images/image22.png" alt="Sparks" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </div>
            <div style="border: 1px solid #000; padding: 3px; margin-top: 3px; min-height: 18px; background: #f9f9f9; font-size: 6px;">
              ${page12.question34 || ''}
            </div>
          </div>

          <!-- Sling Inspection Table -->
          <div style="margin: 8px 0;">
            <h4 style="font-weight: bold; margin-bottom: 2px; font-size: 6px;">Sling - EN 566, 795</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 5px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Serial No.</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">Date of Manufacture</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Stitching</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">D-Links if present</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Fraying</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Pass/<br/>Reject</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">1</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.slingInspection?.[0]?.field6 || ''}</td>
            </tr>
              </tbody>
            </table>
          </div>

          <!-- Safety Harness Inspection Table -->
          <div style="margin: 8px 0;">
            <h4 style="font-weight: bold; margin-bottom: 2px; font-size: 6px;">Safety Harness - EN 361, 813, 358</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 5px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Serial No.</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">Date of Manufacture</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Stitching</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">D-rings</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Buckles</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Webbing</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">2</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHarnessInspection?.[0]?.field7 || ''}</td>
            </tr>
              </tbody>
            </table>
          </div>

          <!-- Safety Helmet Inspection Table -->
          <div style="margin: 8px 0;">
            <h4 style="font-weight: bold; margin-bottom: 2px; font-size: 6px;">Safety Helmet - EN 12492</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 5px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">Wear, Cuts & Abrasions</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">Date of Manufacture</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">Heat & Chemical Damage</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 16%;">Cracks & Deformations</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Chin Strap Clip</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Connections & Rivets</th>
                  <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 12%;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">3</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 2px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page12.safetyHelmetInspection?.[0]?.field7 || ''}</td>
            </tr>
          </tbody>
        </table>
          </div>
        </div>
        
        ${generateSignatureSection(page12.learnerSignature, page12.assessorFacilitatorSignature, formData.page2.learnerSignatureImage, formData.page2.assessorSignatureImage)}
        ${generateFormFooter(12)}
      </div>
    </div>
  `;
};

// Page 13: Advanced Equipment Inspection - Equal sized tables
const generatePage13HTML = (formData: FormData) => {
  const page13 = formData.page13;
  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <!-- Equipment Inspection Tables -->
        <div style="margin: 1px 0;">
          <!-- Safety ropes, climbing semi-static - EN 1891 -->
          <div style="margin: 1px 0;">
            <h4 style="font-weight: bold; margin-bottom: 0px; font-size: 5px;">Safety ropes, climbing semi-static - EN 1891</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 4px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Length</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Wear, Cuts & Abrasions</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Heat & Chemical Damage</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Internal Damage & Discontinuities</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Fraying</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Heavy Soiling</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%; line-height: 1.0;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 0px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">4</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.safetyRopesInspection?.[0]?.field7 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Shock Absorber - EN 355 -->
          <div style="margin: 1px 0;">
            <h4 style="font-weight: bold; margin-bottom: 0px; font-size: 5px;">Shock Absorber - EN 355</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 4px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Serial No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Date of Manufacture</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Stitching & Equipment</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Protective Cover</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Webbing</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Connectors</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%; line-height: 1.0;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 0px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">5</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.shockAbsorberInspection?.[0]?.field7 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Connector - EN 362 -->
          <div style="margin: 1px 0;">
            <h4 style="font-weight: bold; margin-bottom: 0px; font-size: 5px;">Connector - EN 362</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 4px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Body</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Bolts & Rivets</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Spring Action</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Gate</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Locking Sleeve</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Rusting</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%; line-height: 1.0;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 0px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">6</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.connectorInspection?.[0]?.field7 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Double Locking Descending Device - EN 341 -->
          <div style="margin: 1px 0;">
            <h4 style="font-weight: bold; margin-bottom: 0px; font-size: 5px;">Double Locking Descending Device - EN 341</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 4px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Body</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Bolts & Rivets</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Cams</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Spring Action</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Working Action</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Deformed</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%; line-height: 1.0;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 0px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">7</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.doubleLockingInspection?.[0]?.field7 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fall Arrest Device (Rope Grab) - EN 567 -->
          <div style="margin: 1px 0;">
            <h4 style="font-weight: bold; margin-bottom: 0px; font-size: 5px;">Fall Arrest Device (Rope Grab) - EN 567</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 4px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Body</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Bolts & Rivets</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Cams</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Spring Action</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Working Action</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Rusting</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%; line-height: 1.0;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 0px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">8</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.fallArrestDeviceInspection?.[0]?.field7 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Work Positioning Belt - EN 358 -->
          <div style="margin: 1px 0;">
            <h4 style="font-weight: bold; margin-bottom: 0px; font-size: 5px;">Work Positioning Belt - EN 358</h4>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 4px; table-layout: fixed;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 8%;">No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">ID No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Serial No</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Date of Manufacture</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Stitching</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 16%;">Buckles/Length Adjuster</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Webbing</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%;">Connectors</th>
                  <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 12%; line-height: 1.0;">Pass/<br/>Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 0px; text-align: center; width: 8%; overflow: hidden; word-wrap: break-word;">9</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field0 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field1 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field2 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field3 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 16%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field4 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field5 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field6 || ''}</td>
                  <td style="border: 1px solid #000; padding: 0px; width: 12%; overflow: hidden; word-wrap: break-word; max-width: 0;">${page13.workPositioningInspection?.[0]?.field7 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Task 2 Section -->
        <div style="margin: 2px 0;">
          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
            <thead>
              <tr style="background: #e5e7eb;">
                <th colspan="4" style="text-align: center; font-weight: bold; padding: 1px; border: 1px solid #000; font-size: 4px;">Task 2 (Total marks - 03)</th>
              </tr>
              <tr style="background: #e5e7eb;">
                <th colspan="4" style="text-align: center; font-weight: bold; padding: 1px; border: 1px solid #000; font-size: 4px;">Prepare for practical task at height</th>
              </tr>
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: left;">Subtask for Assessment Observation</th>
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: center;">A</th>
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: center;">NYA</th>
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: center;">Assessors notes & comments</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">Full range of fall arrest equipment required for all climbing tasks are identified, inspected and meet the inspection criteria explained</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task2Results?.[0]?.achieved ? ' checked' : ''}">${page13.task2Results?.[0]?.achieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task2Results?.[0]?.notAchieved ? ' checked' : ''}">${page13.task2Results?.[0]?.notAchieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">${page13.task2Results?.[0]?.comments || ''}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">Personal fall arrest equipment and Personal Protective Equipment (PPE) is assembled and fitted according to manufacturer specification</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task2Results?.[1]?.achieved ? ' checked' : ''}">${page13.task2Results?.[1]?.achieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task2Results?.[1]?.notAchieved ? ' checked' : ''}">${page13.task2Results?.[1]?.notAchieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">${page13.task2Results?.[1]?.comments || ''}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">Full range of rescue equipment is identified and inspected</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task2Results?.[2]?.achieved ? ' checked' : ''}">${page13.task2Results?.[2]?.achieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task2Results?.[2]?.notAchieved ? ' checked' : ''}">${page13.task2Results?.[2]?.notAchieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">${page13.task2Results?.[2]?.comments || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Task 3 Section -->
        <div style="margin: 2px 0;">
          <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
            <thead>
              <tr style="background: #e5e7eb;">
                <th colspan="4" style="text-align: center; font-weight: bold; padding: 1px; border: 1px solid #000; font-size: 4px;">Task 3 (Total marks - 08)</th>
              </tr>
              <tr style="background: #e5e7eb;">
                <th colspan="4" style="text-align: center; font-weight: bold; padding: 1px; border: 1px solid #000; font-size: 4px;">Installation and application of fall arrest systems. The use of the full range of required equipment are explained throughout practical use</th>
              </tr>
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: left;">Subtask for Assessment Observation</th>
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: center;">A</th>
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: center;">NYA</th>
                <th style="border: 1px solid #000; padding: 1px; font-size: 4px; text-align: center;">Assessors notes & comments</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">Installation of vertical and horizontal life line. Includes safe use of anchor points. Limited free space is managed</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task3Results?.[0]?.achieved ? ' checked' : ''}">${page13.task3Results?.[0]?.achieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center;">
                  <div class="checkbox${page13.task3Results?.[0]?.notAchieved ? ' checked' : ''}">${page13.task3Results?.[0]?.notAchieved ? '✓' : ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">${page13.task3Results?.[0]?.comments || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Signatures Section -->
        <div style="margin: 2px 0; display: flex; justify-content: space-between;">
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 1px;">Learner Signature</label>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 1px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 2px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <label style="font-size: 7px; font-weight: bold; display: block; margin-bottom: 1px;">Assessor / Facilitator Signature</label>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 1px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 2px;"></div>
          </div>
        </div>
        
        ${generateFormFooter(13)}
      </div>
    </div>
  `;
};

// Page 14: Practical Assessment Results
const generatePage14HTML = (formData: FormData) => {
  const page14 = formData.page14;

  // 7 bullet points as per screenshot
  const assessmentItems = [
    'Shock absorbing lanyards are used to safely move at height. Connectors attached to secure anchor points in a safe way. Safe fall factor maintained. Safe working load maintained',
    'Fit work positioning system and switch over from double lanyards to an installed vertical life line. Use of a fall arrestor on a life line is demonstrated and the Safe Working Load is maintained.',
    'Fit work positioning system and switch over from double lanyards to a retractable life line, to climb in area with limited free space',
    'Fit work positioning system and switch over from double lanyards to a pre-installed horizontal life line according to safe practices',
    'Limitations, and the use of all fall arrest equipment and connectors are explained through the safe use in all systems',
    'Explain the safe use and limitations of a full body harness and a work positioning system',
    'Safe movement on various fall arrest structures is demonstrated'
  ];

  // Task 4 data
  const task4Items = [
    'A rescue is awaited in a way that will minimize the risk of suspension trauma',
    'Examples of methods to help prevent suspension trauma is either explained verbally or practically demonstrated',
    'Rope rescue system is securely anchored, with a minimum safe working load (SWL) of 150kg',
    'Rescue from a fall arrest system is preformed (sufficient for both conscious and unconscious casualty)',
    'Conscious casualty - assist the rescue by attaching rescue rope according to the rescuer\'s instructions'
  ];

  // Task 5 data
  const task5Items = [
    'Demonstrate the basic principles of slinging and rigging',
    'Identify and select lifting equipment suitable for lifting tools upto 20Kg',
    'The following basic mechanical advanced systems was performed effectively during the rigging process- 1-way lift'
  ];

  // Task 6 data
  const task6Items = [
    'Figure 8 Stopper Knot',
    'Figure 8 on a bight',
    'Double figure of 8',
    'The Klemheist'
  ];

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <!-- 7 Bullet Points -->
        <div style="margin: 1px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 4px; table-layout: fixed; border: 1px solid #000;">
            <tr>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 60%;">Subtask for Assessment Observation</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">A</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">NYA</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 20%;">Assessors notes & comments</th>
            </tr>
            ${assessmentItems.map((item, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 1px; text-align: left;">
                  <div style="display: flex; align-items: flex-start; gap: 2px;">
                    <span style="font-weight: bold; margin-top: 0px;">•</span>
                    <span style="flex: 1;">${item}</span>
                  </div>
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${(page14 as any).assessmentItems?.[index]?.achieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${(page14 as any).assessmentItems?.[index]?.notAchieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px; font-size: 4px;">
                  ${(page14 as any).assessmentItems?.[index]?.comments || ''}
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <!-- Task 4 -->
        <div style="margin: 1px 0;">
          <div style="text-align: center; font-weight: bold; font-size: 4px; margin-bottom: 1px;">Task 4 (Total Marks - 05)</div>
          <div style="text-align: center; font-size: 4px; margin-bottom: 1px;">Rescue and emergency procedures are performed</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 4px; table-layout: fixed;">
            <tr>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 60%;">Subtask for Assessment Observation</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">A</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">NYA</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 20%;">Assessors notes & comments</th>
            </tr>
            ${task4Items.map((item, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 1px; text-align: left;">${item}</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${page14.task4Results?.[index]?.achieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${page14.task4Results?.[index]?.notAchieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px;">
                  <div style="border: none; width: 100%; height: 8px; font-size: 4px;">${page14.task4Results?.[index]?.comments || ''}</div>
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <!-- Task 5 -->
        <div style="margin: 1px 0;">
          <div style="text-align: center; font-weight: bold; font-size: 4px; margin-bottom: 1px;">Task 5 (Total marks - 03)</div>
          <div style="text-align: center; font-size: 4px; margin-bottom: 1px;">Use basic rope rigging principles to convey loads</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 4px; table-layout: fixed;">
            <tr>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 60%;">Subtask for Assessment Observation</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">A</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">NYA</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 20%;">Assessors notes & comments</th>
            </tr>
            ${task5Items.map((item, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 1px; text-align: left;">${item}</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${page14.task5Results?.[index]?.achieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${page14.task5Results?.[index]?.notAchieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px;">
                  <div style="border: none; width: 100%; height: 8px; font-size: 4px;">${page14.task5Results?.[index]?.comments || ''}</div>
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <!-- Task 6 -->
        <div style="margin: 1px 0;">
          <div style="text-align: center; font-weight: bold; font-size: 4px; margin-bottom: 1px;">Task 6 (Total Marks - 04)</div>
          <div style="text-align: center; font-size: 4px; margin-bottom: 1px;">Tying of the following knots are demonstrated</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 4px; table-layout: fixed;">
            <tr>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 60%;">Subtask for Assessment Observation</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">Achieved</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: center; font-weight: bold; width: 10%;">Not Yet Achieved</th>
              <th style="border: 1px solid #000; padding: 1px; text-align: left; font-weight: bold; width: 20%;">Assessors notes and comments</th>
            </tr>
            ${task6Items.map((item, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 1px; text-align: left;">${item}</td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${page14.task6Results?.[index]?.achieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 4px;">
                  ${page14.task6Results?.[index]?.notAchieved || ''}
                </td>
                <td style="border: 1px solid #000; padding: 1px;">
                  <div style="border: none; width: 100%; height: 8px; font-size: 4px;">${page14.task6Results?.[index]?.comments || ''}</div>
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <!-- Fall Arrest Practical Result -->
        <div style="border: 1px solid #000; padding: 1px; margin: 1px 0;">
          <div style="text-align: center; font-weight: bold; font-size: 4px; margin-bottom: 1px;">Fall Arrest and Fall Arrest Rescue Practical Result</div>
          <div style="display: flex; justify-content: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 2px;">
              <div class="checkbox${page14.fallArrestPracticalResult === 'achieved' ? ' checked' : ''}"></div>
              <span style="font-size: 4px;">Achieved</span>
            </div>
            <div style="display: flex; align-items: center; gap: 2px;">
              <div class="checkbox${page14.fallArrestPracticalResult === 'not-achieved' ? ' checked' : ''}"></div>
              <span style="font-size: 4px;">Not yet Achieved</span>
            </div>
          </div>
        </div>

        <!-- Signatures -->
        <div style="display: flex; justify-content: space-between; margin: 1px 0;">
          <div style="width: 48%; text-align: center;">
            <div style="font-weight: bold; font-size: 7px; margin-bottom: 1px;">Learner Signature</div>
            ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 1px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 2px;"></div>
          </div>
          <div style="width: 48%; text-align: center;">
            <div style="font-weight: bold; font-size: 7px; margin-bottom: 1px;">Assessor / Facilitator Signature</div>
            ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 1px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
            <div style="border-bottom: 1px solid #000; margin-top: 2px;"></div>
          </div>
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 4px; margin-top: 2px;">
          <div style="text-align: center;">
            <div>Page | 14</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Page 15: Workplace Application Assessment
const generatePage15HTML = (formData: FormData) => {
  const page15 = formData.page15;

  // Assessment checklist items as per screenshot
  const assessmentItems = [
    'Equipment is fitted according to manufacturer\'s requirement and all relevant parts inspected',
    'Use of double lanyard fall arrest system, selecting safe anchor points while climbing up and down',
    'One pylon hook must be connected to a sufficient strong anchor point at all times while moving at height.',
    'Safety factors must be maintained',
    'Establish a safe work positioning by utilizing a work positioning lanyard together with a fall arrest system',
    'Work belt must be fitted at height to allow free movement of the worker\'s hands. A fall arrest system must be maintained while in the work positioning at all times'
  ];

  // Learner evaluation criteria as per screenshot
  const evaluationCriteria = [
    'How did you experience the time management of the course?',
    'How would you rate the standard of the training facility? (Applicable only if the training is happening at MediHSE Safety Centre of Excellence)',
    'What was your overall impression of the equipment used in the training?'
  ];

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <!-- Section 7: Workplace Application Assessment -->
        <div style="margin: 5px 0;">
          <div style="font-size: 8px; font-weight: bold; margin-bottom: 5px;">7. WORKPLACE APPLICATION ASSESSMENT</div>
          
          <!-- Instructions -->
          <div style="background: #f3f4f6; padding: 4px; margin-bottom: 8px; border: 1px solid #000;">
            <div style="font-weight: bold; font-size: 7px; margin-bottom: 3px;">Instructions</div>
            <div style="font-size: 6px; line-height: 1.2;">
              <div style="margin-bottom: 2px;">1. The work place check list must be completed within 2 months after the knowledge and practical assessment</div>
              <div style="margin-bottom: 2px;">2. All tasks must be performed at a worksite or in simulated work at height environment.</div>
              <div style="margin-bottom: 2px;">3. Supervisor must record the learner's performance of each task.</div>
              <div style="font-weight: bold;">Note: Should the assessment take place on-site the work place check list does not need to be completed</div>
            </div>
          </div>

          <!-- Assessment Checklist -->
          <div style="margin-bottom: 8px;">
            <div style="font-size: 7px; font-weight: bold; margin-bottom: 3px;">Fit personal protective equipment required for work at height; inspect it and use it correctly</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 6px; table-layout: fixed; border: 1px solid #000;">
              <tr>
                <th style="border: 1px solid #000; padding: 2px; text-align: left; font-weight: bold; width: 80%;">Observation & site info</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 20%;">Tick</th>
              </tr>
              ${assessmentItems.map((item, index) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 2px; text-align: left; font-size: 6px;">${item}</td>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center;">
                    <div class="checkbox${page15[`assessmentItem${index}`] ? ' checked' : ''}"></div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>

          <!-- Worksite and Job Description -->
          <div style="margin-bottom: 8px;">
            <div style="font-size: 7px; font-weight: bold; margin-bottom: 3px;">Worksite and job description:</div>
            <div style="font-size: 6px; margin-bottom: 5px;">Supervisor must describe the relevant site information (for at least 1 site) where the above tasks were performed</div>
            
            <!-- Site 1 -->
            <div style="margin-bottom: 5px;">
              <div style="display: flex; gap: 10px; margin-bottom: 2px;">
                <div style="flex: 1;">
                  <div style="font-size: 6px;">Date:</div>
                  <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${(page15 as any).site1Date || ''}</div>
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 6px;">Place:</div>
                  <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${(page15 as any).site1Place || ''}</div>
                </div>
              </div>
              <div>
                <div style="font-size: 6px;">Job description:</div>
                <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${(page15 as any).site1JobDescription || ''}</div>
              </div>
            </div>

            <!-- Site 2 -->
            <div>
              <div style="display: flex; gap: 10px; margin-bottom: 2px;">
                <div style="flex: 1;">
                  <div style="font-size: 6px;">Date:</div>
                  <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${(page15 as any).site2Date || ''}</div>
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 6px;">Place:</div>
                  <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${(page15 as any).site2Place || ''}</div>
                </div>
              </div>
              <div>
                <div style="font-size: 6px;">Job description:</div>
                <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${(page15 as any).site2JobDescription || ''}</div></div>
              </div>
            </div>
          </div>

          <!-- Supervisor Information -->
          <div style="margin-bottom: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 6px; table-layout: fixed; border: 1px solid #000;">
              <tr>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 25%;">Supervisor Name</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 25%;">Supervisor ID number</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 25%;">Contact Information</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 25%;">Supervisor Signature</th>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 2px; font-size: 6px;">${page15.supervisorName || ''}</td>
                <td style="border: 1px solid #000; padding: 2px; font-size: 6px;">${page15.supervisorId || ''}</td>
                <td style="border: 1px solid #000; padding: 2px; font-size: 6px;">${page15.supervisorContact || ''}</td>
                <td style="border: 1px solid #000; padding: 2px; font-size: 6px;">${page15.supervisorSignature || ''}</td>
              </tr>
            </table>
          </div>

          <!-- Section 8: Learner Evaluation -->
          <div style="margin-top: 8px;">
            <div style="font-size: 8px; font-weight: bold; margin-bottom: 5px;">8. LEARNER EVALUATION OF ASSESSMENT</div>
            
            <div style="font-size: 6px; margin-bottom: 5px;">Learner Overall evaluation of the Assessment: 1-Needs Improvement;2-Satisfactory;3-Good;4-Excellent</div>

            <table style="width: 100%; border-collapse: collapse; font-size: 6px; table-layout: fixed; border: 1px solid #000;">
              <tr>
                <th style="border: 1px solid #000; padding: 2px; text-align: left; font-weight: bold; width: 60%;">Criteria</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 10%;">1</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 10%;">2</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 10%;">3</th>
                <th style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; width: 10%;">4</th>
              </tr>
              ${evaluationCriteria.map((criteria, index) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 2px; text-align: left; font-size: 6px;">${criteria}</td>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center;">
                    <div class="checkbox${page15[`evaluation${index}`] === '1' ? ' checked' : ''}"></div>
                  </td>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center;">
                    <div class="checkbox${page15[`evaluation${index}`] === '2' ? ' checked' : ''}"></div>
                  </td>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center;">
                    <div class="checkbox${page15[`evaluation${index}`] === '3' ? ' checked' : ''}"></div>
                  </td>
                  <td style="border: 1px solid #000; padding: 2px; text-align: center;">
                    <div class="checkbox${page15[`evaluation${index}`] === '4' ? ' checked' : ''}"></div>
                  </td>
                </tr>
              `).join('')}
            </table>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <div style="width: 48%; text-align: center;">
                <div style="font-weight: bold; font-size: 7px; margin-bottom: 3px;">Learner Signature</div>
                ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 1px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
                <div style="border-bottom: 1px solid #000; margin-top: 3px;"></div>
              </div>
              <div style="width: 48%; text-align: center;">
                <div style="font-weight: bold; font-size: 7px; margin-bottom: 3px;">Assessor / Facilitator Signature</div>
                ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 1px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
                <div style="border-bottom: 1px solid #000; margin-top: 3px;"></div>
              </div>
            </div>

            <!-- Footer -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 6px; margin-top: 8px;">
              <div style="text-align: center;">
                <div>Page | 15</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Page 16: Learner Feedback
const generatePage16HTML = (formData: FormData) => {
  const page16 = formData.page16;

  // Initial satisfaction questions as per screenshot
  const initialSatisfactionQuestions = [
    'Is the knowledge gained useful with regard to your work environment?',
    'Are you satisfied with the assessment procedure?',
    'Did you receive accurate feedback on the assessment?',
    'Are you satisfied with the Assessor and the way the assessment was handled?'
  ];

  // Before Assessment questions as per screenshot
  const beforeAssessmentQuestions = [
    'Was there opportunity to formally apply for assessment?',
    'Was the assessment planning done and agreed upon?',
    'Was there clarity about which Standard was to be assessed?',
    'Was there any information regarding the assessment process and its relevance communicated to you?',
    'Did you receive feedback regarding the assessment, appeals procedures and re-assessment procedures?',
    'Was it made clear to you that you may lodge an appeal against the assessment and was the process communicated to you?',
    'Were you trained, and given an opportunity to complete a formative assessment?'
  ];

  // Before, during and/or after assessment questions as per screenshot
  const duringAfterQuestions = [
    'Confirm that the summative assessment was done by an approved Assessor?',
    'Encourage you to participate in and contribute to the assessment process?',
    'Stay in the background and not interfere with your activities during assessment?',
    'Behave in a positive and supportive way throughout the assessment process?',
    'Provide clear and constructive feedback on the outcome of your assessment?'
  ];

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <!-- Section 11: Learner Feedback on Assessment -->
        <div style="margin: 8px 0;">
          <div style="font-size: 9px; font-weight: bold; margin-bottom: 8px;">11. LEARNER FEEDBACK ON ASSESSMENT</div>
          
          <!-- Initial Satisfaction Questions Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 7px; table-layout: fixed; border: 1px solid #000; margin-bottom: 8px;">
            <tr>
              <th style="border: 1px solid #000; padding: 3px; text-align: left; font-weight: bold; width: 60%;">Questions</th>
              <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">1</th>
              <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">2</th>
              <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">3</th>
              <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">4</th>
            </tr>
            ${initialSatisfactionQuestions.map((question, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 3px; text-align: left; font-size: 7px;">${question}</td>
                <td style="border: 1px solid #000; padding: 3px; text-align: center; font-size: 7px;">${page16[`satisfaction_${index}_1`] || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; text-align: center; font-size: 7px;">${page16[`satisfaction_${index}_2`] || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; text-align: center; font-size: 7px;">${page16[`satisfaction_${index}_3`] || ''}</td>
                <td style="border: 1px solid #000; padding: 3px; text-align: center; font-size: 7px;">${page16[`satisfaction_${index}_4`] || ''}</td>
              </tr>
            `).join('')}
          </table>

          <!-- Before Assessment Section -->
          <div style="margin-bottom: 8px;">
            <div style="font-size: 8px; font-weight: bold; margin-bottom: 5px;">Before Assessment</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 6px; table-layout: fixed; border: 1px solid #000;">
              <tr>
                <th style="border: 1px solid #000; padding: 3px; text-align: left; font-weight: bold; width: 80%;">Questions</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">Yes</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">No</th>
              </tr>
              ${beforeAssessmentQuestions.map((question, index) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 3px; text-align: left; font-size: 6px;">${question}</td>
                  <td style="border: 1px solid #000; padding: 3px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 3px;">
                      <span style="font-size: 6px;">Yes</span>
                      <div class="checkbox${page16[`beforeAssessment_${index}_yes`] === 'yes' ? ' checked' : ''}"></div>
                    </div>
                  </td>
                  <td style="border: 1px solid #000; padding: 3px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 3px;">
                      <span style="font-size: 6px;">No</span>
                      <div class="checkbox${page16[`beforeAssessment_${index}_no`] === 'no' ? ' checked' : ''}"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>

          <!-- Before, during and/or after assessment Section -->
          <div style="margin-bottom: 8px;">
            <div style="font-size: 8px; font-weight: bold; margin-bottom: 5px;">Before, during and/or after the assessment, did the Assessor:</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 6px; table-layout: fixed; border: 1px solid #000;">
              <tr>
                <th style="border: 1px solid #000; padding: 3px; text-align: left; font-weight: bold; width: 80%;">Questions</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">Yes</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">No</th>
              </tr>
              ${duringAfterQuestions.map((question, index) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 3px; text-align: left; font-size: 6px;">${question}</td>
                  <td style="border: 1px solid #000; padding: 3px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 3px;">
                      <span style="font-size: 6px;">Yes</span>
                      <div class="checkbox${page16[`duringAfter_${index}_yes`] === 'yes' ? ' checked' : ''}"></div>
                    </div>
                  </td>
                  <td style="border: 1px solid #000; padding: 3px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 3px;">
                      <span style="font-size: 6px;">No</span>
                      <div class="checkbox${page16[`duringAfter_${index}_no`] === 'no' ? ' checked' : ''}"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>

          <!-- Learner Comments -->
          <div style="margin-bottom: 8px;">
            <div style="font-size: 7px; margin-bottom: 5px;">Learner: Please provide constructive comment and annotations or opt not to comment</div>
            <div style="border: 1px solid #000; padding: 3px; min-height: 40px; font-size: 6px;">${page16.learnerComments || ''}</div>
          </div>

          <!-- Signatures -->
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <div style="width: 48%; text-align: center;">
              <div style="font-weight: bold; font-size: 7px; margin-bottom: 5px; text-align: center;">Learner Signature</div>
              ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
              <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
            </div>
            <div style="width: 48%; text-align: center;">
              <div style="font-weight: bold; font-size: 7px; margin-bottom: 5px; text-align: center;">Assessor / Facilitator Signature</div>
              ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
              <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
            </div>
          </div>

          <!-- Footer -->
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7px; margin-top: 8px;">
            <div style="text-align: center;">
              <div>Page | 16</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Page 17: Assessment Results
const generatePage17HTML = (formData: FormData) => {
  const page17 = (formData as any).page17 || {};

  const specificOutcomes = [
    { id: 1, text: 'Explain the use of a range of fall arrest equipment and knowledge of applicable regulations regulating fall arrest equipment' },
    { id: 2, text: 'Explain and use basic rope knots' },
    { id: 3, text: 'Install and use fall arrest systems' },
    { id: 4, text: 'Perform pre-use inspection and assemble fall arrest equipment and systems' },
    { id: 5, text: 'Interpret and implement a fall arrest risk assessment' },
    { id: 6, text: 'Perform a basic fall arrest rescue to bring a casualty down to safety' },
    { id: 7, text: 'Select suitable anchor points' },
    { id: 8, text: 'Explain relevant regulations pertaining to Standards and country regulations.' },
    { id: 9, text: 'Demonstrate and explain safe access to various structures' },
    { id: 10, text: 'Conduct rope rigging practices in accordance with the legislative safety Standards and job requirements. This includes the inspection, selection and use of slings and lifting tackle to safely lift tools for up to 20kg' }
  ];

  return `
    <div class="form-page">
      <div class="card full-page-content">
        ${generateFormHeader()}
        
        <!-- Section 9: Summative Assessment -->
        <div style="margin: 8px 0;">
          <div style="font-size: 9px; font-weight: bold; margin-bottom: 8px;">9. SUMMATIVE ASSESSMENT AND FEEDBACK:</div>
          
          <!-- Fall Arrest & Rescue Management Table -->
          <div style="border: 1px solid #ccc;">
            <div style="background-color: #f5f5f5; padding: 3px; font-weight: bold; font-size: 7px; text-align: center;">
              FALL ARREST & RESCUE MANAGEMENT – TOWER CLIMBER (FARM-TOCLI)
            </div>
            
            <!-- Specific Outcomes -->
            <div style="border-bottom: 1px solid #ccc;">
              <div style="display: grid; grid-template-columns: 1fr 3fr 40px 40px; gap: 0; font-size: 6px; font-weight: bold;">
                <div style="border-right: 1px solid #ccc; padding: 3px; text-align: center; font-weight: bold; font-size: 6px;">Specific Outcome 1</div>
                <div style="border-right: 1px solid #ccc; padding: 3px; font-weight: normal;">Explain the use of a range of fall arrest equipment and knowledge of applicable regulations regulating fall arrest equipment</div>
                <div style="border-right: 1px solid #ccc; padding: 3px; text-align: center;">A</div>
                <div style="padding: 3px; text-align: center;">NYA</div>
              </div>
              
              ${specificOutcomes.map((outcome, index) => `
                <div style="display: grid; grid-template-columns: 1fr 3fr 40px 40px; gap: 0; font-size: 6px; border-top: 1px solid #ccc;">
                  <div style="border-right: 1px solid #ccc; padding: 3px; text-align: center;">
                    <span style="font-weight: bold; font-size: 6px;">Specific Outcome ${outcome.id}</span>
                  </div>
                  <div style="border-right: 1px solid #ccc; padding: 3px;">
                    <span style="font-size: 5px;">${outcome.text}</span>
                  </div>
                  <div style="border-right: 1px solid #ccc; padding: 3px; display: flex; justify-content: center; align-items: center;">
                    <div class="checkbox${page17.specificOutcomes?.[index]?.achieved ? ' checked' : ''}"></div>
                  </div>
                  <div style="padding: 3px; display: flex; justify-content: center; align-items: center;">
                    <div class="checkbox${page17.specificOutcomes?.[index]?.notAchieved ? ' checked' : ''}"></div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Knowledge Questionnaire Results -->
            <div style="border-bottom: 1px solid #ccc; padding: 3px;">
              <div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; font-size: 6px;">
                <div style="font-weight: bold;">Knowledge Questionnaire Results</div>
                <div style="display: flex; align-items: center; gap: 3px;">
                  <span>A</span>
                  <div class="checkbox${page17.knowledgeResults === 'achieved' ? ' checked' : ''}"></div>
                </div>
                <div style="display: flex; align-items: center; gap: 3px;">
                  <span>NYA</span>
                  <div class="checkbox${page17.knowledgeResults === 'not-achieved' ? ' checked' : ''}"></div>
                </div>
                <div>
                  <span style="font-weight: bold;">Notes:</span>
                </div>
              </div>
            </div>

            <!-- Observation Checklist -->
            <div style="border-bottom: 1px solid #ccc; padding: 3px;">
              <div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; font-size: 6px;">
                <div style="font-weight: bold;">Observation Checklist</div>
                <div style="display: flex; align-items: center; gap: 3px;">
                  <span>A</span>
                  <div class="checkbox${page17.observationResults === 'achieved' ? ' checked' : ''}"></div>
                </div>
                <div style="display: flex; align-items: center; gap: 3px;">
                  <span>NYA</span>
                  <div class="checkbox${page17.observationResults === 'not-achieved' ? ' checked' : ''}"></div>
                </div>
                <div>
                  <span style="font-weight: bold;">Notes:</span>
                </div>
              </div>
            </div>

            <!-- Assessment Result -->
            <div style="padding: 3px;">
              <div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; font-size: 6px;">
                <div style="font-weight: bold;">Assessment Result</div>
                <div>
                  <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px;">${page17.assessmentDate || ''}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <label style="display: flex; align-items: center; gap: 3px;">
                    <div class="checkbox${page17.assessmentResult === 'competent' ? ' checked' : ''}"></div>
                    <span style="font-size: 6px;">Competent</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 3px;">
                    <div class="checkbox${page17.assessmentResult === 'not-competent' ? ' checked' : ''}"></div>
                    <span style="font-size: 6px;">Not yet Competent</span>
                  </label>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          <!-- Summative Assessment Results -->
          <div style="margin-top: 8px;">
            <div style="font-weight: bold; font-size: 7px; margin-bottom: 4px;">SUMMATIVE ASSESSMENT RESULTS</div>
            <div style="border: 1px solid #ccc; padding: 3px;">
              <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 8px; font-size: 6px;">
                <div>Knowledge, Practical and workplace application has been completed and assessed</div>
                <div>
                  <div style="font-size: 5px;">DATE:</div>
                  <div style="border-bottom: 1px solid #000; height: 12px; font-size: 5px; padding: 1px; margin-top: 2px;">${page17.summativeDate || ''}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <label style="display: flex; align-items: center; gap: 3px;">
                    <div class="checkbox${page17.summativeResults === 'completed' ? ' checked' : ''}"></div>
                    <span style="font-size: 5px;">Completed</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 3px;">
                    <div class="checkbox${page17.summativeResults === 'not-completed' ? ' checked' : ''}"></div>
                    <span style="font-size: 5px;">Not yet Completed</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Moderation -->
          <div style="margin-top: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <div style="font-size: 6px;">Moderation Date:</div>
                <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px; margin-top: 2px;">${page17.moderationDate || ''}</div>
              </div>
              <div>
                <div style="font-size: 6px;">Moderator Name:</div>
                <div style="border-bottom: 1px solid #000; height: 12px; font-size: 6px; padding: 1px; margin-top: 2px;">${page17.moderatorName || ''}</div>
              </div>
            </div>

            <div style="margin-top: 8px;">
              <div style="font-size: 6px;">Moderator Signature:</div>
              <div style="border-bottom: 1px solid #000; height: 18px; font-size: 6px; padding: 1px; margin-top: 2px;">${page17.moderatorSignature || ''}</div>
            </div>
          </div>

          <!-- Final Signatures -->
          <div style="display: flex; justify-content: space-between; margin-top: 8px;">
            <div style="width: 48%; text-align: center;">
              <div style="font-size: 7px; font-weight: bold;">Learner Signature</div>
              ${formData.page2.learnerSignatureImage ? `<img src="${formData.page2.learnerSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Learner Signature" />` : ''}
              <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
            </div>
            <div style="width: 48%; text-align: center;">
              <div style="font-size: 7px; font-weight: bold;">Assessor / Facilitator Signature</div>
              ${formData.page2.assessorSignatureImage ? `<img src="${formData.page2.assessorSignatureImage}" style="width: 60px; height: 40px; object-fit: contain; margin-top: 2px; display: block; margin-left: auto; margin-right: auto;" alt="Assessor Signature" />` : ''}
              <div style="border-bottom: 1px solid #000; margin-top: 5px;"></div>
            </div>
          </div>
        </div>

        ${generateFormFooter(17)}
      </div>
    </div>
  `;
};
