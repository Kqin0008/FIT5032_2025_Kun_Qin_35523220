// 生产环境后端服务器示例 (Node.js/Express)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 加载.env文件
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 邮件发送接口
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, attachments, recipients } = req.body;

    // 验证请求数据
    if ((!to && !recipients) || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required email fields'
      });
    }

    // 检查API密钥是否配置
    if (!process.env.EMAIL_SERVICE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Email service API key not configured'
      });
    }

    // 准备SendGrid请求数据
    let emailData;
    
    if (to) {
      // 单个收件人
      emailData = {
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: {
          email: process.env.SENDER_EMAIL || 'your_email@example.com',
          name: 'SilverCare'
        },
        content: [{
          type: 'text/plain',
          value: text
        }],
        attachments: attachments || []
      };
    } else {
      // 多个收件人
      emailData = {
        personalizations: recipients.map(email => ({
          to: [{ email }],
          subject: subject
        })),
        from: {
          email: process.env.SENDER_EMAIL || 'your_email@example.com',
          name: 'SilverCare'
        },
        content: [{
          type: 'text/plain',
          value: text
        }],
        attachments: attachments || []
      };
    }

    // 发送请求到SendGrid API
    const response = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      emailData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // 提供更详细的错误信息
    let errorMessage = error.message || 'Failed to send email';
    if (error.response) {
      errorMessage = `SendGrid API error: ${error.response.status} - ${error.response.statusText}`;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 注意：生产环境中还需要添加:
// 1. 更严格的身份验证和授权机制
// 2. 请求频率限制
// 3. 更完善的错误处理
// 4. 日志记录系统
// 5. HTTPS配置