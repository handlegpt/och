// 配置模板文件
// 复制此文件为 config.local.js 并根据需要修改

export const localConfig = {
  // API 配置
  api: {
    geminiApiKey: process.env.GEMINI_API_KEY || 'your_gemini_api_key_here',
    timeout: 30000,
    retryAttempts: 3
  },

  // 服务器配置
  server: {
    port: process.env.PORT || 5173,
    host: process.env.HOST || '0.0.0.0',
    cors: {
      origin: ['http://localhost:5173', 'https://yourdomain.com'],
      credentials: true
    }
  },

  // 应用配置
  app: {
    title: 'Och AI',
    description: 'AI 图像和视频生成工具',
    version: '1.0.0',
    defaultLanguage: 'zh'
  },

  // 功能开关
  features: {
    videoGeneration: true,
    multiImage: true,
    customPrompt: true,
    history: true,
    download: true
  },

  // 限制配置
  limits: {
    maxImageSize: '10MB',
    maxVideoDuration: '30s',
    dailyLimitPerUser: 100,
    maxConcurrentRequests: 10
  },

  // 自定义样式
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    customCSS: `
      /* 自定义样式 */
      .custom-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    `
  },

  // 自定义变换效果
  customTransformations: [
    {
      key: "customStyle1",
      titleKey: "transformations.effects.customStyle1.title",
      prompt: "Apply a custom artistic style to this image",
      emoji: "🎨",
      descriptionKey: "transformations.effects.customStyle1.description"
    }
  ]
};

export default localConfig;
