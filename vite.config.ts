import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 第三方库
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['zustand'],
            // 页面组件
            pages: ['./src/pages/ProfilePage', './src/pages/SocialPage', './src/pages/PricingPage'],
            // 功能组件
            features: [
              './src/components/social/GalleryWall',
              './src/components/social/UserCollections',
              './src/components/user/UnifiedDashboard',
            ],
            // 生成工作流
            generation: ['./src/components/GenerationWorkflow'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    css: {
      postcss: './postcss.config.js',
    },
  }
})
