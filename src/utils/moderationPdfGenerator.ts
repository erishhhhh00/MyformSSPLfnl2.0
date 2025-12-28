// Moderation PDF Generator - Same styling as pdfGenerator.ts for FormPage 1-17
// Full page filling design with no extra space at bottom

export interface ModerationFormData {
  moderationPage1?: any;
  moderationPage2?: any;
  moderationPage3?: any;
  moderationPage4?: any;
  moderationPage5?: any;
  moderationPage6?: any;
}

export const generateModerationPDF = async (formData: ModerationFormData, toast: any) => {
  console.log('=== MODERATION PDF GENERATION STARTED ===');

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>SSIPL Moderation Plan</title>
        <style>
          ${getModerationPrintStyles()}
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: white;">
        <div class="print-container">
          ${generateModerationPage1HTML(formData)}
          ${generateModerationPage2HTML(formData)}
          ${generateModerationPage3HTML(formData)}
          ${generateModerationPage4HTML(formData)}
          ${generateModerationPage5HTML(formData)}
          ${generateModerationPage6HTML(formData)}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast({
      title: "Moderation PDF Ready!",
      description: "Print dialog will open. Choose 'Save as PDF' to download.",
    });

  } catch (error) {
    console.error('Moderation PDF Error:', error);
    toast({
      title: "PDF Failed",
      description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
  }
};

// Same styling as pdfGenerator.ts - Full page filling
const getModerationPrintStyles = () => {
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
      font-size: 10px !important;
      line-height: 1.4 !important;
      color: #000 !important;
      margin: 0;
      padding: 0;
      background: white !important;
    }
    
    .print-container {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
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
    
    .card {
      background: white !important;
      border: 2px solid #000 !important;
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
    
    .content-section {
      flex-grow: 1 !important;
    }
    
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 6px 0 !important;
      table-layout: fixed !important;
    }
    
    th, td {
      border: 1px solid #000 !important;
      padding: 5px !important;
      font-size: 9px !important;
      vertical-align: top !important;
    }
    
    th {
      background: #f3f4f6 !important;
      font-weight: bold !important;
    }
    
    .header-logo {
      text-align: center;
      margin-bottom: 10px;
    }
    
    .header-logo img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .title-row {
      text-align: center;
      margin-bottom: 15px;
    }
    
    .title-text {
      font-size: 20px !important;
      font-weight: bold !important;
    }
    
    .title-highlight {
      background: #3b82f6 !important;
      color: white !important;
      padding: 4px 12px !important;
    }
    
    .section-title {
      font-size: 11px !important;
      font-weight: bold !important;
      font-style: italic !important;
      margin: 10px 0 5px 0 !important;
    }
    
    .label-cell {
      background: #f3f4f6 !important;
      font-weight: bold !important;
      width: 35% !important;
    }
    
    .checkbox {
      width: 12px !important;
      height: 12px !important;
      border: 1px solid #000 !important;
      display: inline-block !important;
      text-align: center !important;
      line-height: 10px !important;
      font-size: 8px !important;
    }
    
    .checkbox.checked {
      background: #000 !important;
      color: white !important;
    }
    
    .form-footer {
      margin-top: auto !important;
      padding-top: 10px !important;
      border-top: 2px solid #000 !important;
      text-align: center !important;
      font-size: 8px !important;
    }
    
    .form-footer p {
      margin: 2px 0 !important;
    }
    
    .form-footer .bold {
      font-weight: bold !important;
      color: #333 !important;
    }
    
    .small-table th, .small-table td {
      font-size: 8px !important;
      padding: 3px !important;
    }
  `;
};

// Footer - matching FormPage style
const generateFooter = (pageNum: number) => {
  return `
    <div class="form-footer">
      <p>${pageNum} | Page</p>
      <p class="bold">Moderation Plan Version 1.0 SSIPL-MMP001</p>
      <p>Format created on - 01/11/2025</p>
      <p>Format updated on - 01/11/2025</p>
    </div>
  `;
};

// Page 1: Cover Page - Full page design
const generateModerationPage1HTML = (formData: ModerationFormData) => {
  const p = formData.moderationPage1 || {};
  return `
    <div class="form-page">
      <div class="card">
        <div class="header-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="title-row">
          <span class="title-text">SSIPL </span>
          <span class="title-text title-highlight">MODERATION</span>
          <span class="title-text"> PLAN</span>
        </div>
        
        <div class="content-section" style="display: flex; flex-direction: column; justify-content: center;">
          <table style="margin-top: 40px;">
            <tr>
              <th style="width: 33%;">Document Title:</th>
              <th style="width: 33%;">Type:</th>
              <th style="width: 34%;">Document Number:</th>
            </tr>
            <tr>
              <td style="text-align: center; height: 40px;">${p.documentTitle || 'MHTA Moderation Plan'}</td>
              <td style="text-align: center;">${p.type || 'Quality Assurance'}</td>
              <td style="text-align: center;">${p.documentNumber || 'SSIPL - MMP001'}</td>
            </tr>
            <tr>
              <th>Date of Implementation:</th>
              <th>Language:</th>
              <th>Revision:</th>
            </tr>
            <tr>
              <td style="text-align: center; height: 40px;">${p.dateOfImplementation || '01/11/2025'}</td>
              <td style="text-align: center;">${p.language || 'English'}</td>
              <td style="text-align: center;">${p.revision || '00'}</td>
            </tr>
          </table>
        </div>
        
        ${generateFooter(1)}
      </div>
    </div>
  `;
};

// Page 2: Moderator Details, Assessor Details, Unit Standard, Scope, Candidates
const generateModerationPage2HTML = (formData: ModerationFormData) => {
  const p = formData.moderationPage2 || {};
  const candidates = p.candidates || [];

  let candidatesHTML = '';
  for (let i = 0; i < 10; i++) {
    const c = candidates[i] || {};
    candidatesHTML += `
      <tr>
        <td style="text-align: center; font-weight: bold;">${i + 1}</td>
        <td>${c.candidateName || ''}</td>
        <td>${c.candidateSurname || ''}</td>
        <td>${c.dateOfAssessment || ''}</td>
        <td>${c.candidateIdNo || ''}</td>
        <td>${c.clientStandardName || ''}</td>
        <td>${c.assessorName || ''}</td>
        <td style="text-align: center;">${c.cNyc || ''}</td>
      </tr>
    `;
  }

  return `
    <div class="form-page">
      <div class="card">
        <div class="header-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="content-section">
          <div class="section-title">1. Moderator Details</div>
          <table>
            <tr><td class="label-cell">Name:</td><td>${p.moderatorName || ''}</td></tr>
            <tr><td class="label-cell">Registration Number:</td><td>${p.moderatorRegistration || ''}</td></tr>
            <tr><td class="label-cell">Purpose of the moderation:</td><td style="font-style: italic;">${p.moderationPurpose || 'Quality Assurance of assessment'}</td></tr>
          </table>
          
          <div class="section-title">2. Assessor Details</div>
          <table>
            <tr><td class="label-cell">Name:</td><td>${p.assessorName || ''}</td></tr>
            <tr><td class="label-cell">Registration Number:</td><td>${p.assessorRegistration || ''}</td></tr>
            <tr><td class="label-cell">Date of Moderation:</td><td>${p.dateOfModeration || ''}</td></tr>
            <tr><td class="label-cell">Number of portfolios to be moderated:</td><td>${p.numberOfPortfolios || 'of (at least 25% or a minimum of 3)'}</td></tr>
          </table>
          
          <div class="section-title">3. Unit Standard</div>
          <table>
            <tr><td class="label-cell">Vodafone Standard title:</td><td>${p.vodafoneStandardTitle || ''}</td></tr>
          </table>
          
          <div class="section-title">4. SCOPE OF MODERATION</div>
          <p style="font-size: 9px; font-weight: bold; font-style: italic; margin: 3px 0;">Special arrangements for moderation</p>
          <table>
            <tr><td class="label-cell">Place:</td><td>${p.place || ''}</td></tr>
            <tr><td class="label-cell">Resources:</td><td>${p.resources || 'Assessment tools and Client Standard'}</td></tr>
          </table>
          
          <div class="section-title">5. BATCH NO: ${p.batchNo || ''}</div>
          <table class="small-table">
            <thead>
              <tr>
                <th style="width: 5%;">Batch No.</th>
                <th>Candidate name:</th>
                <th>Candidate surname:</th>
                <th>Date of assessment:</th>
                <th>Candidate ID No:</th>
                <th>Client Standard Name:</th>
                <th>Assessor Name:</th>
                <th style="width: 6%;">C / NYC</th>
              </tr>
            </thead>
            <tbody>
              ${candidatesHTML}
            </tbody>
          </table>
        </div>
        
        ${generateFooter(2)}
      </div>
    </div>
  `;
};

// Page 3: Moderated Portfolios, Individuals, Section 7 (7.1, 7.2)
const generateModerationPage3HTML = (formData: ModerationFormData) => {
  const p = formData.moderationPage3 || {};
  const portfolios = p.moderatedPortfolios || [];
  const individuals = p.individuals || [
    { name: '', reason: 'Moderator', action: 'Report to Assessor', plannedDate: '' },
    { name: '', reason: 'Stakeholder', action: 'General Correspondence', plannedDate: '' },
    { name: '', reason: 'Assessor', action: 'Feedback on assessment', plannedDate: '' }
  ];
  const ap = p.assessmentPlanning || {};
  const ac = p.assessmentConducted || {};

  let portfoliosHTML = '';
  for (let i = 0; i < 4; i++) {
    const pf = portfolios[i] || {};
    portfoliosHTML += `
      <tr>
        <td style="text-align: center; font-weight: bold;">${i + 1}</td>
        <td>${pf.candidateName || ''}</td>
        <td>${pf.candidateSurname || ''}</td>
        <td>${pf.dateOfAssessment || ''}</td>
        <td>${pf.candidateId || ''}</td>
        <td>${pf.vodafoneStandardName || ''}</td>
        <td>${pf.assessorName || ''}</td>
        <td style="text-align: center;">${pf.cNyc || ''}</td>
      </tr>
    `;
  }

  let individualsHTML = individuals.map((ind: any) => `
    <tr>
      <td>${ind.name || ''}</td>
      <td style="font-weight: bold; font-style: italic;">${ind.reason || ''}</td>
      <td style="font-weight: bold; font-style: italic;">${ind.action || ''}</td>
      <td>${ind.plannedDate || ''}</td>
    </tr>
  `).join('');

  const q71Items = [
    { id: 'q711', text: '7.1.1. Is there evidence that the candidate requested to be assessed?' },
    { id: 'q712', text: '7.1.2. Is there evidence that assessment planning was done before the assessment was conducted?' },
    { id: 'q713', text: '7.1.3. Is there evidence that the candidate was prepared and ready for assessment?' },
    { id: 'q714', text: '7.1.4. Is there evidence that the assessment plan was agreed on between the Assessor and the candidate before assessment?' },
    { id: 'q715', text: '7.1.5. Is there evidence that the candidate was informed of all evidence requirements and rights, prior to the assessment?' },
    { id: 'q716', text: '7.1.6. Does the evidence indicate that the candidate was informed about the assessment process and the implications of the assessments?' }
  ];

  const q72Items = [
    { id: 'q721', text: '7.2.1. Were the registered Standards and properly designed assessment instruments available for the assessments?' },
    { id: 'q722', text: '7.2.2. Did the assessment methods and instruments used successfully address all relevant criteria and outcomes?' },
    { id: 'q723', text: '7.2.3. Does the evidence indicate that barriers to the assessments were taken into consideration?' },
    { id: 'q724', text: '7.2.4. Is there evidence that the assessment environment was life-like and conducive to a fair assessment?' }
  ];

  const genRows = (items: any[], dataObj: any) => items.map(item => {
    const d = dataObj[item.id] || {};
    return `
      <tr>
        <td style="width: 50%;">${item.text}</td>
        <td style="width: 10%; text-align: center;"><div class="checkbox${d.yes ? ' checked' : ''}">${d.yes ? '✓' : ''}</div></td>
        <td style="width: 10%; text-align: center;"><div class="checkbox${d.no ? ' checked' : ''}">${d.no ? '✓' : ''}</div></td>
        <td style="width: 30%;">${d.comment || ''}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="form-page">
      <div class="card">
        <div class="header-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="content-section">
          <div class="section-title">6. MODERATED PORTFOLIOS:</div>
          <table class="small-table">
            <thead>
              <tr>
                <th style="width: 5%;">Batch no.</th>
                <th>Candidate name:</th>
                <th>Candidate surname:</th>
                <th>Date of assessment:</th>
                <th>Candidate ID No:</th>
                <th>Vodafone Standard Name:</th>
                <th>Assessor Name:</th>
                <th style="width: 6%;">C / NYC</th>
              </tr>
            </thead>
            <tbody>
              ${portfoliosHTML}
            </tbody>
          </table>
          
          <p style="font-size: 8px; font-weight: bold; font-style: italic; margin: 8px 0 4px;">
            Individuals who need to be Involved with or Informed of this Moderation
          </p>
          <table class="small-table">
            <thead>
              <tr>
                <th>Initials & Name:</th>
                <th>Reason for their Involvement:</th>
                <th>Action required from Moderator:</th>
                <th>Planned Date for completion:</th>
              </tr>
            </thead>
            <tbody>
              ${individualsHTML}
            </tbody>
          </table>
          
          <div class="section-title">7. MODERATION INSTRUMENT AND REPORT</div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">MODERATION CRITERIA</th>
                <th style="width: 10%; text-align: center;">YES</th>
                <th style="width: 10%; text-align: center;">NO</th>
                <th style="width: 30%;">COMMENT</th>
              </tr>
            </thead>
          </table>
          
          <p style="font-weight: bold; font-size: 9px; margin: 4px 0;">7.1. Assessment planning</p>
          <table class="small-table">
            <tbody>
              ${genRows(q71Items, ap)}
            </tbody>
          </table>
          
          <p style="font-weight: bold; font-size: 9px; margin: 4px 0;">7.2. Assessment Conducted</p>
          <table class="small-table">
            <tbody>
              ${genRows(q72Items, ac)}
            </tbody>
          </table>
        </div>
        
        ${generateFooter(3)}
      </div>
    </div>
  `;
};

// Page 4: Continuation of 7.2, 7.3, 7.4, Section 8
const generateModerationPage4HTML = (formData: ModerationFormData) => {
  const p = formData.moderationPage4 || {};
  const acc = p.assessmentConductedCont || {};
  const ad = p.assessmentDocumentation || {};
  const ar = p.assessmentReviews || {};
  const af = p.assessmentFeedback || {};

  const q725 = acc.q725 || {};

  const docItems = [
    { id: 'q726', text: '7.2.6. Was the assessment properly document and recorded?' },
    { id: 'q727', text: '7.2.7. Is the evidence submitted by the candidate valid?' },
    { id: 'q728', text: '7.2.8. Is the evidence submitted by the candidate authentic?' },
    { id: 'q729', text: '7.2.9. Is the evidence submitted by the candidate current?' },
    { id: 'q7210', text: '7.2.10. Is there evidence that the Assessor used to make an assessment judgment sufficient?' },
    { id: 'q7211', text: '7.2.11. Does the evidence clearly indicate that the candidate was judged competent or not yet competent?' }
  ];

  const reviewItems = [
    { id: 'q731', text: '7.3.1. Did the Assessor do an assessment review?' },
    { id: 'q732', text: '7.3.2. Did the Assessor identify strengths and weaknesses in the assessment process?' },
    { id: 'q733', text: '7.3.3. Did the Assessor identify strengths and weaknesses in the assessment instruments?' },
    { id: 'q734', text: '7.3.4. Did the Assessor identify strengths and weaknesses in the V/S used?' },
    { id: 'q735', text: '7.3.5. Did the Assessor incorporate the feedback of his candidate in his assessment review?' }
  ];

  const feedbackItems = [
    { id: 'q741', text: '7.4.1. Was the candidate given clear and constructive feedback?' },
    { id: 'q742', text: '7.4.2. Was the feedback given on all the outcomes and assessment criteria?' },
    { id: 'q743', text: '7.4.3. Was the appeals procedure accessible and explained to the candidate?' },
    { id: 'q744', text: '7.4.4. Were re-assessment options given to the candidate, judged as Not Yet Competent (NYC)?' },
    { id: 'q745', text: '7.4.5. Did the Assessors receive feedback from the candidate on the assessment process?' },
    { id: 'q746', text: '7.4.6. Assessor\'s decision reviewed' }
  ];

  const genRows = (items: any[], data: any) => items.map(item => {
    const d = data[item.id] || {};
    return `
      <tr>
        <td style="width: 50%;">${item.text}</td>
        <td style="width: 10%; text-align: center;"><div class="checkbox${d.yes ? ' checked' : ''}">${d.yes ? '✓' : ''}</div></td>
        <td style="width: 10%; text-align: center;"><div class="checkbox${d.no ? ' checked' : ''}">${d.no ? '✓' : ''}</div></td>
        <td style="width: 30%;">${d.comment || ''}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="form-page">
      <div class="card">
        <div class="header-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="content-section">
          <table class="small-table">
            <tr>
              <td style="width: 50%;">7.2.5. Did the assessment take place according to an assessment plan?</td>
              <td style="width: 10%; text-align: center;"><div class="checkbox${q725.yes ? ' checked' : ''}">${q725.yes ? '✓' : ''}</div></td>
              <td style="width: 10%; text-align: center;"><div class="checkbox${q725.no ? ' checked' : ''}">${q725.no ? '✓' : ''}</div></td>
              <td style="width: 30%;">${q725.comment || ''}</td>
            </tr>
          </table>
          
          <table class="small-table">
            <thead>
              <tr>
                <th style="width: 50%;">MODERATION CRITERIA</th>
                <th style="width: 10%; text-align: center;">YES</th>
                <th style="width: 10%; text-align: center;">NO</th>
                <th style="width: 30%;">COMMENT</th>
              </tr>
            </thead>
            <tbody>
              ${genRows(docItems, ad)}
            </tbody>
          </table>
          
          <p style="font-weight: bold; font-size: 9px; margin: 6px 0 4px;">7.3. Assessment Reviews</p>
          <table class="small-table">
            <tbody>
              ${genRows(reviewItems, ar)}
            </tbody>
          </table>
          
          <p style="font-weight: bold; font-size: 9px; margin: 6px 0 4px;">7.4. Assessment Feedback</p>
          <table class="small-table">
            <tbody>
              ${genRows(feedbackItems, af)}
            </tbody>
          </table>
          
          <div class="section-title">8. MODERATION OF PERFORMANCE INDICATORS</div>
        </div>
        
        ${generateFooter(4)}
      </div>
    </div>
  `;
};

// Page 5: Assessment Principles, Feedback Comments, Date/Signature
const generateModerationPage5HTML = (formData: ModerationFormData) => {
  const p = formData.moderationPage5 || {};
  const ap = p.assessmentPrinciples || {};

  const principles = [
    { key: 'appropriateness', label: 'Appropriateness' },
    { key: 'fairness', label: 'Fairness' },
    { key: 'manageability', label: 'Manageability' },
    { key: 'integration', label: 'Integration into work or learning' },
    { key: 'validity', label: 'Validity' },
    { key: 'direct', label: 'Direct' },
    { key: 'authenticity', label: 'Authenticity' },
    { key: 'sufficient', label: 'Sufficient' },
    { key: 'systematic', label: 'Systematic' },
    { key: 'open', label: 'Open' },
    { key: 'consistent', label: 'Consistent' }
  ];

  const principlesHTML = principles.map(pr => {
    const d = ap[pr.key] || {};
    return `
      <tr>
        <td style="font-style: italic; width: 40%;">${pr.label}</td>
        <td style="text-align: center; width: 10%;"><div class="checkbox${d.yes ? ' checked' : ''}">${d.yes ? '✓' : ''}</div></td>
        <td style="text-align: center; width: 10%;"><div class="checkbox${d.no ? ' checked' : ''}">${d.no ? '✓' : ''}</div></td>
        <td style="width: 40%;">${d.comment || ''}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="form-page">
      <div class="card">
        <div class="header-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="content-section">
          <p style="font-size: 10px; font-style: italic; margin-bottom: 8px;">Did the Assessor comply with the assessment principles?</p>
          
          <table>
            <thead>
              <tr>
                <th style="width: 40%;"></th>
                <th style="width: 10%; text-align: center;">YES</th>
                <th style="width: 10%; text-align: center;">NO</th>
                <th style="width: 40%;">COMMENT</th>
              </tr>
            </thead>
            <tbody>
              ${principlesHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 15px;">
            <table>
              <tr>
                <td class="label-cell" colspan="2">Feedback comments from Moderator:</td>
              </tr>
              <tr>
                <td colspan="2" style="min-height: 120px; padding: 10px; height: 120px;">${p.feedbackComments || ''}</td>
              </tr>
            </table>
          </div>
          
          <table style="margin-top: 10px;">
            <tr>
              <td class="label-cell" style="width: 30%;">DATE:</td>
              <td style="width: 70%;">${p.date || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">SIGNATURE of MODERATOR:</td>
              <td>${p.moderatorSignature || ''}</td>
            </tr>
          </table>
        </div>
        
        ${generateFooter(5)}
      </div>
    </div>
  `;
};

// Page 6: Section 9 Feedback to Assessor, Section 10 Moderator's Review Report
const generateModerationPage6HTML = (formData: ModerationFormData) => {
  const p = formData.moderationPage6 || {};
  const mr = p.moderatorReview || {};

  const reviewQuestions = [
    { id: 'q1', text: 'Did the planning and preparation for this moderation meet the requirements of the overall moderation system currently in place?' },
    { id: 'q2', text: 'Did my planning for this moderation enable me to complete a manageable moderation resulting in a fair judgment?' },
    { id: 'q3', text: 'Did the moderation technique(s) and instruments used, uphold the principles of assessment?' },
    { id: 'q4', text: 'Were there any unforeseen events during the moderation that could have compromised the principle of validity?' },
    { id: 'q5', text: 'Am I satisfied that the nature and quality of advice and support that I provided the Assessor(s) facilitated a common understanding of the assessment process in accordance with good assessment principles?' },
    { id: 'q6', text: 'Am I satisfied that this moderation was recorded and reported in a manner that meets confidentiality requirements as well as the requirements for Vodafone verification?' }
  ];

  const reviewHTML = reviewQuestions.map(q => {
    const d = mr[q.id] || {};
    return `
      <tr>
        <td style="font-size: 8px; width: 55%;">${q.text}</td>
        <td style="text-align: center; width: 8%;"><div class="checkbox${d.y ? ' checked' : ''}">${d.y ? '✓' : ''}</div></td>
        <td style="text-align: center; width: 8%;"><div class="checkbox${d.n ? ' checked' : ''}">${d.n ? '✓' : ''}</div></td>
        <td style="font-size: 8px; width: 29%;">${d.comment || ''}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="form-page">
      <div class="card">
        <div class="header-logo">
          <img src="/images/logo.png" alt="SSIPL Logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="content-section">
          <div class="section-title">9. MODERATION FEEDBACK TO ASSESSOR</div>
          
          <table>
            <tr>
              <td class="label-cell" colspan="2">Feedback comments from Assessor:</td>
            </tr>
            <tr>
              <td colspan="2" style="min-height: 80px; padding: 10px; height: 80px;">${p.feedbackToAssessor || ''}</td>
            </tr>
          </table>
          
          <table style="margin-top: 8px;">
            <tr>
              <td class="label-cell" style="width: 20%;">DATE:</td>
              <td style="width: 30%;">${p.assessorDate || ''}</td>
              <td class="label-cell" style="width: 25%;">SIGNATURE of ASSESSOR:</td>
              <td style="width: 25%;">${p.assessorSignature || ''}</td>
            </tr>
          </table>
          
          <div class="section-title">10. MODERATOR'S REVIEW REPORT</div>
          
          <table class="small-table">
            <thead>
              <tr>
                <th style="width: 55%;">MODERATION ASPECTS</th>
                <th style="width: 8%; text-align: center;">Y</th>
                <th style="width: 8%; text-align: center;">N</th>
                <th style="width: 29%;">COMMENT</th>
              </tr>
            </thead>
            <tbody>
              ${reviewHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 15px;">
            <table>
              <tr>
                <td class="label-cell" style="width: 25%;">Moderator Signature:</td>
                <td style="width: 25%;">${p.moderatorSignature || ''}</td>
                <td class="label-cell" style="width: 15%;">Date:</td>
                <td style="width: 35%;">${p.moderatorDate || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Assessor Signature:</td>
                <td>${p.assessorSignature2 || ''}</td>
                <td class="label-cell">Date:</td>
                <td>${p.assessorDate2 || ''}</td>
              </tr>
            </table>
          </div>
        </div>
        
        ${generateFooter(6)}
      </div>
    </div>
  `;
};

// Export function to get all moderation pages HTML
export const getAllModerationPagesHTML = (formData: ModerationFormData) => {
  return `
    ${generateModerationPage1HTML(formData)}
    ${generateModerationPage2HTML(formData)}
    ${generateModerationPage3HTML(formData)}
    ${generateModerationPage4HTML(formData)}
    ${generateModerationPage5HTML(formData)}
    ${generateModerationPage6HTML(formData)}
  `;
};

// Export the print styles
export { getModerationPrintStyles };
