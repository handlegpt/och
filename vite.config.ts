import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量，包括 .env 文件
  const env = loadEnv(mode, process.cwd(), '')

  // 从环境变量获取配置
  const sentryDsn = env.VITE_SENTRY_DSN || process.env.VITE_SENTRY_DSN
  const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const stripePublishableKey =
    env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY

  // 安全检查：确保必要的环境变量存在
  if (mode === 'production') {
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_SENTRY_DSN']
    const missingVars = requiredVars.filter(varName => !env[varName])

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars)
      process.exit(1)
    }
  }

  // 仅在开发模式下显示配置信息
  if (mode === 'development') {
    console.log('🔧 Vite config - Development mode')
    console.log('✅ Environment variables loaded successfully')
  }

  return {
    define: {
      // 只暴露客户端安全的环境变量
      'process.env.VITE_SENTRY_DSN': JSON.stringify(sentryDsn),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'process.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(stripePublishableKey),
      'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(sentryDsn),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(stripePublishableKey),
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
