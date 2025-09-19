/**
 * 安全增强工具函数
 * 提供额外的安全检查和防护措施
 */

import { supabase } from '../lib/supabase'

// CSRF Token 管理
export class CSRFProtection {
  private static token: string | null = null

  static generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    return this.token
  }

  static validateToken(token: string): boolean {
    return this.token !== null && this.token === token
  }

  static getToken(): string | null {
    return this.token
  }
}

// 输入清理和验证
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // 移除HTML标签字符
      .replace(/javascript:/gi, '') // 移除JavaScript协议
      .replace(/on\w+=/gi, '') // 移除事件处理器
      .trim()
  }

  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_') // 只保留安全字符
      .replace(/\.{2,}/g, '.') // 防止路径遍历
      .substring(0, 255) // 限制长度
  }

  static validatePrompt(prompt: string): { isValid: boolean; error?: string } {
    if (!prompt || prompt.length === 0) {
      return { isValid: false, error: '提示词不能为空' }
    }

    if (prompt.length > 1000) {
      return { isValid: false, error: '提示词过长，最多1000字符' }
    }

    // 检查危险内容
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(prompt)) {
        return { isValid: false, error: '提示词包含不安全内容' }
      }
    }

    return { isValid: true }
  }
}

// 速率限制增强
export class EnhancedRateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>()

  static async checkLimit(
    identifier: string,
    action: string,
    maxRequests: number = 10,
    windowMinutes: number = 60
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `${identifier}:${action}`
    const now = Date.now()
    const windowMs = windowMinutes * 60 * 1000

    const current = this.limits.get(key)

    if (!current || now > current.resetTime) {
      // 重置或创建新的限制记录
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      }
    }

    if (current.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      }
    }

    // 增加计数
    current.count++
    this.limits.set(key, current)

    return {
      allowed: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime,
    }
  }

  static async recordAction(identifier: string, action: string): Promise<void> {
    if (!supabase) return

    try {
      await supabase.from('rate_limits').insert({
        key: action,
        identifier: identifier,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to record rate limit action:', error)
    }
  }
}

// 安全日志记录
export class SecurityLogger {
  static async logSecurityEvent(
    event: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' = 'low'
  ): Promise<void> {
    if (!supabase) return

    try {
      // 在生产环境中，这里应该发送到安全监控系统
      console.log(`[SECURITY ${severity.toUpperCase()}] ${event}:`, details)

      // 记录到数据库（如果表存在）
      await supabase
        .from('security_events')
        .insert({
          event_type: event,
          details: details,
          severity: severity,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        })
        .catch(() => {
          // 忽略表不存在的错误
        })
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }
}

// 数据加密工具
export class DataEncryption {
  static async encryptSensitiveData(data: string): Promise<string> {
    // 在实际应用中，应该使用更强的加密算法
    // 这里只是示例，生产环境应该使用AES-256
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  static generateSecureId(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
}

// 权限检查
export class PermissionChecker {
  static async checkUserPermission(
    userId: string,
    action: string,
    _resource?: string
  ): Promise<boolean> {
    if (!supabase) return false

    try {
      // 检查用户是否存在且活跃
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('subscription_tier, id')
        .eq('id', userId)
        .single()

      if (!userProfile) return false

      // 根据订阅等级检查权限
      switch (action) {
        case 'generate_image':
          return ['free', 'pro', 'enterprise', 'admin'].includes(userProfile.subscription_tier)
        case 'admin_access':
          return userProfile.subscription_tier === 'admin'
        case 'export_data':
          return true // 所有用户都可以导出自己的数据
        case 'delete_data':
          return true // 所有用户都可以删除自己的数据
        default:
          return false
      }
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }
}

// 安全配置
export const SecurityConfig = {
  // 文件上传限制
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],

  // 速率限制
  RATE_LIMITS: {
    IMAGE_GENERATION: { maxRequests: 50, windowMinutes: 60 },
    FILE_UPLOAD: { maxRequests: 20, windowMinutes: 60 },
    API_CALLS: { maxRequests: 100, windowMinutes: 60 },
  },

  // 会话安全
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24小时

  // 输入验证
  MAX_PROMPT_LENGTH: 1000,
  MAX_USERNAME_LENGTH: 50,
  MAX_DISPLAY_NAME_LENGTH: 100,
}
