#!/bin/bash
set -e

echo "🔄 开始从上游仓库更新..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改，请先提交或暂存"
    git status
    exit 1
fi

# 备份当前配置
echo "📦 备份当前配置..."
mkdir -p backup-config
cp -f .env backup-config/.env.backup 2>/dev/null || echo "没有 .env 文件需要备份"
cp -f config.local.js backup-config/config.local.js.backup 2>/dev/null || echo "没有 config.local.js 文件需要备份"
cp -f custom-config/* backup-config/ 2>/dev/null || echo "没有自定义配置文件需要备份"

# 检查是否有上游仓库配置
if git remote | grep -q upstream; then
    echo "⬇️  从上游仓库获取更新..."
    git fetch upstream
    git merge upstream/main
else
    echo "⚠️  没有配置上游仓库"
    echo "请先添加上游仓库："
    echo "git remote add upstream https://github.com/ZHO-ZHO-ZHO/Nano-Bananary.git"
    echo ""
    echo "或者选择从其他源更新："
    echo "1) 从 origin 更新 (你的 fork)"
    echo "2) 手动指定仓库地址"
    read -p "请输入选择 (1-2): " choice
    
    case $choice in
        1)
            echo "⬇️  从 origin 获取更新..."
            git fetch origin
            git merge origin/main
            ;;
        2)
            read -p "请输入仓库地址: " custom_repo
            echo "⬇️  从自定义仓库获取更新..."
            git fetch $custom_repo
            git merge $custom_repo/main
            ;;
        *)
            echo "❌ 无效选择，退出"
            exit 1
            ;;
    esac
fi

# 恢复本地配置
echo "🔄 恢复本地配置..."
cp -f backup-config/.env.backup .env 2>/dev/null || echo "没有 .env 备份需要恢复"
cp -f backup-config/config.local.js.backup config.local.js 2>/dev/null || echo "没有 config.local.js 备份需要恢复"
cp -f backup-config/* custom-config/ 2>/dev/null || echo "没有自定义配置需要恢复"

# 检查依赖更新
if git diff HEAD~1 HEAD --name-only | grep -q "package.json\|package-lock.json"; then
    echo "📦 检测到依赖更改，重新安装..."
    npm install
fi

echo "✅ 更新完成！"
echo "📝 请检查以下文件是否需要手动调整："
echo "   - .env (环境变量)"
echo "   - config.local.js (本地配置)"
echo "   - custom-config/ (自定义配置)"
echo "   - src/features/ (功能模块)"

read -p "是否删除备份文件？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf backup-config
    echo "🗑️  备份文件已删除"
else
    echo "📦 备份文件保留在 backup-config/ 目录"
fi