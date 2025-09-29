import { supabase } from '../lib/supabase'
import { getStripe, STRIPE_PRICES, SubscriptionStatus, PaymentError } from '../lib/stripe'

// 支付请求接口
export interface PaymentRequest {
  planId: string
  billingCycle: 'monthly' | 'yearly'
  userId: string
  userEmail: string
  successUrl?: string
  cancelUrl?: string
}

// 支付响应接口
export interface PaymentResponse {
  success: boolean
  sessionId?: string
  error?: string
  errorCode?: PaymentError
}

// 订阅信息接口
export interface SubscriptionInfo {
  id: string
  status: SubscriptionStatus
  planId: string
  billingCycle: 'monthly' | 'yearly'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
}

// 支付服务类
export class PaymentService {
  /**
   * 创建支付会话
   */
  static async createCheckoutSession(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const stripe = await getStripe()
      if (!stripe) {
        return {
          success: false,
          error: 'Stripe 未初始化',
          errorCode: PaymentError.UNKNOWN_ERROR,
        }
      }

      // 获取价格ID
      const priceId =
        STRIPE_PRICES[request.planId as keyof typeof STRIPE_PRICES]?.[request.billingCycle]
      if (!priceId) {
        return {
          success: false,
          error: '无效的订阅计划',
          errorCode: PaymentError.UNKNOWN_ERROR,
        }
      }

      // 创建支付会话
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          userId: request.userId,
          userEmail: request.userEmail,
          successUrl: request.successUrl || `${window.location.origin}/payment/success`,
          cancelUrl: request.cancelUrl || `${window.location.origin}/pricing`,
        },
      })

      if (error) {
        console.error('创建支付会话失败:', error)
        return {
          success: false,
          error: '创建支付会话失败',
          errorCode: PaymentError.PROCESSING_ERROR,
        }
      }

      if (!data?.sessionId) {
        return {
          success: false,
          error: '支付会话创建失败',
          errorCode: PaymentError.PROCESSING_ERROR,
        }
      }

      return {
        success: true,
        sessionId: data.sessionId,
      }
    } catch (error) {
      console.error('支付服务错误:', error)
      return {
        success: false,
        error: '支付服务暂时不可用',
        errorCode: PaymentError.NETWORK_ERROR,
      }
    }
  }

  /**
   * 重定向到支付页面
   */
  static async redirectToCheckout(sessionId: string): Promise<boolean> {
    try {
      const stripe = await getStripe()
      if (!stripe) {
        console.error('Stripe 未初始化')
        return false
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        console.error('重定向到支付页面失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('支付重定向错误:', error)
      return false
    }
  }

  /**
   * 获取用户订阅信息
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // 没有找到订阅记录
          return null
        }
        console.error('获取订阅信息失败:', error)
        return null
      }

      return {
        id: data.id,
        status: data.status as SubscriptionStatus,
        planId: data.plan_id,
        billingCycle: data.billing_cycle || 'monthly',
        currentPeriodStart: new Date(data.current_period_start),
        currentPeriodEnd: new Date(data.current_period_end),
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        stripeSubscriptionId: data.stripe_subscription_id,
      }
    } catch (error) {
      console.error('获取订阅信息错误:', error)
      return null
    }
  }

  /**
   * 取消订阅
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      if (!subscription) {
        return false
      }

      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscriptionId: subscription.stripeSubscriptionId,
          userId,
        },
      })

      if (error) {
        console.error('取消订阅失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('取消订阅错误:', error)
      return false
    }
  }

  /**
   * 恢复订阅
   */
  static async resumeSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      if (!subscription) {
        return false
      }

      const { error } = await supabase.functions.invoke('resume-subscription', {
        body: {
          subscriptionId: subscription.stripeSubscriptionId,
          userId,
        },
      })

      if (error) {
        console.error('恢复订阅失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('恢复订阅错误:', error)
      return false
    }
  }

  /**
   * 更新支付方式
   */
  static async updatePaymentMethod(userId: string): Promise<string | null> {
    try {
      const subscription = await this.getUserSubscription(userId)
      if (!subscription) {
        return null
      }

      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId,
          returnUrl: `${window.location.origin}/profile`,
        },
      })

      if (error) {
        console.error('创建客户门户会话失败:', error)
        return null
      }

      return data?.url || null
    } catch (error) {
      console.error('更新支付方式错误:', error)
      return null
    }
  }

  /**
   * 检查用户是否有有效订阅
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      return subscription !== null && subscription.status === SubscriptionStatus.ACTIVE
    } catch (error) {
      console.error('检查订阅状态错误:', error)
      return false
    }
  }

  /**
   * 获取用户订阅层级
   */
  static async getUserSubscriptionTier(userId: string): Promise<string> {
    try {
      const subscription = await this.getUserSubscription(userId)
      if (subscription) {
        return subscription.planId
      }

      // 如果没有订阅，返回免费层级
      return 'free'
    } catch (error) {
      console.error('获取订阅层级错误:', error)
      return 'free'
    }
  }
}
