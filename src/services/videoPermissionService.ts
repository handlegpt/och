import { supabase } from '../lib/supabase'
import { PRICING_TIERS } from '../config/pricing'

export interface VideoPermissionResult {
  allowed: boolean
  reason?: string
  maxDuration?: number
  userTier?: string
}

/**
 * 视频生成权限服务
 */
export class VideoPermissionService {
  /**
   * 检查用户是否有视频生成权限
   * @param userId 用户ID
   * @returns 权限检查结果
   */
  static async checkVideoPermission(userId: string): Promise<VideoPermissionResult> {
    try {
      // 获取用户订阅信息
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_tier, is_admin')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return {
          allowed: false,
          reason: 'Failed to fetch user profile',
          userTier: 'unknown',
        }
      }

      const userTier = userProfile?.subscription_tier || 'free'
      const isAdmin = userProfile?.is_admin || false

      // 管理员总是有权限
      if (isAdmin) {
        return {
          allowed: true,
          maxDuration: 60, // 管理员默认60秒
          userTier: 'admin',
        }
      }

      // 查找用户订阅计划
      const tier = PRICING_TIERS.find(t => t.id === userTier)

      if (!tier) {
        return {
          allowed: false,
          reason: `Invalid subscription tier: ${userTier}`,
          userTier,
        }
      }

      // 检查是否有视频生成权限
      if (!tier.features.videoGeneration) {
        return {
          allowed: false,
          reason:
            'Video generation is not available in your current plan. Please upgrade to Pro or Max plan.',
          userTier,
        }
      }

      // 返回允许和最大时长
      return {
        allowed: true,
        maxDuration: tier.limits.videoMaxDuration,
        userTier,
      }
    } catch (error) {
      console.error('Error checking video permission:', error)
      return {
        allowed: false,
        reason: 'Permission check failed',
        userTier: 'unknown',
      }
    }
  }

  /**
   * 检查视频时长是否在用户权限范围内
   * @param userId 用户ID
   * @param requestedDuration 请求的视频时长（秒）
   * @returns 是否允许
   */
  static async checkVideoDuration(
    userId: string,
    requestedDuration: number
  ): Promise<VideoPermissionResult> {
    const permission = await this.checkVideoPermission(userId)

    if (!permission.allowed) {
      return permission
    }

    if (permission.maxDuration && requestedDuration > permission.maxDuration) {
      return {
        allowed: false,
        reason: `Requested duration (${requestedDuration}s) exceeds your plan limit (${permission.maxDuration}s)`,
        maxDuration: permission.maxDuration,
        userTier: permission.userTier,
      }
    }

    return permission
  }
}
