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
    const emailData = req.body;

    // 检查API密钥是否配置
    if (!process.env.EMAIL_SERVICE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Email service API key not configured'
      });
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
    let errorDetails = {};
    
    if (error.response) {
      errorMessage = `SendGrid API error: ${error.response.status} - ${error.response.statusText}`;
      // 尝试获取SendGrid返回的具体错误信息
      if (error.response.data && error.response.data.errors) {
        errorDetails = error.response.data.errors;
        console.error('SendGrid API errors:', errorDetails);
      }
    }
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: errorMessage,
      details: errorDetails
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