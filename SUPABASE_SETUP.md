# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project"
3. 创建新项目，选择组织
4. 填写项目信息：
   - 项目名称：`och-ai`
   - 数据库密码：设置强密码
   - 地区：选择离你最近的地区

## 2. 获取 API 密钥

1. 在项目仪表板中，点击左侧菜单的 "Settings"
2. 选择 "API"
3. 复制以下信息：
   - Project URL
   - anon public key

## 3. 设置数据库

1. 在项目仪表板中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase-schema.sql` 文件中的内容
4. 粘贴到编辑器中并点击 "Run"

## 4. 配置环境变量

1. 复制 `env.example` 文件为 `.env`
2. 填入你的 Supabase 配置：

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

## 5. 安装依赖

```bash
npm install
```

## 6. 测试连接

启动开发服务器：

```bash
npm run dev
```

## 7. 配置认证

1. 在 Supabase 仪表板中，点击 "Authentication"
2. 选择 "Settings"
3. 配置以下设置：
   - Site URL: `http://localhost:5173` (开发环境)
   - Redirect URLs: `http://localhost:5173/**`

## 8. 存储配置（可选）

如果需要文件上传功能：

1. 在 Supabase 仪表板中，点击 "Storage"
2. 创建新的存储桶：
   - 名称：`ai-generations`
   - 公开：是
3. 设置存储策略

## 9. 实时功能（可选）

如果需要实时更新：

1. 在 Supabase 仪表板中，点击 "Database"
2. 选择 "Replication"
3. 启用需要的表的实时功能

## 故障排除

### 常见问题

1. **CORS 错误**
   - 检查 Site URL 和 Redirect URLs 配置
   - 确保域名匹配

2. **RLS 策略错误**
   - 检查数据库中的 RLS 策略
   - 确保用户有正确的权限

3. **环境变量未加载**
   - 确保 `.env` 文件在项目根目录
   - 重启开发服务器

### 调试技巧

1. 在浏览器控制台查看 Supabase 客户端状态
2. 检查网络请求是否成功
3. 查看 Supabase 仪表板中的日志

## 生产环境部署

1. 更新 Site URL 为生产域名
2. 配置生产环境的 Redirect URLs
3. 设置环境变量
4. 测试所有功能