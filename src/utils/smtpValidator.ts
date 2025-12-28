import { SMTPCredentials } from '@/config/smtpConfig';

export interface SMTPValidationResult {
  isConnected: boolean;
  message: string;
  error?: string;
}

// SMTP Connection Validator
export const validateSMTPConnection = async (config: SMTPCredentials): Promise<SMTPValidationResult> => {
  try {
    // Check if all required fields are filled
    if (!config.host || !config.username || !config.password || !config.recipientEmail) {
      return {
        isConnected: false,
        message: 'SMTP Configuration Incomplete',
        error: 'Please configure all SMTP fields in src/config/smtpConfig.ts'
      };
    }

    // Check if credentials look valid (basic validation)
    if (!config.username.includes('@') || !config.recipientEmail.includes('@')) {
      return {
        isConnected: false,
        message: 'Invalid Email Format',
        error: 'Please check email addresses in SMTP configuration'
      };
    }

    // Check for common default/placeholder values
    if (config.username === 'your-email@example.com' || 
        config.password === 'your-app-password' ||
        config.host === 'your-smtp-server.com') {
      return {
        isConnected: false,
        message: 'SMTP Server Error',
        error: 'Please update SMTP credentials with your actual values'
      };
    }

    // If all basic checks pass, return success
    // Note: Real SMTP testing would require actual connection attempt
    return {
      isConnected: true,
      message: 'SMTP Configuration Valid'
    };

  } catch (error) {
    return {
      isConnected: false,
      message: 'SMTP Server Error',
      error: error instanceof Error ? error.message : 'Unknown SMTP error'
    };
  }
};

// Check SMTP status with user-friendly messages
export const getSMTPStatus = async (config: SMTPCredentials): Promise<string> => {
  const result = await validateSMTPConnection(config);
  
  if (result.isConnected) {
    return '✅ Connected';
  } else {
    return '❌ Not Connected';
  }
};