// Import required modules
import sgMail from '@sendgrid/mail';
// Import Firebase services from firebase.js
import { functions } from '@/firebase.js';



// Configure SendGrid API key
const SENDGRID_API_KEY = import.meta.env.VITE_EMAIL_SERVICE_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

// Configure axios instance to avoid setting User-Agent header
if (sgMail.request && sgMail.request.defaults && sgMail.request.defaults.headers) {
  // Remove User-Agent header from common headers
  delete sgMail.request.defaults.headers.common['User-Agent'];
  // Also check and remove from headers
  delete sgMail.request.defaults.headers['User-Agent'];
  // Set headers directly to ensure no User-Agent is set
  sgMail.request.defaults.headers = {
    ...sgMail.request.defaults.headers,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // Add a request interceptor to ensure User-Agent is always removed
  const originalRequest = sgMail.request;
  sgMail.request = function(config) {
    // Remove User-Agent header if it exists
    if (config.headers) {
      delete config.headers['User-Agent'];
      delete config.headers.common['User-Agent'];
    }
    return originalRequest(config);
  };
}

// Production environment configuration
const isProduction = process.env.NODE_ENV === 'production';
console.log('Environment check - isProduction:', isProduction);
console.log('Firebase functions available:', typeof functions !== 'undefined' ? 'YES' : 'NO');
if (functions) {
  console.log('Firebase httpsCallable available:', typeof functions.httpsCallable === 'function' ? 'YES' : 'NO');
}

// Helper function to send email with multiple recipients

/**
 * Send email using SendGrid SDK or backend API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 * @param {Array} attachments - Optional array of attachments
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendEmail = async ({ to, subject, text, attachments }) => {
  try {
    console.log('Preparing to send email:', {
      to,
      subject,
      text,
      hasAttachment: attachments && attachments.length > 0,
      isProduction
    });

    // Process attachments if any
    let processedAttachments = [];
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      console.log('Processing', attachments.length, 'attachments');
      for (const attachment of attachments) {
        // Ensure content is pure base64 without any prefix
        const base64Content = (attachment.base64 || attachment.content || '').split(',').pop();
        if (!base64Content) {
          console.error('Attachment has no valid base64 content:', attachment);
          continue;
        }
        processedAttachments.push({
          content: base64Content,
          filename: attachment.filename || attachment.fileName || 'attachment',
          type: attachment.type || attachment.fileType || 'application/octet-stream',
          disposition: 'attachment'
        });
      }
    } else if (attachments) {
      console.error('Attachments is not an array:', attachments);
    }

    // Prepare email data in SendGrid API format
    const emailData = {
      personalizations: [{
        to: [{ email: to }],
        subject: subject
      }],
      from: {
        email: import.meta.env.VITE_SENDER_EMAIL || 'your_verified_sender@example.com'
      },
      content: [{
        type: 'text/plain',
        value: text
      }],
      attachments: processedAttachments
    };

    if (isProduction) {
      // Production: Call Cloud Function
      console.log('Attempting to send email via Cloud Function');
      
      if (!functions) {
        console.error('Firebase Functions not initialized');
        throw new Error('Firebase Functions not initialized');
      }
      
      // Ensure httpsCallable is available
      if (typeof functions.httpsCallable !== 'function') {
        console.error('Firebase Functions httpsCallable is not available');
        console.error('Available functions properties:', Object.keys(functions));
        throw new Error('Firebase Functions httpsCallable is not available');
      }
      
      // Get the sendEmail Cloud Function
      console.log('Getting sendEmail Cloud Function');
      const sendEmailFunction = functions.httpsCallable('sendEmail');
      
      // Call the Cloud Function
      console.log('Calling Cloud Function with data:', emailData);
      const result = await sendEmailFunction(emailData);
      console.log('Cloud Function result:', result);
      return result.data;
    } else {
      // Development: Use proxy to send email via local server
      // Send the prepared emailData directly as it's already in SendGrid API format
      const sendGridData = emailData;

      console.log('Sending email via local server with data:', sendGridData);

      // Send email via proxy server
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendGridData)
      });

      console.log('Email service response status:', response.status);
  
      if (!response.ok) {
        // 获取详细的错误信息
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('Email service error response text:', errorText);
          // 尝试解析JSON，如果失败则使用原始文本
          try {
            const errorData = JSON.parse(errorText);
            errorDetails = `Status: ${response.status}, Message: ${errorData.message || response.statusText}`;
          } catch (parseError) {
            errorDetails = `Status: ${response.status}, Details: ${errorText || response.statusText}`;
          }
        } catch (readError) {
          errorDetails = `Status: ${response.status}, Could not read response body`;
        }

        console.error('Email service error response:', {
          status: response.status,
          statusText: response.statusText,
          errorDetails
        });

        throw new Error(`Failed to send email: ${errorDetails}`);
      }
  
      const result = await response.json();
      return {
        success: result.success,
        message: result.message
      };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email'
    };
  }
};

// Function to handle file upload for attachments
export const uploadAttachment = async (file) => {
  try {
    console.log('Uploading attachment:', file.name);

    // For development environment: Convert file to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract base64 data without prefix
        const base64 = reader.result.split(',')[1];
        resolve({
          success: true,
          base64: base64,
          fileName: file.name,
          fileType: file.type
        });
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error processing attachment:', error);
    return {
      success: false,
      message: error.message || 'Failed to process attachment'
    };
  }
};

// Helper function to send email with multiple recipients
export const sendBulkEmail = async (recipients, subject, text, attachment) => {
  try {
    // Process attachment if present
    let attachments = [];
    if (attachment) {
      const uploadResult = await uploadAttachment(attachment);
      if (uploadResult.success) {
        // Use the base64 data directly from uploadAttachment result
        attachments.push({
          content: uploadResult.base64,
          filename: uploadResult.fileName,
          type: uploadResult.fileType,
          disposition: 'attachment'
        });
      }
    }

    // Prepare emails data for multiple recipients
    const emailsData = recipients.map(email => ({
      to: email,
      subject: subject,
      text: text,
      attachments: attachments
    }));

    if (isProduction) {
      // Production: Use Firebase Cloud Functions
      if (!functions) {
        throw new Error('Firebase Functions not initialized');
      }

      // Get the sendBulkEmail Cloud Function
      const sendBulkEmailFunction = functions.httpsCallable('sendBulkEmail');

      // Call the Cloud Function
      const result = await sendBulkEmailFunction(emailsData);
      return result.data;
    } else {
      // Development: Use proxy to send emails via local server
      // Format data according to SendGrid API requirements
      const sendGridData = {
        personalizations: [{
          to: recipients.map(email => ({ email })),
          subject: subject
        }],
        from: {
          email: import.meta.env.VITE_SENDER_EMAIL || 'your_verified_sender@example.com'
        },
        content: [{
          type: 'text/plain',
          value: text
        }],
        attachments: attachments
      };
  
      // Send email via proxy server
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendGridData)
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || response.statusText;
        throw new Error(`Failed to send bulk email: ${errorMessage}`);
      }
  
      const result = await response.json();
      return {
        success: result.success,
        message: result.message || `Bulk email sent to ${recipients.length} recipients`
      };
    }
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send bulk email'
    };
  }
};