#!/bin/bash

echo "🚀 快速修复静态文件问题..."

# 检查是否在服务器上
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📋 当前状态检查:"
echo "1. 检查Docker容器状态..."
docker ps | grep och-ai

echo ""
echo "2. 检查容器日志..."
docker logs och-ai-och-ai-1 --tail 10

echo ""
echo "3. 检查容器内文件..."
docker exec och-ai-och-ai-1 ls -la /app/dist/images/ 2>/dev/null || echo "❌ 无法访问容器或文件不存在"

echo ""
echo "🔧 开始修复..."

echo "4. 停止服务..."
docker compose down

echo "5. 清理旧镜像..."
docker system prune -f

echo "6. 重新构建..."
docker compose build --no-cache

echo "7. 启动服务..."
docker compose up -d

echo "8. 等待服务启动..."
sleep 10

echo "9. 检查服务状态..."
docker ps | grep och-ai

echo ""
echo "10. 测试静态文件访问..."
sleep 5

# 获取容器IP或使用localhost
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' och-ai-och-ai-1 2>/dev/null || echo "localhost")

echo "测试图片访问:"
curl -I http://localhost:5173/images/demo-figurine.jpg 2>/dev/null | head -1 || echo "❌ 无法访问图片"

echo ""
echo "✅ 修复完成！"
echo "🌐 请访问: http://your-domain:5173/debug-images.html 进行测试"
