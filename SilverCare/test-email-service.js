import { sendEmail } from './src/services/emailService.js';

// 测试emailService
async function testEmailService() {
  try {
    console.log('Testing email service...');
    
    // 使用正确的数据调用sendEmail函数
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from Service',
      text: 'This is a test email sent from the email service.'
    });
    
    console.log('Email service response:', result);
  } catch (error) {
    console.error('Error testing email service:', error.message);
  }
}

testEmailService();