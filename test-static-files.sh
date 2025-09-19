#!/bin/bash

# 测试静态文件服务的脚本
echo "🔍 测试静态文件服务..."

# 检查环境变量
if [ -z "$SERVER_HOST" ]; then
    echo "❌ 请设置 SERVER_HOST 环境变量"
    exit 1
fi

SERVER_HOST=${SERVER_HOST}
SERVER_PORT=${SERVER_PORT:-5173}

echo "📡 测试服务器: $SERVER_HOST:$SERVER_PORT"

# 测试图片文件
echo ""
echo "🖼️  测试图片文件访问:"

images=(
    "/images/demo-figurine.jpg"
    "/images/demo-anime.jpg" 
    "/images/demo-plushie.jpg"
    "/debug-images.html"
)

for image in "${images[@]}"; do
    echo -n "测试 $image ... "
    
    # 使用curl测试HTTP状态码
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_HOST:$SERVER_PORT$image")
    
    if [ "$status" = "200" ]; then
        echo "✅ 成功 (HTTP $status)"
    else
        echo "❌ 失败 (HTTP $status)"
    fi
done

echo ""
echo "🌐 测试主页访问:"
echo -n "测试 / ... "
home_status=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_HOST:$SERVER_PORT/")
if [ "$home_status" = "200" ]; then
    echo "✅ 成功 (HTTP $home_status)"
else
    echo "❌ 失败 (HTTP $home_status)"
fi

echo ""
echo "📊 测试完成!"
echo ""
echo "💡 如果图片文件返回404，请检查:"
echo "   1. Docker容器是否正确构建"
echo "   2. dist/images/ 目录是否存在"
echo "   3. serve配置是否正确"
echo "   4. 文件权限是否正确"
