import emailjs from 'emailjs-com';
import { defaultSMTPConfig, SMTPCredentials } from '@/config/smtpConfig';
import { validateSMTPConnection } from '@/utils/smtpValidator';

// Email Service for sending form data
export interface EmailSendResult {
  success: boolean;
  message: string;
  error?: string;
}

// Send form data via email (without PDF download)
export const sendFormEmail = async (formData: any, config: SMTPCredentials = defaultSMTPConfig): Promise<EmailSendResult> => {
  try {
    // First validate SMTP connection
    const validationResult = await validateSMTPConnection(config);
    
    if (!validationResult.isConnected) {
      return {
        success: false,
        message: validationResult.message,
        error: validationResult.error
      };
    }

    // Generate PDF blob for email attachment (without downloading)
    const pdfBlob = await generatePDFBlob(formData);
    const pdfBase64 = await blobToBase64(pdfBlob);
    
    // Prepare email content with form data
    const emailContent = generateEmailContent(formData);
    
    // For now, simulate email sending (replace with actual SMTP implementation)
    console.log('Email would be sent with the following data:', {
      to: config.recipientEmail,
      from: config.username,
      subject: 'FARM Assessment Form Submission',
      content: emailContent,
      attachmentSize: `${(pdfBlob.size / 1024 / 1024).toFixed(2)} MB`
    });

    // Simulate successful email sending
    return {
      success: true,
      message: 'Thank You! Your form has been sent successfully.'
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: 'SMTP server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Generate PDF blob without downloading
const generatePDFBlob = async (formData: any): Promise<Blob> => {
  // Import jsPDF dynamically
  const jsPDF = (await import('jspdf')).default;
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add form data to PDF (simplified version)
  pdf.text('FARM Assessment Form', 20, 20);
  pdf.text(`Learner: ${formData.page1?.learnerName || 'N/A'}`, 20, 40);
  pdf.text(`Company: ${formData.page1?.companyName || 'N/A'}`, 20, 50);
  pdf.text(`Date: ${formData.page1?.date || new Date().toLocaleDateString()}`, 20, 60);
  
  // Convert to blob
  const pdfOutput = pdf.output('blob');
  return pdfOutput;
};

// Generate email content from form data
const generateEmailContent = (formData: any): string => {
  return `
FARM Assessment Form Submission

Learner Information:
- Name: ${formData.page1?.learnerName || 'N/A'}
- ID Number: ${formData.page1?.idNumber || 'N/A'}
- Company: ${formData.page1?.companyName || 'N/A'}
- Date: ${formData.page1?.date || 'N/A'}

Assessment Details:
- Assessor: ${formData.page1?.assessorName || 'N/A'}
- Moderator: ${formData.page1?.moderatorName || 'N/A'}

Please find the complete form data attached as PDF.

This is an automated message from the FARM Assessment System.
  `;
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Check SMTP connection status
export const checkSMTPConnection = async (config: SMTPCredentials = defaultSMTPConfig): Promise<EmailSendResult> => {
  const validationResult = await validateSMTPConnection(config);
  
  return {
    success: validationResult.isConnected,
    message: validationResult.message,
    error: validationResult.error
  };
};