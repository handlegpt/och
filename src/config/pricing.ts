// Och AI 定价配置
export interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  limits: {
    dailyGenerations: number
    maxBatchSize: number
    maxResolution: string
    apiCalls: number
  }
  features: {
    basicEffects: boolean
    advancedEffects: boolean
    batchProcessing: boolean
    highResolution: boolean
    noWatermark: boolean
    apiAccess: boolean
    commercialUse: boolean
    customModels: boolean
    prioritySupport: boolean
    privateDeployment: boolean
    whiteLabel: boolean
  }
  popular?: boolean
  recommended?: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: '免费版',
    description: '适合个人用户和试用',
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      dailyGenerations: 5,
      maxBatchSize: 1,
      maxResolution: '1024x1024',
      apiCalls: 0,
    },
    features: {
      basicEffects: true,
      advancedEffects: false,
      batchProcessing: false,
      highResolution: false,
      noWatermark: false,
      apiAccess: false,
      commercialUse: false,
      customModels: false,
      prioritySupport: false,
      privateDeployment: false,
      whiteLabel: false,
    },
  },
  {
    id: 'standard',
    name: '标准版',
    description: '适合内容创作者和小企业',
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    limits: {
      dailyGenerations: 50,
      maxBatchSize: 10,
      maxResolution: '2048x2048',
      apiCalls: 0,
    },
    features: {
      basicEffects: true,
      advancedEffects: true,
      batchProcessing: true,
      highResolution: true,
      noWatermark: true,
      apiAccess: false,
      commercialUse: false,
      customModels: false,
      prioritySupport: false,
      privateDeployment: false,
      whiteLabel: false,
    },
    popular: true,
  },
  {
    id: 'professional',
    name: '专业版',
    description: '适合开发者和中型企业',
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    limits: {
      dailyGenerations: 200,
      maxBatchSize: -1, // 无限制
      maxResolution: '4096x4096',
      apiCalls: 1000, // 每月免费API调用次数
    },
    features: {
      basicEffects: true,
      advancedEffects: true,
      batchProcessing: true,
      highResolution: true,
      noWatermark: true,
      apiAccess: true,
      commercialUse: true,
      customModels: true,
      prioritySupport: true,
      privateDeployment: false,
      whiteLabel: false,
    },
    recommended: true,
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合大型企业和平台集成',
    price: {
      monthly: 0, // 定制报价
      yearly: 0,
    },
    limits: {
      dailyGenerations: -1, // 无限制
      maxBatchSize: -1,
      maxResolution: '4096x4096',
      apiCalls: -1, // 无限制
    },
    features: {
      basicEffects: true,
      advancedEffects: true,
      batchProcessing: true,
      highResolution: true,
      noWatermark: true,
      apiAccess: true,
      commercialUse: true,
      customModels: true,
      prioritySupport: true,
      privateDeployment: true,
      whiteLabel: true,
    },
  },
]

// API计费配置
export interface APIPricing {
  baseCall: number // 基础API调用价格 ($0.01)
  advancedEffect: number // 高级效果API价格 ($0.05)
  batchProcessing: number // 批量处理API价格 ($0.02)
  customModel: number // 自定义模型API价格 ($0.10)
  overageRate: number // 超出套餐的费率 ($0.005)
}

export const API_PRICING: APIPricing = {
  baseCall: 0.01,
  advancedEffect: 0.05,
  batchProcessing: 0.02,
  customModel: 0.1,
  overageRate: 0.005,
}

// 功能对比表
export const FEATURE_COMPARISON = [
  {
    feature: '每日生成次数',
    free: '5次',
    standard: '50次',
    professional: '200次',
    enterprise: '无限制',
  },
  {
    feature: '基础AI效果',
    free: '✅',
    standard: '✅',
    professional: '✅',
    enterprise: '✅',
  },
  {
    feature: '高级AI效果',
    free: '❌',
    standard: '✅',
    professional: '✅',
    enterprise: '✅',
  },
  {
    feature: '批量处理',
    free: '❌',
    standard: '10张',
    professional: '无限制',
    enterprise: '无限制',
  },
  {
    feature: '高分辨率输出',
    free: '1024x1024',
    standard: '2048x2048',
    professional: '4096x4096',
    enterprise: '4096x4096',
  },
  {
    feature: '无水印',
    free: '❌',
    standard: '✅',
    professional: '✅',
    enterprise: '✅',
  },
  {
    feature: 'API访问',
    free: '❌',
    standard: '❌',
    professional: '✅',
    enterprise: '✅',
  },
  {
    feature: '商业使用',
    free: '❌',
    standard: '❌',
    professional: '✅',
    enterprise: '✅',
  },
  {
    feature: '自定义模型',
    free: '❌',
    standard: '❌',
    professional: '✅',
    enterprise: '✅',
  },
  {
    feature: '私有部署',
    free: '❌',
    standard: '❌',
    professional: '❌',
    enterprise: '✅',
  },
  {
    feature: '白标解决方案',
    free: '❌',
    standard: '❌',
    professional: '❌',
    enterprise: '✅',
  },
]

// 折扣配置
export interface DiscountConfig {
  yearlyDiscount: number // 年度订阅折扣 (17%)
  studentDiscount: number // 学生折扣 (50%)
  referralBonus: number // 推荐奖励 (额外生成次数)
  trialDays: number // 试用天数 (7天)
}

export const DISCOUNT_CONFIG: DiscountConfig = {
  yearlyDiscount: 0.17, // 17%
  studentDiscount: 0.5, // 50%
  referralBonus: 10, // 10次额外生成
  trialDays: 7, // 7天试用
}

// 使用限制检查
export interface UsageLimit {
  dailyLimit: number
  usedToday: number
  remainingToday: number
  canGenerate: boolean
  tier: string
}

export const checkUsageLimit = (tier: string, usedToday: number): UsageLimit => {
  const tierConfig = PRICING_TIERS.find(t => t.id === tier)
  if (!tierConfig) {
    throw new Error(`Unknown tier: ${tier}`)
  }

  const dailyLimit = tierConfig.limits.dailyGenerations
  const remainingToday = Math.max(0, dailyLimit - usedToday)
  const canGenerate = dailyLimit === -1 || usedToday < dailyLimit

  return {
    dailyLimit,
    usedToday,
    remainingToday,
    canGenerate,
    tier,
  }
}

// API使用计费
export interface APIBilling {
  tier: string
  monthlyAPICalls: number
  freeAPICalls: number
  overageCalls: number
  overageCost: number
  totalCost: number
}

export const calculateAPIBilling = (
  tier: string,
  monthlyAPICalls: number,
  _callType: 'base' | 'advanced' | 'batch' | 'custom' = 'base'
): APIBilling => {
  const tierConfig = PRICING_TIERS.find(t => t.id === tier)
  if (!tierConfig) {
    throw new Error(`Unknown tier: ${tier}`)
  }

  const freeAPICalls = tierConfig.limits.apiCalls
  const overageCalls = Math.max(0, monthlyAPICalls - freeAPICalls)

  let overageCost = 0
  if (overageCalls > 0) {
    const rate = API_PRICING.overageRate
    overageCost = overageCalls * rate
  }

  const totalCost = overageCost

  return {
    tier,
    monthlyAPICalls,
    freeAPICalls,
    overageCalls,
    overageCost,
    totalCost,
  }
}
