# 配置指南

## Firebase 配置

### 需要配置的参数

在 `<mcfile name="firebase.js" path="src/firebase.js"></mcfile>` 文件中，需要替换以下占位符参数：

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};
```

### 需要启用的 Firebase 服务

1. **Firebase Authentication**
   - 启用电子邮件/密码登录方式

2. **Cloud Firestore**
   - 创建数据库
   - 设置适当的安全规则
   - 创建 `users` 集合

3. **Cloud Functions**
   - 部署 `sendEmail` 云函数
   - 在 `<mcfile name="index.js" path="functions/index.js"></mcfile>` 中配置电子邮件服务提供商凭证

4. **Cloud Storage**
   - 设置适当的存储规则

## Cloudflare 部署配置

### 需要配置的文件

1. `<mcfile name="_headers" path="public/_headers"></mcfile>`：包含安全头部配置
2. `<mcfile name="_redirects" path="public/_redirects"></mcfile>`：包含单页应用路由重定向规则

### 部署参数

在 Cloudflare Pages 控制台中配置：
- 构建命令：`npm run build`
- 输出目录：`dist`

## 其他配置

### 健康提醒功能

无需额外配置，使用时需请求通知权限：

```javascript
import { healthReminderService } from './services/healthReminderService.js';
healthReminderService.requestNotificationPermission();
```

### 注意事项

- 确保不将 Firebase 配置参数提交到版本控制系统
- 生产环境中设置适当的安全规则
- 定期更新依赖包版本以获取最新功能和安全修复