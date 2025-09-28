/**
 * Sentry错误监控配置
 * 生产级错误追踪和性能监控
 */

import * as Sentry from '@sentry/react'
import { getSentryDSN, checkEnvironmentVariables } from '../utils/envCheck'

// Sentry配置 - 使用工具函数获取DSN
const SENTRY_DSN = getSentryDSN()

// 初始化Sentry
export const initSentry = () => {
  // 检查所有环境变量
  checkEnvironmentVariables()

  if (!SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN not configured. Error monitoring disabled.')
    console.warn(
      '💡 Make sure VITE_SENTRY_DSN is set in your .env file and restart the dev server.'
    )
    return
  }

  console.log('✅ Initializing Sentry with DSN:', SENTRY_DSN.substring(0, 20) + '...')

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || (import.meta as any).env?.MODE || 'development',

    // 性能监控
    integrations: [Sentry.browserTracingIntegration()],

    // 错误采样率 (生产环境100%，开发环境10%)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.1,

    // 性能监控采样率
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.0,
    replaysOnErrorSampleRate: 1.0,

    // 过滤敏感信息
    beforeSend(event) {
      // 过滤掉开发环境的错误
      if (process.env.NODE_ENV === 'development') {
        return null
      }

      // 过滤掉一些常见的非关键错误
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (
          error?.type === 'ChunkLoadError' ||
          error?.type === 'Loading chunk failed' ||
          error?.value?.includes('Loading chunk')
        ) {
          return null
        }
      }

      return event
    },

    // 用户上下文
    beforeBreadcrumb(breadcrumb) {
      // 过滤掉一些噪音breadcrumb
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null
      }
      return breadcrumb
    },

    // 自定义标签
    initialScope: {
      tags: {
        component: 'och-ai',
        version: process.env.VITE_APP_VERSION || '1.0.0',
      },
    },
  })

  console.log('✅ Sentry initialized successfully')
}

// 设置用户上下文
export const setSentryUser = (user: any) => {
  Sentry.setUser({
    id: user?.id,
    email: user?.email,
    username: user?.user_metadata?.username || user?.email?.split('@')[0],
  })
}

// 清除用户上下文
export const clearSentryUser = () => {
  Sentry.setUser(null)
}

// 记录自定义错误
export const captureError = (error: Error, context?: any) => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setContext('custom', context)
    }
    Sentry.captureException(error)
  })
}

// 记录自定义消息
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: any
) => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setContext('custom', context)
    }
    Sentry.captureMessage(message, level)
  })
}

// 记录性能指标
export const capturePerformance = (name: string, value: number, unit: string = 'ms') => {
  Sentry.addBreadcrumb({
    message: `Performance: ${name}`,
    category: 'performance',
    data: {
      value,
      unit,
    },
    level: 'info',
  })
}

// 记录业务指标
export const captureBusinessMetric = (
  metric: string,
  value: number,
  tags?: Record<string, string>
) => {
  Sentry.addBreadcrumb({
    message: `Business Metric: ${metric}`,
    category: 'business',
    data: {
      value,
      tags,
    },
    level: 'info',
  })
}

// 记录API调用
export const captureAPICall = (
  endpoint: string,
  method: string,
  status: number,
  duration: number
) => {
  Sentry.addBreadcrumb({
    message: `API Call: ${method} ${endpoint}`,
    category: 'http',
    data: {
      endpoint,
      method,
      status,
      duration,
    },
    level: status >= 400 ? 'error' : 'info',
  })
}

// 记录成本控制事件
export const captureCostEvent = (
  userId: string,
  operation: string,
  cost: number,
  limit: number
) => {
  Sentry.addBreadcrumb({
    message: `Cost Control: ${operation}`,
    category: 'cost',
    data: {
      userId,
      operation,
      cost,
      limit,
      usagePercent: (cost / limit) * 100,
    },
    level: 'info',
  })
}

// 记录用户行为
export const captureUserAction = (action: string, details?: any) => {
  Sentry.addBreadcrumb({
    message: `User Action: ${action}`,
    category: 'user',
    data: details,
    level: 'info',
  })
}

// 记录安全事件
export const captureSecurityEvent = (
  event: string,
  severity: 'low' | 'medium' | 'high',
  details?: any
) => {
  Sentry.withScope(scope => {
    scope.setTag('security', 'true')
    scope.setLevel(severity === 'high' ? 'error' : 'warning')
    scope.setContext('security', {
      event,
      severity,
      details,
    })
    Sentry.captureMessage(`Security Event: ${event}`, severity === 'high' ? 'error' : 'warning')
  })
}

// 记录数据库性能
export const captureDatabasePerformance = (query: string, duration: number, rows?: number) => {
  Sentry.addBreadcrumb({
    message: `Database Query: ${query.substring(0, 100)}...`,
    category: 'database',
    data: {
      query: query.substring(0, 200), // 限制长度
      duration,
      rows,
    },
    level: duration > 1000 ? 'warning' : 'info',
  })
}

// 导出Sentry实例
export { Sentry }
export default Sentry
