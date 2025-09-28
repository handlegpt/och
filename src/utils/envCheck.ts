/**
 * 环境变量检查工具
 * 用于调试环境变量加载问题
 */

export const checkEnvironmentVariables = () => {
  const envVars = {
    // Vite环境变量
    'import.meta.env.VITE_SENTRY_DSN': import.meta.env.VITE_SENTRY_DSN,
    'import.meta.env.VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'import.meta.env.VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'import.meta.env.MODE': import.meta.env.MODE,
    'import.meta.env.DEV': import.meta.env.DEV,
    'import.meta.env.PROD': import.meta.env.PROD,

    // Node.js环境变量
    'process.env.VITE_SENTRY_DSN': process.env.VITE_SENTRY_DSN,
    'process.env.REACT_APP_SENTRY_DSN': process.env.REACT_APP_SENTRY_DSN,
    'process.env.NODE_ENV': process.env.NODE_ENV,

    // 其他信息
    'location.hostname': typeof window !== 'undefined' ? window.location.hostname : 'server',
    userAgent:
      typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) : 'server',
  }

  console.log('🔍 Environment Variables Check:', envVars)

  return envVars
}

export const getSentryDSN = (): string | undefined => {
  const sources = [
    import.meta.env.VITE_SENTRY_DSN,
    process.env.VITE_SENTRY_DSN,
    process.env.REACT_APP_SENTRY_DSN,
    import.meta.env.REACT_APP_SENTRY_DSN,
  ]

  const dsn = sources.find(source => source && source.length > 0)

  console.log('🔍 Sentry DSN sources:', {
    sources: sources.map((s, i) => ({
      index: i,
      value: s ? s.substring(0, 20) + '...' : 'undefined',
    })),
    selected: dsn ? dsn.substring(0, 20) + '...' : 'none',
  })

  return dsn
}
