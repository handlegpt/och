/**
 * 安全中间件
 * 提供应用级别的安全防护
 */

import { supabase } from '../lib/supabase'

// 速率限制配置
const RATE_LIMITS = {
  '/api/generate': { maxRequests: 10, windowMs: 60000 }, // 每分钟10次
  '/api/upload': { maxRequests: 5, windowMs: 60000 }, // 每分钟5次
  '/api/auth': { maxRequests: 3, windowMs: 300000 }, // 每5分钟3次
}

// 速率限制存储
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 速率限制检查
export function checkRateLimit(
  endpoint: string,
  identifier: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = RATE_LIMITS[endpoint]
  if (!limit) {
    return { allowed: true, remaining: Infinity, resetTime: 0 }
  }

  const key = `${endpoint}:${identifier}`
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    // 重置或创建新的限制记录
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs,
    })
    return {
      allowed: true,
      remaining: limit.maxRequests - 1,
      resetTime: now + limit.windowMs,
    }
  }

  if (current.count >= limit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    }
  }

  // 增加计数
  current.count++
  rateLimitStore.set(key, current)

  return {
    allowed: true,
    remaining: limit.maxRequests - current.count,
    resetTime: current.resetTime,
  }
}

// 输入清理
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // 移除HTML标签
    .replace(/javascript:/gi, '') // 移除JavaScript协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .trim()
    .substring(0, 1000) // 限制长度
}

// 文件类型验证
export function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  return allowedTypes.includes(file.type)
}

// 文件大小验证
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// 用户权限检查
export async function checkUserPermission(userId: string, action: string): Promise<boolean> {
  if (!supabase) return false

  try {
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (!userProfile) return false

    // 根据订阅等级检查权限
    switch (action) {
      case 'generate_image':
        return ['free', 'pro', 'enterprise', 'admin'].includes(userProfile.subscription_tier)
      case 'admin_access':
        return userProfile.subscription_tier === 'admin'
      case 'unlimited_generation':
        return ['pro', 'enterprise', 'admin'].includes(userProfile.subscription_tier)
      default:
        return false
    }
  } catch (error) {
    console.error('Permission check failed:', error)
    return false
  }
}

// 会话验证
export async function validateSession(sessionToken: string): Promise<boolean> {
  if (!supabase) return false

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(sessionToken)
    return !error && !!user
  } catch (error) {
    console.error('Session validation failed:', error)
    return false
  }
}

// 安全日志记录
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  severity: 'low' | 'medium' | 'high' = 'medium'
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    severity,
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  console.warn(`🔒 Security Event [${severity.toUpperCase()}]:`, logEntry)

  // 发送到监控服务
  if (severity === 'high') {
    // 可以发送到Sentry或其他监控服务
    console.error('🚨 High severity security event detected:', logEntry)
  }
}

// 安全头部设置
export function setSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }
}
