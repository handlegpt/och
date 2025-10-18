# 502 Bad Gateway 错误诊断和修复指南

## 🚨 问题分析

502 Bad Gateway 错误表示：
- 服务器进程可能崩溃
- 端口配置问题
- 新部署的代码有错误
- 网络或代理配置问题

## 🔍 诊断步骤

### 1. 检查服务器状态

```bash
# 检查 Docker 容器状态
docker ps -a

# 检查容器日志
docker logs <container_id>

# 检查端口占用
netstat -tulpn | grep :4173
# 或者
lsof -i :4173
```

### 2. 检查服务器健康状态

```bash
# 测试本地连接
curl -I http://localhost:4173/health

# 测试外部连接
curl -I https://och.ai/health
```

### 3. 检查服务器配置

```bash
# 检查环境变量
docker exec <container_id> env | grep VITE

# 检查文件权限
docker exec <container_id> ls -la /app/dist
```

## 🛠️ 修复步骤

### 方案 1: 重启服务器

```bash
# 停止当前容器
docker stop <container_id>

# 重新构建镜像
docker build -t och-ai .

# 启动新容器
docker run -d -p 4173:4173 --name och-ai-container och-ai

# 检查状态
docker ps
docker logs och-ai-container
```

### 方案 2: 检查代码问题

如果重启后仍然有问题，可能是代码问题：

```bash
# 检查构建是否成功
npm run build

# 检查 dist 目录
ls -la dist/

# 测试本地服务器
npx http-server dist -p 4173
```

### 方案 3: 回滚到之前版本

```bash
# 查看提交历史
git log --oneline -5

# 回滚到上一个工作版本
git checkout <previous-commit>

# 重新构建和部署
docker build -t och-ai .
docker run -d -p 4173:4173 --name och-ai-container och-ai
```

## 🔧 常见问题和解决方案

### 问题 1: 端口冲突

```bash
# 检查端口占用
sudo netstat -tulpn | grep :4173

# 如果端口被占用，杀死进程
sudo kill -9 <pid>

# 或者使用不同端口
docker run -d -p 4174:4173 --name och-ai-container och-ai
```

### 问题 2: 内存不足

```bash
# 检查系统资源
free -h
df -h

# 清理 Docker 资源
docker system prune -a
```

### 问题 3: 环境变量问题

```bash
# 检查环境变量文件
cat .env

# 确保所有必需的环境变量都已设置
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### 问题 4: 文件权限问题

```bash
# 检查文件权限
ls -la dist/

# 修复权限
chmod -R 755 dist/
```

## 🚀 快速修复脚本

创建以下脚本来自动化修复过程：

```bash
#!/bin/bash
# quick-fix.sh

echo "🔧 开始修复 502 错误..."

# 停止所有相关容器
echo "停止现有容器..."
docker stop $(docker ps -q --filter ancestor=och-ai) 2>/dev/null || true
docker rm $(docker ps -aq --filter ancestor=och-ai) 2>/dev/null || true

# 清理端口
echo "清理端口..."
sudo pkill -f "node.*server.js" 2>/dev/null || true

# 重新构建
echo "重新构建镜像..."
docker build -t och-ai .

# 启动新容器
echo "启动新容器..."
docker run -d -p 4173:4173 --name och-ai-container och-ai

# 等待启动
echo "等待服务器启动..."
sleep 10

# 检查状态
echo "检查服务器状态..."
if curl -f http://localhost:4173/health > /dev/null 2>&1; then
    echo "✅ 服务器启动成功！"
    echo "🌐 访问: http://localhost:4173"
else
    echo "❌ 服务器启动失败，检查日志："
    docker logs och-ai-container
fi
```

## 📋 预防措施

### 1. 添加健康检查

确保 Dockerfile 中有健康检查：

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4173/health || exit 1
```

### 2. 添加错误处理

在 server.js 中添加更好的错误处理：

```javascript
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  process.exit(1);
});
```

### 3. 监控和日志

```bash
# 设置日志轮转
docker run -d -p 4173:4173 \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  --name och-ai-container och-ai
```

## 🆘 紧急恢复

如果所有方法都失败：

1. **使用备份镜像**：
   ```bash
   docker run -d -p 4173:4173 --name och-ai-backup <backup-image>
   ```

2. **使用静态文件服务器**：
   ```bash
   npx serve dist -p 4173
   ```

3. **联系服务器提供商**：
   - 检查服务器状态
   - 检查网络连接
   - 检查防火墙设置
