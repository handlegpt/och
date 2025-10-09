# Supabase 认证故障排除指南

## 🔍 认证日志检查

### 1. 检查 Supabase Dashboard 认证日志

**步骤：**
1. 登录 Supabase Dashboard
2. 进入 **Authentication** > **Logs**
3. 查看最近 24 小时的认证事件

**查找以下错误类型：**
- `redirect_to` 参数不匹配
- 无效的重定向 URL
- 会话过期错误
- CORS 错误

### 2. 常见错误和解决方案

#### 错误：`redirect_to` 参数不匹配
```
Error: redirect_to parameter does not match any of the configured redirect URLs
```

**解决方案：**
- 确保 Supabase Dashboard 中的 Redirect URLs 包含 `https://och.ai/auth/callback`
- 检查代码中的 `redirectTo` 参数是否正确

#### 错误：无效的重定向 URL
```
Error: Invalid redirect URL
```

**解决方案：**
- 验证 URL 格式正确
- 确保使用 HTTPS（生产环境）
- 检查域名拼写

#### 错误：会话过期
```
Error: Session expired
```

**解决方案：**
- 检查 Magic Link 是否在有效期内
- 重新发送 Magic Link
- 检查系统时间是否正确

### 3. 配置验证清单

#### Supabase Dashboard 配置检查：

**Authentication > URL Configuration:**
- [ ] Site URL: `https://och.ai`
- [ ] Redirect URLs 包含：
  - [ ] `https://och.ai/auth/callback`
  - [ ] `http://localhost:4173/auth/callback`
  - [ ] `http://localhost:3000/auth/callback`

**Authentication > Email Templates:**
- [ ] Magic Link 模板中的链接格式正确
- [ ] 模板使用 `{{ .SiteURL }}/auth/callback`

**Authentication > Providers:**
- [ ] Email 提供商已启用
- [ ] Google OAuth 配置正确（如果使用）

### 4. 代码配置检查

#### 检查认证代码中的重定向 URL：

```javascript
// 在 useAuth.ts 中检查
const getRedirectUrl = () => {
  const origin = window.location.origin
  if (origin.includes('och.ai')) {
    return 'https://och.ai/auth/callback'  // ✅ 正确
  }
  return `${origin}/auth/callback`
}
```

#### 检查 Magic Link 发送：

```javascript
// 确保 emailRedirectTo 参数正确
const { error } = await supabase.auth.signInWithOtp({
  email: email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### 5. 服务器配置检查

#### 验证服务器路由：

```bash
# 测试健康检查端点
curl -I https://och.ai/health

# 测试认证回调路由
curl -I https://och.ai/auth/callback

# 应该返回 200 OK
```

#### 检查服务器日志：

```bash
# 查看 Docker 容器日志
docker logs <container_id>

# 查找认证相关的日志
docker logs <container_id> | grep -i auth
```

### 6. 网络和 DNS 检查

#### 验证域名解析：

```bash
# 检查域名解析
nslookup och.ai

# 检查 HTTPS 证书
openssl s_client -connect och.ai:443 -servername och.ai
```

#### 检查 CORS 配置：

- 确保 Supabase 项目的 CORS 设置包含您的域名
- 检查浏览器控制台是否有 CORS 错误

### 7. 测试步骤

#### 完整认证流程测试：

1. **发送 Magic Link：**
   ```javascript
   // 在浏览器控制台测试
   const { data, error } = await supabase.auth.signInWithOtp({
     email: 'your-email@example.com',
     options: {
       emailRedirectTo: 'https://och.ai/auth/callback'
     }
   });
   ```

2. **检查邮件：**
   - 确认收到邮件
   - 检查邮件中的链接格式

3. **点击链接：**
   - 应该跳转到 `https://och.ai/auth/callback`
   - 不应该出现 404 错误
   - 应该自动登录并重定向到首页

### 8. 调试工具

#### 浏览器开发者工具：

1. **Network 标签页：**
   - 查看认证请求的状态码
   - 检查重定向链

2. **Console 标签页：**
   - 查看 JavaScript 错误
   - 检查 Supabase 客户端日志

3. **Application 标签页：**
   - 检查 Local Storage 中的认证状态
   - 查看 Session 信息

### 9. 紧急修复步骤

如果认证完全无法工作：

1. **临时禁用认证：**
   ```javascript
   // 在开发环境中临时跳过认证
   if (process.env.NODE_ENV === 'development') {
     // 直接设置用户状态
   }
   ```

2. **回滚到之前的版本：**
   ```bash
   git log --oneline
   git checkout <previous-commit>
   ```

3. **联系 Supabase 支持：**
   - 提供项目 ID
   - 提供错误日志截图
   - 描述具体的错误行为

## 📞 获取帮助

如果问题仍然存在，请提供以下信息：

1. Supabase Dashboard 认证日志截图
2. 浏览器控制台错误信息
3. 服务器日志
4. 具体的错误消息
5. 重现步骤
