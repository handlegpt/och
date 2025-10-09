# Supabase 认证配置检查清单

## 🔍 问题诊断

您遇到的 `GET https://och.ai/auth/callback net::ERR_HTTP_RESPONSE_CODE_FAILURE 404` 错误需要从两个方面解决：

### 1. Supabase Dashboard 配置

请在 Supabase Dashboard 中检查以下配置：

#### Authentication > URL Configuration

**Site URL:**
```
https://och.ai
```

**Redirect URLs (添加以下所有 URL):**
```
https://och.ai/auth/callback
http://localhost:4173/auth/callback
http://localhost:3000/auth/callback
```

#### Authentication > Email Templates

**Magic Link 模板检查:**
```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">确认登录</a>
```

### 2. 服务器路由配置

已创建以下文件来修复路由问题：

- ✅ `server.js` - 自定义服务器，支持 SPA 路由
- ✅ 更新了 `Dockerfile` - 使用自定义服务器

## 🚀 部署步骤

```bash
# 重新构建 Docker 镜像
docker build -t och-ai .

# 运行容器
docker run -p 4173:4173 och-ai
```

## 🧪 测试步骤

1. **检查健康端点:**
   ```bash
   curl http://localhost:4173/health
   ```

2. **测试认证回调路由:**
   ```bash
   curl -I http://localhost:4173/auth/callback
   # 应该返回 200 OK
   ```

3. **测试 SPA 路由:**
   ```bash
   curl -I http://localhost:4173/profile
   # 应该返回 200 OK (回退到 index.html)
   ```

## 🔧 故障排除

### 如果仍然出现 404 错误：

1. **检查 Supabase 配置:**
   - 确认 Site URL 设置为 `https://och.ai`
   - 确认 Redirect URLs 包含 `https://och.ai/auth/callback`

2. **检查服务器日志:**
   ```bash
   docker logs <container_id>
   ```

3. **检查网络连接:**
   ```bash
   curl -v https://och.ai/auth/callback
   ```

### 常见问题：

- **CORS 错误**: 检查 Supabase 的 CORS 设置
- **SSL 证书问题**: 确保 HTTPS 配置正确
- **DNS 解析问题**: 确认域名解析到正确的服务器

## 📋 验证清单

- [ ] Supabase Site URL 设置为 `https://och.ai`
- [ ] Supabase Redirect URLs 包含 `https://och.ai/auth/callback`
- [ ] 服务器正确配置 SPA 路由回退
- [ ] 健康检查端点正常工作
- [ ] 认证回调路由返回 200 状态码
- [ ] 浏览器控制台没有 CORS 错误
