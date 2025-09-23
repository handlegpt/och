import { faker } from '@faker-js/faker'

// 用户数据工厂
export const userFactory = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  display_name: faker.person.fullName(),
  avatar_url: faker.image.avatar(),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})

// 生成记录工厂
export const generationFactory = (overrides = {}) => ({
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  prompt: faker.lorem.sentence(),
  result_url: faker.image.url(),
  status: faker.helpers.arrayElement(['pending', 'completed', 'failed']),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})

// 使用限制工厂
export const usageLimitFactory = (overrides = {}) => ({
  dailyLimit: faker.number.int({ min: 5, max: 100 }),
  usedToday: faker.number.int({ min: 0, max: 10 }),
  remainingToday: faker.number.int({ min: 0, max: 10 }),
  canGenerate: faker.datatype.boolean(),
  tier: faker.helpers.arrayElement(['free', 'standard', 'professional', 'enterprise']),
  ...overrides,
})

// 社交数据工厂
export const socialPostFactory = (overrides = {}) => ({
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  content: faker.lorem.paragraph(),
  image_url: faker.image.url(),
  likes_count: faker.number.int({ min: 0, max: 1000 }),
  comments_count: faker.number.int({ min: 0, max: 100 }),
  shares_count: faker.number.int({ min: 0, max: 50 }),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})

// 评论工厂
export const commentFactory = (overrides = {}) => ({
  id: faker.string.uuid(),
  post_id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  content: faker.lorem.sentence(),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})

// 收藏工厂
export const favoriteFactory = (overrides = {}) => ({
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  generation_id: faker.string.uuid(),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})

// 集合工厂
export const collectionFactory = (overrides = {}) => ({
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  name: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  is_public: faker.datatype.boolean(),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})

// 定价方案工厂
export const pricingTierFactory = (overrides = {}) => ({
  id: faker.helpers.arrayElement(['free', 'standard', 'professional', 'enterprise']),
  name: faker.lorem.words(2),
  description: faker.lorem.sentence(),
  price: {
    monthly: faker.number.int({ min: 0, max: 100 }),
    yearly: faker.number.int({ min: 0, max: 1000 }),
  },
  limits: {
    dailyGenerations: faker.number.int({ min: 5, max: 1000 }),
    maxBatchSize: faker.number.int({ min: 1, max: 50 }),
    maxResolution: faker.helpers.arrayElement(['1024x1024', '2048x2048', '4096x4096']),
    apiCalls: faker.number.int({ min: 0, max: 10000 }),
  },
  features: {
    basicEffects: faker.datatype.boolean(),
    advancedEffects: faker.datatype.boolean(),
    batchProcessing: faker.datatype.boolean(),
    highResolution: faker.datatype.boolean(),
    noWatermark: faker.datatype.boolean(),
    apiAccess: faker.datatype.boolean(),
    commercialUse: faker.datatype.boolean(),
    customModels: faker.datatype.boolean(),
    prioritySupport: faker.datatype.boolean(),
    privateDeployment: faker.datatype.boolean(),
    whiteLabel: faker.datatype.boolean(),
  },
  ...overrides,
})

// 批量生成数据
export const generateUsers = (count: number) => Array.from({ length: count }, () => userFactory())

export const generateGenerations = (count: number) =>
  Array.from({ length: count }, () => generationFactory())

export const generateSocialPosts = (count: number) =>
  Array.from({ length: count }, () => socialPostFactory())

export const generateComments = (count: number) =>
  Array.from({ length: count }, () => commentFactory())
