# Och AI

一个基于 Google Gemini AI 的图像和视频生成工具，提供多种创意效果和变换功能。

## 功能特性

- 🎨 **50+ 艺术效果**: 从像素艺术到水彩画，从赛博朋克到梵高风格
- 🎬 **视频生成**: 支持文本到视频的生成，可选择 16:9 或 9:16 宽高比
- 🖼️ **图像编辑**: 支持蒙版编辑、多图像处理、自定义提示
- 🌍 **多语言支持**: 支持中文和英文界面
- 🎯 **专业工具**: 高清增强、姿势参考、产品渲染等专业功能
- 📱 **响应式设计**: 适配桌面和移动设备

## 系统要求

- **Node.js**: v18.0.0 或更高版本（推荐 v20.x LTS）
- **npm**: v8.0.0 或更高版本

> ⚠️ **注意**: 如果使用 Node.js v16 或更早版本，会遇到 `crypto.getRandomValues is not a function` 错误。请升级到 Node.js v18+ 版本。

## 安装和运行

### 方法 1: Docker 生产环境部署（推荐）

#### 快速启动
```bash
# Clone the repository
git clone https://github.com/handlegpt/och.git
cd och

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start with Docker Compose (production mode)
docker-compose up -d

# Access the application
open http://localhost:5173
```

#### 使用 Docker 构建
```bash
# Build the image
docker build -t och-ai .

# Run the container
docker run -d \
  --name och-ai \
  -p 5173:5173 \
  -e GEMINI_API_KEY=your_gemini_api_key_here \
  och-ai
```

#### Docker 管理命令
```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Update and restart
docker-compose down && docker-compose up -d --build
```

#### 生产环境特性
- **生产构建**: 使用 `npm run build` 构建优化版本
- **生产预览**: 使用 `npm run preview` 提供生产级服务
- **依赖优化**: 只安装生产依赖，减小镜像大小
- **非 root 用户**: 容器以 `ochai` 用户运行
- **只读文件系统**: 使用只读文件系统增强安全性
- **临时文件系统**: 使用 tmpfs 挂载临时目录
- **安全选项**: 禁用新权限获取，使用默认 seccomp 配置

### 方法 2: 本地开发

#### 1. 安装依赖
```bash
npm install
```

#### 2. 配置环境变量
创建 `.env` 文件并添加你的 Gemini API 密钥：

```bash
# 从 https://aistudio.google.com/app/apikey 获取你的 API 密钥
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3. 启动开发服务器
```bash
npm run dev
```

#### 4. 构建生产版本
```bash
npm run build
```

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **AI 服务**: Google Gemini API
- **样式**: CSS 变量 + 响应式设计
- **国际化**: 自定义 i18n 解决方案

## 主要功能

### 图像变换
- 3D 手办、Funko Pop、乐高小人仔
- 专业照片编辑（高清增强、时尚杂志风格）
- 产品设计（建筑模型、产品渲染）
- 创意工具（自定义提示、色板换色）

### 艺术效果
- 传统艺术：水彩画、油画、炭笔素描
- 数字艺术：像素艺术、故障艺术、赛博朋克
- 手工艺术：折纸、十字绣、木雕
- 特殊效果：全息图、热成像、双重曝光

### 视频生成
- 文本到视频生成
- 支持图像输入
- 可调节宽高比
- 实时生成进度显示

## 项目结构

```
och/
├── components/          # React 组件
├── i18n/              # 国际化文件
├── services/          # API 服务
├── theme/             # 主题配置
├── utils/             # 工具函数
├── App.tsx            # 主应用组件
├── constants.ts       # 变换效果配置
├── types.ts           # TypeScript 类型定义
└── vite.config.ts     # Vite 配置
```

## 开发说明

- 项目使用 TypeScript 进行类型安全开发
- 支持热重载和快速开发
- 使用 CSS 变量实现主题切换
- 组件化设计，易于维护和扩展

## 许可证

本项目基于原项目 [Nano-Bananary](https://github.com/ZHO-ZHO-ZHO/Nano-Bananary) 进行开发。