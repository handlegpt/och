import { loadStripe, Stripe } from '@stripe/stripe-js'

// Stripe 配置
const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('⚠️ Stripe publishable key not found. Payment functionality will be disabled.')
}

// 初始化 Stripe
let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}

// 价格配置 (以分为单位)
export const STRIPE_PRICES = {
  standard: {
    monthly: 'price_standard_monthly', // 需要在 Stripe Dashboard 中创建
    yearly: 'price_standard_yearly',
  },
  professional: {
    monthly: 'price_professional_monthly',
    yearly: 'price_professional_yearly',
  },
  enterprise: {
    monthly: 'price_enterprise_monthly',
    yearly: 'price_enterprise_yearly',
  },
} as const

// 订阅计划配置
export const SUBSCRIPTION_PLANS = {
  standard: {
    name: 'Standard',
    description: 'Perfect for individuals and small teams',
    features: [
      '50 daily generations',
      'Advanced AI effects',
      'Batch processing',
      'High resolution output',
      'No watermark',
    ],
  },
  professional: {
    name: 'Professional',
    description: 'For professionals and growing businesses',
    features: [
      '200 daily generations',
      'All AI effects',
      'Unlimited batch processing',
      '4K resolution output',
      'API access',
      'Commercial use',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    features: [
      'Unlimited generations',
      'Custom models',
      'Private deployment',
      'White-label solution',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
} as const

// 支付状态
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

// 订阅状态
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
}

// 支付错误类型
export enum PaymentError {
  CARD_DECLINED = 'card_declined',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  EXPIRED_CARD = 'expired_card',
  INCORRECT_CVC = 'incorrect_cvc',
  PROCESSING_ERROR = 'processing_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error',
}

// 获取支付错误信息
export const getPaymentErrorMessage = (error: PaymentError): string => {
  const errorMessages = {
    [PaymentError.CARD_DECLINED]: '您的银行卡被拒绝，请尝试其他支付方式',
    [PaymentError.INSUFFICIENT_FUNDS]: '账户余额不足，请充值后重试',
    [PaymentError.EXPIRED_CARD]: '银行卡已过期，请使用其他有效卡片',
    [PaymentError.INCORRECT_CVC]: 'CVC 验证码错误，请检查后重试',
    [PaymentError.PROCESSING_ERROR]: '支付处理出错，请稍后重试',
    [PaymentError.NETWORK_ERROR]: '网络连接错误，请检查网络后重试',
    [PaymentError.UNKNOWN_ERROR]: '未知错误，请联系客服支持',
  }

  return errorMessages[error] || errorMessages[PaymentError.UNKNOWN_ERROR]
}

// 格式化价格显示
export const formatPrice = (amount: number, currency: string = 'CNY'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

// 获取订阅计划显示名称
export const getPlanDisplayName = (planId: string): string => {
  const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
  return plan?.name || planId
}

// 获取订阅计划描述
export const getPlanDescription = (planId: string): string => {
  const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
  return plan?.description || ''
}

// 获取订阅计划功能列表
export const getPlanFeatures = (planId: string): string[] => {
  const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
  return plan?.features ? [...plan.features] : []
}
