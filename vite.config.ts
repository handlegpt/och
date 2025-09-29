import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量，包括 .env 文件
  const env = loadEnv(mode, process.cwd(), '')

  // 直接从 process.env 获取，作为备用，如果都没有则使用硬编码值
  const sentryDsn =
    env.VITE_SENTRY_DSN ||
    process.env.VITE_SENTRY_DSN ||
    'https://a739df68bf9fb7676585b122df48022d@o4510095342567424.ingest.us.sentry.io/4510095349579776'

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
