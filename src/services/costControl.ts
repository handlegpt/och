/**
 * 成本控制服务 - 防止API成本失控
 * 这是运营中最关键的安全机制
 */

import { supabase } from '../lib/supabase'
import { captureError } from '../lib/sentry'

// API成本配置 (基于Google Gemini定价)
export const API_COST_CONFIG = {
  // 每次API调用的预估成本 (USD)
  IMAGE_GENERATION: 0.02, // 图像生成
  IMAGE_EDIT: 0.05, // 图像编辑
  VIDEO_GENERATION: 0.1, // 视频生成
  TEXT_PROCESSING: 0.001, // 文本处理
} as const

// 用户层级成本限制
export const USER_LIMITS = {
  free: {
    dailyLimit: 0.1, // 免费用户每日$0.10
    monthlyLimit: 2.0, // 免费用户每月$2.00
    maxSingleRequest: 0.05, // 单次请求最大$0.05
  },
  standard: {
    dailyLimit: 5.0, // 标准用户每日$5.00
    monthlyLimit: 100.0, // 标准用户每月$100.00
    maxSingleRequest: 0.5,
  },
  professional: {
    dailyLimit: 20.0, // 专业用户每日$20.00
    monthlyLimit: 500.0, // 专业用户每月$500.00
    maxSingleRequest: 2.0,
  },
  enterprise: {
    dailyLimit: 100.0, // 企业用户每日$100.00
    monthlyLimit: 2000.0, // 企业用户每月$2000.00
    maxSingleRequest: 10.0,
  },
} as const

// 成本记录接口
export interface CostRecord {
  id: string
  user_id: string
  operation_type: 'IMAGE_GENERATION' | 'IMAGE_EDIT' | 'VIDEO_GENERATION' | 'TEXT_PROCESSING'
  estimated_cost: number
  actual_cost?: number
  tokens_used?: number
  created_at: string
}

// 用户成本统计接口
export interface UserCostStats {
  userId: string
  dailyCost: number
  monthlyCost: number
  dailyLimit: number
  monthlyLimit: number
  canMakeRequest: boolean
  remainingDaily: number
  remainingMonthly: number
}

// 成本控制服务类
export class CostControlService {
  /**
   * 检查用户是否可以执行API请求
   * @param userId 用户ID
   * @param operationType 操作类型
   * @param estimatedCost 预估成本
   * @returns 是否允许执行
   */
  static async checkUserBudget(
    userId: string,
    operationType: keyof typeof API_COST_CONFIG,
    estimatedCost: number
  ): Promise<{ allowed: boolean; reason?: string; stats?: UserCostStats }> {
    try {
      // 获取用户订阅层级
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return { allowed: false, reason: 'Failed to fetch user profile' }
      }

      const userTier = userProfile?.subscription_tier || 'free'
      const limits = USER_LIMITS[userTier as keyof typeof USER_LIMITS]

      // 检查限制是否存在
      if (!limits) {
        console.error(`No limits found for user tier: ${userTier}`)
        return { allowed: false, reason: `Invalid user tier: ${userTier}` }
      }

      // 检查单次请求限制
      if (estimatedCost > limits.maxSingleRequest) {
        return {
          allowed: false,
          reason: `Single request cost ($${estimatedCost.toFixed(4)}) exceeds limit ($${limits.maxSingleRequest})`,
        }
      }

      // 获取用户今日和本月成本
      const stats = await this.getUserCostStats(userId, userTier)

      if (!stats) {
        return { allowed: false, reason: 'Failed to calculate cost stats' }
      }

      // 检查是否超出限制
      if (stats.dailyCost + estimatedCost > stats.dailyLimit) {
        return {
          allowed: false,
          reason: `Daily cost limit exceeded. Current: $${stats.dailyCost.toFixed(4)}, Limit: $${stats.dailyLimit}`,
          stats,
        }
      }

      if (stats.monthlyCost + estimatedCost > stats.monthlyLimit) {
        return {
          allowed: false,
          reason: `Monthly cost limit exceeded. Current: $${stats.monthlyCost.toFixed(4)}, Limit: $${stats.monthlyLimit}`,
          stats,
        }
      }

      return { allowed: true, stats }
    } catch (error) {
      console.error('Error in cost control check:', error)
      return { allowed: false, reason: 'Cost control system error' }
    }
  }

  /**
   * 记录API调用成本
   * @param userId 用户ID
   * @param operationType 操作类型
   * @param estimatedCost 预估成本
   * @param actualCost 实际成本
   * @param tokensUsed 使用的token数量
   */
  static async recordAPICost(
    userId: string,
    operationType: string,
    estimatedCost: number,
    actualCost?: number,
    tokensUsed?: number
  ): Promise<void> {
    try {
      const { error } = await supabase.from('api_cost_records').insert({
        user_id: userId,
        operation_type: operationType,
        estimated_cost: estimatedCost,
        actual_cost: actualCost || estimatedCost,
        tokens_used: tokensUsed,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Error recording API cost:', error)
        captureError(error, {
          context: 'cost_control',
          userId,
          operationType,
          estimatedCost,
        })
        // 不抛出错误，避免影响用户体验
      }

      // 更新用户成本统计
      await this.updateUserCostStats(userId)
    } catch (error) {
      console.error('Error recording API cost:', error)
      captureError(error as Error, {
        context: 'cost_control_record',
        userId,
        operationType,
        estimatedCost,
      })
    }
  }

  /**
   * 获取用户成本统计
   * @param userId 用户ID
   * @param userTier 用户层级
   * @returns 成本统计信息
   */
  static async getUserCostStats(userId: string, userTier: string): Promise<UserCostStats | null> {
    try {
      const limits = USER_LIMITS[userTier as keyof typeof USER_LIMITS]

      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // 获取今日成本
      const { data: dailyCosts, error: dailyError } = await supabase
        .from('api_cost_records')
        .select('actual_cost')
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())

      // 获取本月成本
      const { data: monthlyCosts, error: monthlyError } = await supabase
        .from('api_cost_records')
        .select('actual_cost')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (dailyError || monthlyError) {
        console.error('Error fetching cost stats:', dailyError || monthlyError)
        return null
      }

      const dailyCost = dailyCosts?.reduce((sum, record) => sum + (record.actual_cost || 0), 0) || 0
      const monthlyCost =
        monthlyCosts?.reduce((sum, record) => sum + (record.actual_cost || 0), 0) || 0

      return {
        userId,
        dailyCost,
        monthlyCost,
        dailyLimit: limits.dailyLimit,
        monthlyLimit: limits.monthlyLimit,
        canMakeRequest: dailyCost < limits.dailyLimit && monthlyCost < limits.monthlyLimit,
        remainingDaily: Math.max(0, limits.dailyLimit - dailyCost),
        remainingMonthly: Math.max(0, limits.monthlyLimit - monthlyCost),
      }
    } catch (error) {
      console.error('Error getting user cost stats:', error)
      return null
    }
  }

  /**
   * 更新用户成本统计
   * @param userId 用户ID
   */
  static async updateUserCostStats(userId: string): Promise<void> {
    try {
      // 这里可以添加实时统计更新逻辑
      // 或者触发缓存刷新
      console.log(`Updated cost stats for user: ${userId}`)
    } catch (error) {
      console.error('Error updating user cost stats:', error)
    }
  }

  /**
   * 获取系统总成本统计
   * @returns 系统成本统计
   */
  static async getSystemCostStats(): Promise<{
    totalDailyCost: number
    totalMonthlyCost: number
    userCount: number
    averageCostPerUser: number
  } | null> {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // 获取今日总成本
      const { data: dailyCosts, error: dailyError } = await supabase
        .from('api_cost_records')
        .select('actual_cost')
        .gte('created_at', startOfDay.toISOString())

      // 获取本月总成本
      const { data: monthlyCosts, error: monthlyError } = await supabase
        .from('api_cost_records')
        .select('actual_cost')
        .gte('created_at', startOfMonth.toISOString())

      // 获取活跃用户数
      const { data: activeUsers, error: userError } = await supabase
        .from('api_cost_records')
        .select('user_id')
        .gte('created_at', startOfMonth.toISOString())
        .not('user_id', 'is', null)

      if (dailyError || monthlyError || userError) {
        console.error('Error fetching system cost stats:', dailyError || monthlyError || userError)
        return null
      }

      const totalDailyCost =
        dailyCosts?.reduce((sum, record) => sum + (record.actual_cost || 0), 0) || 0
      const totalMonthlyCost =
        monthlyCosts?.reduce((sum, record) => sum + (record.actual_cost || 0), 0) || 0
      const uniqueUsers = new Set(activeUsers?.map(record => record.user_id) || [])
      const userCount = uniqueUsers.size
      const averageCostPerUser = userCount > 0 ? totalMonthlyCost / userCount : 0

      return {
        totalDailyCost,
        totalMonthlyCost,
        userCount,
        averageCostPerUser,
      }
    } catch (error) {
      console.error('Error getting system cost stats:', error)
      return null
    }
  }

  /**
   * 发送成本预警
   * @param userId 用户ID
   * @param stats 用户成本统计
   */
  static async sendCostAlert(userId: string, stats: UserCostStats): Promise<void> {
    try {
      // 检查是否需要发送预警
      const dailyUsagePercent = (stats.dailyCost / stats.dailyLimit) * 100
      const monthlyUsagePercent = (stats.monthlyCost / stats.monthlyLimit) * 100

      // 80% 使用率时发送预警
      if (dailyUsagePercent >= 80 || monthlyUsagePercent >= 80) {
        console.warn(`🚨 Cost Alert for user ${userId}:`, {
          dailyUsage: `${dailyUsagePercent.toFixed(1)}%`,
          monthlyUsage: `${monthlyUsagePercent.toFixed(1)}%`,
          remainingDaily: stats.remainingDaily,
          remainingMonthly: stats.remainingMonthly,
        })

        // 这里可以集成邮件、短信或其他通知服务
        // await this.sendNotification(userId, 'cost_alert', stats)
      }
    } catch (error) {
      console.error('Error sending cost alert:', error)
    }
  }
}

// 成本控制中间件 - 用于API调用前检查
export const withCostControl = async (
  userId: string,
  operationType: keyof typeof API_COST_CONFIG,
  operation: () => Promise<any>
): Promise<{ success: boolean; result?: any; error?: string; cost?: number }> => {
  try {
    // 获取预估成本
    const estimatedCost = API_COST_CONFIG[operationType]

    if (typeof estimatedCost !== 'number') {
      return {
        success: false,
        error: `Invalid operation type: ${operationType}`,
      }
    }

    // 检查用户预算
    const budgetCheck = await CostControlService.checkUserBudget(
      userId,
      operationType,
      estimatedCost
    )

    if (!budgetCheck.allowed) {
      return {
        success: false,
        error: budgetCheck.reason || 'Cost limit exceeded',
      }
    }

    // 执行操作
    const result = await operation()

    // 记录成本
    await CostControlService.recordAPICost(userId, operationType as string, estimatedCost)

    // 发送预警（如果需要）
    if (budgetCheck.stats) {
      await CostControlService.sendCostAlert(userId, budgetCheck.stats)
    }

    return {
      success: true,
      result,
      cost: estimatedCost,
    }
  } catch (error) {
    console.error('Error in cost control middleware:', error)
    return {
      success: false,
      error: 'Cost control system error',
    }
  }
}
