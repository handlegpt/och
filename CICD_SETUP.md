# CI/CD 设置指南

## GitHub Secrets 配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

### 必需的环境变量
```
GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 服务器部署配置
```
SERVER_HOST=your_server_ip_or_domain
SERVER_USER=your_server_username
SERVER_SSH_KEY=your_private_ssh_key
SERVER_PORT=22
```

### 开发环境配置（可选）
```
DEV_SERVER_HOST=your_dev_server_ip
DEV_SERVER_USER=your_dev_server_username
DEV_SERVER_SSH_KEY=your_dev_private_ssh_key
DEV_SERVER_PORT=22
```

### 监控和通知配置（可选）
```
SNYK_TOKEN=your_snyk_token_here
SLACK_WEBHOOK=your_slack_webhook_url
```

## 工作流说明

### 1. CI/CD Pipeline (ci-cd.yml)
- **触发条件**: 推送到 main/develop 分支或创建 PR
- **功能**:
  - 代码质量检查 (ESLint, Prettier, TypeScript)
  - 运行测试 (单元测试 + 集成测试)
  - 构建应用
  - 安全扫描 (npm audit, Snyk)
  - Docker 镜像构建和推送
  - 自动部署到生产环境
  - 失败时自动回滚

### 2. Develop Environment (develop.yml)
- **触发条件**: 推送到 develop 分支
- **功能**:
  - 快速代码检查
  - 部署到开发环境

### 3. Release (release.yml)
- **触发条件**: 创建版本标签 (v*)
- **功能**:
  - 创建 GitHub Release
  - 构建发布版本
  - 推送 Docker 镜像
  - 部署到生产环境

## 分支策略

### 推荐的分支模型
```
main (生产环境)
├── develop (开发环境)
├── feature/feature-name (功能分支)
├── hotfix/hotfix-name (热修复)
└── release/v1.0.0 (发布分支)
```

### 工作流程
1. **功能开发**: 从 develop 创建 feature 分支
2. **代码审查**: 创建 PR 到 develop
3. **开发测试**: 合并到 develop 后自动部署到开发环境
4. **发布准备**: 从 develop 创建 release 分支
5. **生产发布**: 合并到 main 并创建版本标签

## 本地开发设置

### 1. 安装依赖
```bash
npm install
```

### 2. 设置 Git Hooks
```bash
npm run prepare
```

### 3. 运行开发服务器
```bash
npm run dev
```

### 4. 运行测试
```bash
# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 所有测试
npm run test:all

# 测试覆盖率
npm run test:unit -- --coverage
```

### 5. 代码质量检查
```bash
# 运行 ESLint
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 检查代码格式
npm run format:check

# 自动格式化代码
npm run format

# TypeScript 类型检查
npm run type-check
```

## 部署配置

### 服务器端设置

**注意：您的服务器部署路径是 `/root/och`**

### 服务器路径说明
- **生产环境路径**: `/root/och`
- **CI/CD 部署命令**: `cd /root/och && git pull origin main && docker compose build --no-cache && docker compose up -d`
- **日志查看**: `cd /root/och && docker compose logs -f`
- **状态检查**: `cd /root/och && docker compose ps`

### 部署策略说明
- **使用 `--no-cache`**: 确保每次部署都使用最新的代码和依赖，避免缓存问题
- **分步执行**: 先构建再启动，便于错误排查和回滚
- **零停机更新**: 新容器启动后，旧容器才停止

1. **安装 Docker 和 Docker Compose**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
```

2. **创建部署目录**
```bash
mkdir -p /root/och
cd /root/och
```

3. **克隆仓库**
```bash
git clone https://github.com/your-username/och.git .
```

4. **创建环境变量文件**
```bash
cp .env.example .env
# 编辑 .env 文件，填入正确的环境变量
```

5. **设置 SSH 密钥**
```bash
# 在服务器上生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "deploy@your-domain.com"

# 将公钥添加到 authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# 将私钥内容复制到 GitHub Secrets 中的 SERVER_SSH_KEY
```

## 监控和告警

### 1. 健康检查
- 应用健康检查: `http://your-domain.com/health`
- Docker 容器健康检查: `docker ps` 查看状态

### 2. 日志监控
```bash
# 在服务器上查看应用日志
cd /root/och
docker compose logs -f

# 查看特定服务日志
docker compose logs -f och-ai
```

### 3. 性能监控
- 使用 GitHub Actions 的构建时间监控
- 集成第三方监控服务 (如 Sentry, DataDog)

## 故障排除

### 常见问题

1. **构建失败**
   - 检查环境变量是否正确设置
   - 查看 GitHub Actions 日志
   - 确保所有依赖都已安装

2. **部署失败**
   - 检查服务器 SSH 连接
   - 确认服务器上的 Docker 服务正在运行
   - 查看服务器日志

3. **测试失败**
   - 检查测试环境配置
   - 确保所有 mock 设置正确
   - 查看测试覆盖率报告

### 调试命令
```bash
# 本地构建测试
npm run build
npm run test:build

# Docker 构建测试
docker build -t och-ai-test .
docker run -p 5173:4173 och-ai-test

# 服务器端调试
cd /root/och
docker compose ps
docker compose logs -f
docker compose exec och-ai sh

# 检查代码质量
npm run lint
npm run type-check
```

## 最佳实践

1. **提交信息规范**
   - 使用 Conventional Commits 格式
   - 例如: `feat: add user authentication`

2. **代码审查**
   - 所有代码必须通过 PR 审查
   - 确保测试覆盖率达标
   - 代码质量检查通过

3. **版本管理**
   - 使用语义化版本号
   - 重要更新创建 Release Notes

4. **安全考虑**
   - 定期更新依赖
   - 使用安全扫描工具
   - 保护敏感信息

5. **性能优化**
   - 监控构建时间
   - 优化 Docker 镜像大小
   - 使用缓存加速构建
