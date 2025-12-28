// SMTP Configuration File
// Site owners can update these credentials to configure email sending

export interface SMTPCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  useSSL: boolean;
  useTLS: boolean;
  recipientEmail: string;
  senderName: string;
}

// Default SMTP configuration - UPDATE THESE VALUES
export const defaultSMTPConfig: SMTPCredentials = {
  host: 'smtp.gmail.com',
  port: 465,
  username: 'er.sndpsjwn@gmail.com',
  password: 'oqqd eqqh gbcr eeau',
  useSSL: true,
  useTLS: false,
  recipientEmail: 'er.sndpsjwn@gmail.com',
  senderName: 'FARM Assessment System'
};

// Instructions for SMTP setup
export const SMTP_SETUP_INSTRUCTIONS = `
SMTP CONFIGURATION INSTRUCTIONS:
================================

1. UPDATE THE VALUES ABOVE:
   - host: Your email provider's SMTP server
   - port: SMTP port (587 for TLS, 465 for SSL)
   - username: Your email address
   - password: Your email app password (NOT regular password)
   - useSSL/useTLS: Choose based on your provider
   - recipientEmail: Where to send the form submissions

2. COMMON SMTP SETTINGS:
   Gmail: smtp.gmail.com, port 587, TLS
   Outlook: smtp-mail.outlook.com, port 587, TLS
   Yahoo: smtp.mail.yahoo.com, port 587, TLS

3. APP PASSWORD SETUP (Gmail):
   - Enable 2-factor authentication
   - Go to Google Account > Security > App passwords
   - Generate app password for "Mail"
   - Use this password in the config above

4. TEST CONNECTION:
   The system will validate SMTP connection before sending emails.
`;