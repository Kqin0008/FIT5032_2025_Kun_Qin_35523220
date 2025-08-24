const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure SendGrid API key
// NOTE: 您需要在Firebase环境变量中设置SENDGRID_API_KEY
// 使用命令: firebase functions:config:set sendgrid.api_key="您的SendGrid API密钥"
const SENDGRID_API_KEY = functions.config().sendgrid.api_key;
if (!SENDGRID_API_KEY) {
  console.error('SendGrid API key not configured');
}

sgMail.setApiKey(SENDGRID_API_KEY);

// 从环境配置中获取发件人邮箱
const SENDER_EMAIL = functions.config().sendgrid.sender_email || 'your_email@example.com';

/**
 * 发送电子邮件的云函数
 * @param {Object} data - 邮件数据
 * @param {string} data.to - 收件人邮箱
 * @param {string} data.subject - 邮件主题
 * @param {string} data.text - 邮件正文
 * @param {Array} [data.attachments] - 附件数组
 * @param {string} data.attachments[].content - 附件内容(Base64编码)
 * @param {string} data.attachments[].filename - 附件文件名
 * @param {string} data.attachments[].type - 附件MIME类型
 * @param {string} data.attachments[].disposition - 附件处置方式
 * @returns {Promise<Object>} - 邮件发送结果
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // 验证用户是否已认证
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '用户未认证');
  }

  const { to, subject, text, attachments } = data;

  // 验证必要参数
  if (!to || !subject || !text) {
    throw new functions.https.HttpsError('invalid-argument', '缺少必要的邮件参数');
  }

  // 准备邮件数据
  const emailData = {
    to: to,
    from: {
      email: SENDER_EMAIL,
      name: 'SilverCare'
    },
    subject: subject,
    text: text,
    attachments: attachments || []
  };

  try {
    // 发送邮件
    await sgMail.send(emailData);
    return {
      success: true,
      message: '邮件发送成功'
    };
  } catch (error) {
    console.error('邮件发送失败:', error);
    throw new functions.https.HttpsError('internal', '邮件发送失败', error);
  }
});

// 可以在这里添加更多云函数
// 例如：处理用户注册、数据同步等

// 示例：用户注册时发送欢迎邮件
// exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
//   const email = user.email;
//   const displayName = user.displayName || '用户';
//   
//   const mailOptions = {
//     from: 'YOUR_EMAIL_ADDRESS',
//     to: email,
//     subject: '欢迎加入SilverCare',
//     text: `亲爱的${displayName}，\n\n欢迎加入SilverCare！我们很高兴您成为我们社区的一员。\n\n祝您使用愉快！\nSilverCare团队`
//   };
//   
//   return transporter.sendMail(mailOptions);
// });