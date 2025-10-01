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
    videoMaxDuration?: number // 视频最大时长（秒）
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
    videoGeneration: boolean // 是否支持视频生成
  }
  popular?: boolean
  recommended?: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'pricing.tiers.free.name',
    description: 'pricing.tiers.free.description',
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      dailyGenerations: 3, // 每月3次
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
      videoGeneration: false, // 免费计划不支持视频生成
    },
  },
  {
    id: 'basic',
    name: 'pricing.tiers.basic.name',
    description: 'pricing.tiers.basic.description',
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    limits: {
      dailyGenerations: 200, // 每月200次
      maxBatchSize: 5,
      maxResolution: '2048x2048',
      apiCalls: 0,
    },
    features: {
      basicEffects: true,
      advancedEffects: true,
      batchProcessing: true,
      highResolution: true,
      noWatermark: false, // Basic计划有水印
      apiAccess: false,
      commercialUse: false,
      customModels: false,
      prioritySupport: false,
      privateDeployment: false,
      whiteLabel: false,
      videoGeneration: false, // Basic计划不支持视频生成
    },
  },
  {
    id: 'pro',
    name: 'pricing.tiers.pro.name',
    description: 'pricing.tiers.pro.description',
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    limits: {
      dailyGenerations: 800, // 每月800次
      maxBatchSize: 20,
      maxResolution: '4096x4096',
      apiCalls: 1000, // 每月API调用次数
      videoMaxDuration: 20, // Pro计划视频最大20秒
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
      prioritySupport: false, // Pro计划不包含优先支持
      privateDeployment: false,
      whiteLabel: true, // Pro计划包含白标解决方案
      videoGeneration: true, // Pro计划支持视频生成
    },
    popular: true,
  },
  {
    id: 'max',
    name: 'pricing.tiers.max.name',
    description: 'pricing.tiers.max.description',
    price: {
      monthly: 79.99,
      yearly: 799.99,
    },
    limits: {
      dailyGenerations: 2000, // 每月2000次
      maxBatchSize: -1, // 无限制
      maxResolution: '4096x4096',
      apiCalls: 5000, // 每月API调用次数
      videoMaxDuration: 60, // Max计划视频最大60秒
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
      whiteLabel: false,
      videoGeneration: true, // Max计划支持视频生成
    },
    recommended: true,
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
    feature: 'pricing.featureComparisonDetails.dailyGenerations',
    free: 'pricing.featureComparisonDetails.free.dailyGenerations',
    standard: 'pricing.featureComparisonDetails.standard.dailyGenerations',
    professional: 'pricing.featureComparisonDetails.professional.dailyGenerations',
    max: 'pricing.featureComparisonDetails.max.dailyGenerations',
  },
  {
    feature: 'pricing.featureComparisonDetails.basicEffects',
    free: '✅',
    standard: '✅',
    professional: '✅',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.advancedEffects',
    free: '❌',
    standard: '✅',
    professional: '✅',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.batchProcessing',
    free: '❌',
    standard: 'pricing.featureComparisonDetails.standard.batchProcessing',
    professional: 'pricing.featureComparisonDetails.professional.batchProcessing',
    max: 'pricing.featureComparisonDetails.max.batchProcessing',
  },
  {
    feature: 'pricing.featureComparisonDetails.highResolution',
    free: '1024x1024',
    standard: '2048x2048',
    professional: '4096x4096',
    max: '4096x4096',
  },
  {
    feature: 'pricing.featureComparisonDetails.noWatermark',
    free: '❌',
    standard: '✅',
    professional: '✅',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.apiAccess',
    free: '❌',
    standard: '❌',
    professional: '✅',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.commercialUse',
    free: '❌',
    standard: '❌',
    professional: '✅',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.customModels',
    free: '❌',
    standard: '❌',
    professional: '✅',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.privateDeployment',
    free: '❌',
    standard: '❌',
    professional: '❌',
    max: '✅',
  },
  {
    feature: 'pricing.featureComparisonDetails.whiteLabel',
    free: '❌',
    standard: '❌',
    professional: '❌',
    max: '✅',
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
