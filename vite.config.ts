import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量，包括 .env 文件
  const env = loadEnv(mode, process.cwd(), '')

  // 从环境变量获取 Sentry DSN
  const sentryDsn = env.VITE_SENTRY_DSN || process.env.VITE_SENTRY_DSN

  console.log('🔧 Vite config - Environment variables:', {
    mode,
    VITE_SENTRY_DSN: sentryDsn,
    NODE_ENV: process.env.NODE_ENV,
    'env.VITE_SENTRY_DSN': env.VITE_SENTRY_DSN,
    'process.env.VITE_SENTRY_DSN': process.env.VITE_SENTRY_DSN,
  })

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_SENTRY_DSN': JSON.stringify(sentryDsn),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(sentryDsn),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
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
