import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  console.log('🔧 Vite config - Environment variables:', {
    mode,
    VITE_SENTRY_DSN: env.VITE_SENTRY_DSN,
    NODE_ENV: process.env.NODE_ENV,
  })

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_SENTRY_DSN': JSON.stringify(env.VITE_SENTRY_DSN),
      'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(env.VITE_SENTRY_DSN),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // 确保环境变量在构建时可用
    envPrefix: ['VITE_', 'REACT_APP_'],
  }
})
