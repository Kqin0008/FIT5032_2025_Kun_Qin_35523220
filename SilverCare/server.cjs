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

// 模拟数据库存储预约信息
const appointments = [];

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

// 预约处理接口
app.post('/api/book-appointment', async (req, res) => {
  try {
    const { date, time, userId, userName } = req.body;

    // 验证必要参数
    if (!date || !time || !userId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的预约参数'
      });
    }

    // 检查是否已存在相同时间的预约
    // 注意：在实际生产环境中，这里应该使用数据库查询
    // 为了简化示例，我们使用一个内存数组来模拟数据库
    const existingAppointment = appointments.find(
      appointment => appointment.date === date && appointment.time === time
    );

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: '该时间段已被预约'
      });
    }

    // 保存预约信息
    const newAppointment = {
      id: appointments.length + 1,
      date,
      time,
      userId,
      userName: userName || '未知用户',
      createdAt: new Date()
    };

    appointments.push(newAppointment);

    res.json({
      success: true,
      message: '预约成功',
      data: newAppointment
    });
  } catch (error) {
    console.error('预约处理失败:', error);
    res.status(500).json({
      success: false,
      message: '预约处理失败'
    });
  }
});

// 根路径GET请求处理
app.get('/', (req, res) => {
  res.json({ message: '服务器正常运行' });
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