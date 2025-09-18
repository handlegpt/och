# SendGrid 配置指南

## 概述
本指南将帮助您配置 SendGrid 作为 Magic Link 邮件的发送服务，确保邮件显示 "Och AI" 品牌和 `hello@och.ai` 发送地址。

## 步骤 1: 注册 SendGrid 账户

1. 访问 [SendGrid 官网](https://sendgrid.com/)
2. 点击 "Start for Free" 注册账户
3. 选择免费计划（每月 100 封邮件）
4. 验证您的邮箱地址

## 步骤 2: 验证域名

### 2.1 添加域名认证
1. 登录 SendGrid 控制台
2. 进入 **Settings > Sender Authentication**
3. 选择 **Domain Authentication**
4. 点击 **Authenticate Your Domain**

### 2.2 配置域名
1. 输入您的域名：`och.ai`
2. 选择 DNS 提供商（如 Cloudflare、GoDaddy 等）
3. 点击 **Next**

### 2.3 添加 DNS 记录
SendGrid 会生成以下 DNS 记录，您需要在域名提供商处添加：

```
类型: CNAME
名称: s1._domainkey.och.ai
值: s1.domainkey.u1234567.wl123.sendgrid.net

类型: CNAME  
名称: s2._domainkey.och.ai
值: s2.domainkey.u1234567.wl123.sendgrid.net

类型: CNAME
名称: em1234.och.ai
值: u1234567.wl123.sendgrid.net
```

### 2.4 验证域名
1. 添加 DNS 记录后，返回 SendGrid
2. 点击 **Verify**
3. 等待验证完成（通常需要几分钟到几小时）

## 步骤 3: 创建 API Key

1. 进入 **Settings > API Keys**
2. 点击 **Create API Key**
3. 选择 **Restricted Access**
4. 在权限设置中：
   - **Mail Send**: Full Access
   - **Mail Settings**: Read Access
5. 点击 **Create & View**
6. **重要**: 复制并保存 API Key（只显示一次）

## 步骤 4: 在 Supabase 中配置 SMTP

### 4.1 登录 Supabase 控制台
1. 访问您的 Supabase 项目
2. 进入 **Authentication > Settings**

### 4.2 配置 SMTP 设置
在 **SMTP Settings** 部分：

```
Enable custom SMTP: ✅ 开启

SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [您的 SendGrid API Key]
Sender Email: hello@och.ai
Sender Name: Och AI
```

### 4.3 配置 URL 设置
在 **URL Configuration** 部分：

```
Site URL: https://och.ai
Redirect URLs: 
  - https://och.ai/**
  - https://och.ai/auth/callback
```

## 步骤 5: 自定义邮件模板

### 5.1 修改 Confirm Signup 模板
进入 **Authentication > Email Templates > Confirm signup**：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>欢迎使用 Och AI</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">Och AI</h1>
        <p style="color: #6b7280; font-size: 16px;">AI 驱动的创意平台</p>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-bottom: 15px;">欢迎使用 Och AI！</h2>
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            感谢您注册 Och AI！请点击下方按钮确认您的账户，开始您的 AI 创意之旅。
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="background: linear-gradient(135deg, #2563eb, #7c3aed); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
                确认账户
            </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
            如果按钮无法点击，请复制以下链接到浏览器：<br>
            <a href="{{ .ConfirmationURL }}" style="color: #2563eb; word-break: break-all;">{{ .ConfirmationURL }}</a>
        </p>
    </div>
    
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
        <p>此邮件由 Och AI 发送，请勿回复。</p>
        <p>如果您没有注册 Och AI，请忽略此邮件。</p>
    </div>
</body>
</html>
```

### 5.2 修改 Magic Link 模板
进入 **Authentication > Email Templates > Magic Link**：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Och AI 登录链接</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">Och AI</h1>
        <p style="color: #6b7280; font-size: 16px;">AI 驱动的创意平台</p>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-bottom: 15px;">您的登录链接</h2>
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            您请求了 Och AI 的登录链接。点击下方按钮即可安全登录您的账户。
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="background: linear-gradient(135deg, #2563eb, #7c3aed); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
                立即登录
            </a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
                ⚠️ <strong>安全提醒</strong>：此链接将在 1 小时后过期。如果您没有请求此登录链接，请忽略此邮件。
            </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
            如果按钮无法点击，请复制以下链接到浏览器：<br>
            <a href="{{ .ConfirmationURL }}" style="color: #2563eb; word-break: break-all;">{{ .ConfirmationURL }}</a>
        </p>
    </div>
    
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
        <p>此邮件由 Och AI 发送，请勿回复。</p>
        <p>如果您没有请求登录链接，请忽略此邮件。</p>
    </div>
</body>
</html>
```

## 步骤 6: 测试配置

### 6.1 本地测试
1. 确保本地开发服务器运行
2. 访问登录页面
3. 点击 Magic Link 登录
4. 输入测试邮箱地址
5. 检查收到的邮件

### 6.2 服务器测试
1. 在服务器上更新代码：
   ```bash
   git pull origin main
   npm run build
   ```
2. 访问生产网站
3. 测试 Magic Link 功能

## 步骤 7: 监控和优化

### 7.1 SendGrid 监控
1. 在 SendGrid 控制台查看发送统计
2. 监控邮件送达率
3. 检查垃圾邮件投诉

### 7.2 常见问题排查

#### 邮件发送失败
- 检查 API Key 是否正确
- 确认域名验证状态
- 查看 SendGrid 活动日志

#### 邮件进入垃圾箱
- 确保域名已正确验证
- 检查邮件内容是否包含垃圾邮件关键词
- 考虑设置 SPF、DKIM 记录

#### 重定向失败
- 确认 Supabase 中的 Redirect URLs 配置
- 检查域名是否正确

## 成本说明

### SendGrid 免费计划
- 每月 100 封邮件
- 适合初期测试和小规模使用

### 付费计划
- Essentials: $19.95/月，50,000 封邮件
- Pro: $89.95/月，100,000 封邮件
- 根据实际使用量选择合适计划

## 安全建议

1. **保护 API Key**：不要将 API Key 提交到代码仓库
2. **限制权限**：只给 API Key 必要的权限
3. **监控使用**：定期检查 SendGrid 使用情况
4. **备份方案**：保留 Supabase 默认邮件作为备用

## 完成后的效果

配置完成后，用户将收到：
- **发送者**：`Och AI <hello@och.ai>`
- **邮件主题**：包含 "Och AI" 品牌
- **邮件内容**：专业的 HTML 模板，显示正确的品牌信息
- **登录链接**：安全的重定向到您的网站

## 下一步

1. 按照本指南完成 SendGrid 配置
2. 测试 Magic Link 功能
3. 监控邮件发送情况
4. 根据需要进行优化调整
