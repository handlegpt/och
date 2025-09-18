/**
 * API速率限制服务
 * 提供基于Supabase的持久化速率限制
 */

import { supabase } from '../lib/supabase'

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyPrefix: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

// 预定义的速率限制配置
export const RATE_LIMIT_CONFIGS = {
  // 全局API限制
  GLOBAL: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000, // 1小时
    keyPrefix: 'global',
  },

  // 用户级别限制
  USER: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1小时
    keyPrefix: 'user',
  },

  // AI生成限制
  GENERATION: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1小时
    keyPrefix: 'generation',
  },

  // 文件上传限制
  UPLOAD: {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000, // 1小时
    keyPrefix: 'upload',
  },

  // 登录尝试限制
  LOGIN: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15分钟
    keyPrefix: 'login',
  },

  // 注册限制
  REGISTRATION: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1小时
    keyPrefix: 'registration',
  },
} as const

export class ApiRateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  /**
   * 检查是否允许请求
   */
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const key = `${this.config.keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    try {
      // 获取当前窗口内的请求记录
      const { data: requests, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .gte('timestamp', new Date(windowStart).toISOString())
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Rate limit check error:', error)
        // 出错时允许请求，避免影响正常功能
        return {
          allowed: true,
          remaining: this.config.maxRequests - 1,
          resetTime: now + this.config.windowMs,
        }
      }

      const requestCount = requests?.length || 0
      const allowed = requestCount < this.config.maxRequests
      const remaining = Math.max(0, this.config.maxRequests - requestCount - 1)

      // 计算重置时间（最早请求的时间 + 窗口大小）
      const resetTime =
        requests && requests.length > 0
          ? new Date(requests[requests.length - 1].timestamp).getTime() + this.config.windowMs
          : now + this.config.windowMs

      return {
        allowed,
        remaining,
        resetTime,
        retryAfter: !allowed ? Math.ceil((resetTime - now) / 1000) : undefined,
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      }
    }
  }

  /**
   * 记录请求
   */
  async recordRequest(identifier: string): Promise<void> {
    const key = `${this.config.keyPrefix}:${identifier}`
    const now = new Date().toISOString()

    try {
      // 插入新的请求记录
      const { error } = await supabase.from('rate_limits').insert({
        key,
        timestamp: now,
        identifier,
      })

      if (error) {
        console.error('Rate limit record error:', error)
      }

      // 清理过期记录（异步执行，不阻塞主流程）
      this.cleanupExpiredRecords(key).catch(console.error)
    } catch (error) {
      console.error('Rate limit record failed:', error)
    }
  }

  /**
   * 清理过期记录
   */
  private async cleanupExpiredRecords(key: string): Promise<void> {
    const cutoffTime = new Date(Date.now() - this.config.windowMs).toISOString()

    try {
      await supabase.from('rate_limits').delete().eq('key', key).lt('timestamp', cutoffTime)
    } catch (error) {
      console.error('Rate limit cleanup failed:', error)
    }
  }

  /**
   * 获取剩余请求数
   */
  async getRemainingRequests(identifier: string): Promise<number> {
    const result = await this.checkLimit(identifier)
    return result.remaining
  }

  /**
   * 重置限制（管理员功能）
   */
  async resetLimit(identifier: string): Promise<void> {
    const key = `${this.config.keyPrefix}:${identifier}`

    try {
      await supabase.from('rate_limits').delete().eq('key', key)
    } catch (error) {
      console.error('Rate limit reset failed:', error)
      throw error
    }
  }
}

// 创建预配置的速率限制器实例
export const globalRateLimiter = new ApiRateLimiter(RATE_LIMIT_CONFIGS.GLOBAL)
export const userRateLimiter = new ApiRateLimiter(RATE_LIMIT_CONFIGS.USER)
export const generationRateLimiter = new ApiRateLimiter(RATE_LIMIT_CONFIGS.GENERATION)
export const uploadRateLimiter = new ApiRateLimiter(RATE_LIMIT_CONFIGS.UPLOAD)
export const loginRateLimiter = new ApiRateLimiter(RATE_LIMIT_CONFIGS.LOGIN)
export const registrationRateLimiter = new ApiRateLimiter(RATE_LIMIT_CONFIGS.REGISTRATION)

/**
 * 速率限制装饰器
 * 用于包装API调用函数
 */
export function withRateLimit(limiter: ApiRateLimiter, getIdentifier: (...args: any[]) => string) {
  return function <T extends (...args: any[]) => Promise<any>>(target: T): T {
    return (async (...args: Parameters<T>) => {
      const identifier = getIdentifier(...args)

      // 检查限制
      const limitResult = await limiter.checkLimit(identifier)

      if (!limitResult.allowed) {
        const error = new Error(
          `Rate limit exceeded. Try again in ${limitResult.retryAfter} seconds.`
        )
        ;(error as any).statusCode = 429
        ;(error as any).retryAfter = limitResult.retryAfter
        throw error
      }

      // 记录请求
      await limiter.recordRequest(identifier)

      // 执行原函数
      return await target(...args)
    }) as T
  }
}

/**
 * 获取用户标识符
 */
export function getUserIdentifier(userId?: string, ip?: string): string {
  return userId || ip || 'anonymous'
}

/**
 * 获取IP地址（在客户端环境中返回默认值）
 */
export function getClientIP(): string {
  // 在客户端环境中，我们无法获取真实IP
  // 这里返回一个基于用户代理和时间的伪随机标识符
  const userAgent = navigator.userAgent
  const timestamp = Math.floor(Date.now() / (60 * 60 * 1000)) // 每小时变化
  return btoa(`${userAgent}-${timestamp}`).substring(0, 16)
}
