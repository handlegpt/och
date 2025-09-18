# Magic Link 登录配置指南

## 问题描述
当前 Magic Link 登录邮件显示的是 Supabase 默认模板，发送地址为 `noreply@mail.app.supabase.io`，而不是期望的 "Och AI" 品牌和 `hello@och.ai` 邮箱。

## 解决方案

### 1. Supabase 控制台配置

#### A. 邮件模板自定义
1. 登录 Supabase 控制台
2. 进入 **Authentication > Email Templates**
3. 修改以下模板：

**Confirm signup 模板：**
```html
<h2>欢迎使用 Och AI！</h2>
<p>请点击下方链接确认您的账户：</p>
<p><a href="{{ .ConfirmationURL }}">确认邮箱</a></p>
<p>感谢您选择 Och AI！</p>
```

**Magic Link 模板：**
```html
<h2>Och AI 登录链接</h2>
<p>请点击下方链接登录您的账户：</p>
<p><a href="{{ .ConfirmationURL }}">立即登录</a></p>
<p>此链接将在 1 小时后过期。</p>
<p>如果您没有请求此登录链接，请忽略此邮件。</p>
```

#### B. SMTP 配置
1. 进入 **Authentication > Settings**
2. 在 **SMTP Settings** 部分配置：

```
SMTP Host: smtp.your-provider.com
SMTP Port: 587
SMTP User: hello@och.ai
SMTP Password: [您的邮箱密码]
Sender Email: hello@och.ai
Sender Name: Och AI
```

#### C. URL 配置
1. 在 **Authentication > URL Configuration** 中设置：

```
Site URL: https://och.ai
Redirect URLs: 
  - https://och.ai/**
  - https://och.ai/auth/callback
```

### 2. 邮件服务提供商选择

#### 选项 1: SendGrid
- 注册 SendGrid 账户
- 验证 `och.ai` 域名
- 创建 API Key
- 在 Supabase 中配置 SMTP

#### 选项 2: Mailgun
- 注册 Mailgun 账户
- 添加 `och.ai` 域名
- 获取 SMTP 凭据
- 在 Supabase 中配置

#### 选项 3: 自定义 SMTP
- 使用您的域名邮箱服务
- 配置 SMTP 服务器
- 在 Supabase 中设置

### 3. 环境变量配置

确保服务器上的环境变量正确设置：

```bash
# .env 文件
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 测试步骤

1. **配置完成后**：
   ```bash
   # 在服务器上重新构建
   git pull origin main
   npm run build
   ```

2. **测试 Magic Link**：
   - 访问网站
   - 点击登录按钮
   - 选择 Magic Link 选项
   - 输入邮箱地址
   - 检查收到的邮件是否显示正确的品牌信息

### 5. 常见问题

#### Q: 邮件仍然显示 Supabase 品牌？
A: 检查邮件模板是否已保存，SMTP 配置是否正确。

#### Q: 邮件发送失败？
A: 检查 SMTP 凭据，确保邮箱服务提供商允许通过 Supabase 发送邮件。

#### Q: 重定向失败？
A: 确保 Redirect URLs 包含正确的域名和路径。

## 注意事项

1. **域名验证**：大多数邮件服务提供商需要验证您的域名
2. **发送限制**：注意邮件发送频率限制
3. **垃圾邮件**：确保邮件内容符合反垃圾邮件规范
4. **备份方案**：建议保留 Supabase 默认邮件作为备用

## 完成后的效果

配置完成后，用户将收到：
- 发送者：`Och AI <hello@och.ai>`
- 邮件主题：包含 "Och AI" 品牌
- 邮件内容：自定义的模板，显示正确的品牌信息
