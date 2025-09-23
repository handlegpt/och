# Magic Link 故障排除指南

## 问题：Magic Link 点击后没有登录

### 可能的原因和解决方案

#### 1. Supabase 重定向 URL 配置问题

**检查步骤：**
1. 登录 Supabase Dashboard
2. 进入 Authentication > URL Configuration
3. 确保以下 URL 在 "Redirect URLs" 列表中：
   - `http://localhost:4173/auth/callback` (开发环境)
   - `https://och.ai/auth/callback` (生产环境)
   - `http://localhost:3000/auth/callback` (如果使用其他端口)

**修复方法：**
```
在 Supabase Dashboard 中添加重定向 URL：
- http://localhost:4173/auth/callback
- https://och.ai/auth/callback
```

#### 2. Site URL 配置

**检查步骤：**
1. 在 Supabase Dashboard 中进入 Authentication > URL Configuration
2. 确保 "Site URL" 设置为：
   - 开发环境：`http://localhost:4173`
   - 生产环境：`https://och.ai`

#### 3. 邮件模板配置

**检查步骤：**
1. 进入 Authentication > Email Templates
2. 选择 "Magic Link" 模板
3. 确保模板中的重定向链接正确

**模板示例：**
```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">确认登录</a>
```

#### 4. 浏览器控制台检查

**检查步骤：**
1. 打开浏览器开发者工具
2. 点击 Magic Link 后查看控制台错误
3. 检查 Network 标签页中的请求

**常见错误：**
- `redirect_to` 参数不匹配
- 会话过期
- CORS 错误

#### 5. 代码检查

**已修复的问题：**
- ✅ Magic Link 重定向 URL 已更正为 `/auth/callback`
- ✅ AuthCallback 组件已改进错误处理
- ✅ 路由配置正确

### 测试步骤

1. **发送 Magic Link：**
   ```javascript
   // 在浏览器控制台中测试
   const { data, error } = await supabase.auth.signInWithOtp({
     email: 'your-email@example.com',
     options: {
       emailRedirectTo: 'http://localhost:4173/auth/callback'
     }
   });
   ```

2. **检查邮件：**
   - 确认收到邮件
   - 检查邮件中的链接格式
   - 点击链接测试

3. **验证重定向：**
   - 点击链接后应该跳转到 `/auth/callback`
   - 页面显示 "正在处理登录..."
   - 成功后跳转到首页

### 调试命令

```bash
# 检查当前环境变量
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# 检查应用是否运行在正确端口
npm run preview
```

### 联系支持

如果问题仍然存在，请提供：
1. 浏览器控制台错误信息
2. Supabase Dashboard 中的 URL 配置截图
3. 邮件中的实际链接
4. 网络请求日志

