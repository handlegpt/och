# 静态文件服务修复指南

## 问题描述
服务器上的静态文件（图片、HTML文件）无法访问，返回空白页面。

## 根本原因
1. **Docker配置问题**: `read_only: true` 限制了文件系统访问
2. **serve配置问题**: 缺少正确的静态文件服务配置
3. **路由配置问题**: SPA路由配置可能影响静态文件访问

## 修复方案

### 方案1: 使用修复后的配置（推荐）

1. **重新构建和部署**:
```bash
# 在服务器上执行
cd /root/och
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
```

2. **验证修复**:
```bash
# 使用测试脚本
./test-static-files.sh
```

### 方案2: 使用简化配置（备选）

如果方案1仍有问题，使用简化配置：

```bash
# 在服务器上执行
cd /root/och
docker compose -f docker-compose.simple.yml down
docker compose -f docker-compose.simple.yml build --no-cache
docker compose -f docker-compose.simple.yml up -d
```

### 方案3: 手动验证和修复

1. **检查容器状态**:
```bash
docker ps
docker logs och-ai-och-ai-1
```

2. **进入容器检查文件**:
```bash
docker exec -it och-ai-och-ai-1 sh
ls -la /app/dist/images/
```

3. **测试serve服务**:
```bash
# 在容器内
npx serve -c serve.json -l 4173
```

## 修复内容

### 1. Dockerfile 修改
- ✅ 添加了 `serve.json` 配置文件
- ✅ 更新了serve命令使用配置文件
- ✅ 确保静态文件正确复制

### 2. docker-compose.yml 修改
- ✅ 临时禁用了 `read_only: true`
- ✅ 保持了其他安全配置

### 3. serve.json 配置
- ✅ 配置了正确的静态文件服务
- ✅ 添加了图片文件的缓存头
- ✅ 配置了SPA路由重写

### 4. 测试工具
- ✅ 创建了 `test-static-files.sh` 测试脚本
- ✅ 创建了 `debug-images.html` 调试页面
- ✅ 提供了 `docker-compose.simple.yml` 备选配置

## 验证步骤

### 1. 检查文件存在
```bash
curl -I http://your-domain:5173/images/demo-figurine.jpg
```

### 2. 检查调试页面
```bash
curl -I http://your-domain:5173/debug-images.html
```

### 3. 使用测试脚本
```bash
SERVER_HOST=your-domain ./test-static-files.sh
```

## 预期结果

修复后，以下URL应该能正常访问：
- ✅ `http://your-domain:5173/images/demo-figurine.jpg`
- ✅ `http://your-domain:5173/images/demo-anime.jpg`
- ✅ `http://your-domain:5173/images/demo-plushie.jpg`
- ✅ `http://your-domain:5173/debug-images.html`

## 故障排除

### 如果仍然无法访问：

1. **检查Docker日志**:
```bash
docker logs och-ai-och-ai-1 --tail 50
```

2. **检查文件权限**:
```bash
docker exec -it och-ai-och-ai-1 ls -la /app/dist/
```

3. **检查serve配置**:
```bash
docker exec -it och-ai-och-ai-1 cat /app/serve.json
```

4. **重启服务**:
```bash
docker compose restart
```

## 联系支持

如果问题仍然存在，请提供：
- Docker容器日志
- 测试脚本输出
- 服务器环境信息
