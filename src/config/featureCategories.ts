// 功能分类配置
export interface FeatureCategory {
  key: string
  name: string
  description: string
  icon: string
  color: string
}

export interface FeatureConfig {
  key: string
  emoji: string
  titleKey: string
  category: string
  tags: string[]
  isPopular?: boolean
  isNew?: boolean
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  estimatedTime?: string
}

// 功能分类定义
export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    key: 'creative',
    name: '创意设计',
    description: '创意和艺术相关的功能',
    icon: '🎨',
    color: 'from-purple-500 to-pink-500',
  },
  {
    key: 'toys',
    name: '玩具模型',
    description: '各种玩具和模型制作',
    icon: '🧸',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'fashion',
    name: '时尚美妆',
    description: '时尚和美容相关功能',
    icon: '👗',
    color: 'from-pink-500 to-rose-500',
  },
  {
    key: 'realistic',
    name: '写实渲染',
    description: '照片级真实渲染',
    icon: '📸',
    color: 'from-green-500 to-emerald-500',
  },
  {
    key: 'enhancement',
    name: '图像增强',
    description: '图像质量和效果增强',
    icon: '✨',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    key: 'reference',
    name: '参考工具',
    description: '姿势和参考相关工具',
    icon: '📐',
    color: 'from-indigo-500 to-purple-500',
  },
]

// 功能配置定义 - 基于实际的TRANSFORMATIONS
export const FEATURE_CONFIGS: FeatureConfig[] = [
  // 创意设计类
  {
    key: 'customPrompt',
    emoji: '✍️',
    titleKey: 'transformations.effects.customPrompt.title',
    category: 'creative',
    tags: ['自定义', '创意', '文本'],
    isPopular: true,
    description: '使用自定义提示词生成创意内容',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },
  {
    key: 'cosplay',
    emoji: '🎭',
    titleKey: 'transformations.effects.cosplay.title',
    category: 'creative',
    tags: ['动漫', 'Cosplay', '角色扮演'],
    isNew: true,
    description: '将动漫角色转换为真人Cosplay',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },

  // 玩具模型类
  {
    key: 'figurine',
    emoji: '🧍',
    titleKey: 'transformations.effects.figurine.title',
    category: 'toys',
    tags: ['3D', '手办', '模型'],
    isPopular: true,
    description: '生成3D手办模型',
    difficulty: 'medium',
    estimatedTime: '2-4分钟',
  },
  {
    key: 'funko',
    emoji: '📦',
    titleKey: 'transformations.effects.funko.title',
    category: 'toys',
    tags: ['Funko', '公仔', '收藏'],
    description: '生成Funko Pop风格公仔',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },
  {
    key: 'lego',
    emoji: '🧱',
    titleKey: 'transformations.effects.lego.title',
    category: 'toys',
    tags: ['乐高', '积木', '小人仔'],
    description: '生成乐高小人仔',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },
  {
    key: 'crochet',
    emoji: '🧶',
    titleKey: 'transformations.effects.crochet.title',
    category: 'toys',
    tags: ['钩针', '毛线', '手工'],
    description: '生成钩针娃娃',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },
  {
    key: 'plushie',
    emoji: '🧸',
    titleKey: 'transformations.effects.plushie.title',
    category: 'toys',
    tags: ['毛绒', '玩具', '可爱'],
    description: '生成可爱毛绒玩具',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },
  {
    key: 'keychain',
    emoji: '🔑',
    titleKey: 'transformations.effects.keychain.title',
    category: 'toys',
    tags: ['亚克力', '钥匙扣', '装饰'],
    description: '生成亚克力钥匙扣',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },

  // 时尚美妆类
  {
    key: 'fashion',
    emoji: '📸',
    titleKey: 'transformations.effects.fashion.title',
    category: 'fashion',
    tags: ['时尚', '杂志', '摄影'],
    isPopular: true,
    description: '生成时尚杂志风格照片',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },
  {
    key: 'makeup',
    emoji: '💄',
    titleKey: 'transformations.effects.makeup.title',
    category: 'fashion',
    tags: ['美妆', '化妆', '建议'],
    description: '美妆分析和改进建议',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },

  // 写实渲染类
  {
    key: 'photorealistic',
    emoji: '🪄',
    titleKey: 'transformations.effects.photorealistic.title',
    category: 'realistic',
    tags: ['照片级', '写实', '真实'],
    isPopular: true,
    description: '转换为照片级真实效果',
    difficulty: 'hard',
    estimatedTime: '3-5分钟',
  },
  {
    key: 'hyperrealistic',
    emoji: '✨',
    titleKey: 'transformations.effects.hyperrealistic.title',
    category: 'realistic',
    tags: ['超写实', '细节', '真实'],
    isNew: true,
    description: '生成超写实效果',
    difficulty: 'hard',
    estimatedTime: '4-6分钟',
  },
  {
    key: 'architecture',
    emoji: '🏗️',
    titleKey: 'transformations.effects.architecture.title',
    category: 'realistic',
    tags: ['建筑', '模型', '3D'],
    description: '生成建筑模型',
    difficulty: 'medium',
    estimatedTime: '2-4分钟',
  },
  {
    key: 'productRender',
    emoji: '💡',
    titleKey: 'transformations.effects.productRender.title',
    category: 'realistic',
    tags: ['产品', '渲染', '商业'],
    description: '生成产品渲染图',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },

  // 图像增强类
  {
    key: 'hdEnhance',
    emoji: '🔍',
    titleKey: 'transformations.effects.hdEnhance.title',
    category: 'enhancement',
    tags: ['高清', '增强', '质量'],
    isPopular: true,
    description: '高清图像增强',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },

  // 参考工具类
  {
    key: 'pose',
    emoji: '💃',
    titleKey: 'transformations.effects.pose.title',
    category: 'reference',
    tags: ['姿势', '参考', '动作'],
    description: '生成姿势参考图',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },

  // 其他功能
  {
    key: 'videoGeneration',
    emoji: '🎬',
    titleKey: 'transformations.video.title',
    category: 'creative',
    tags: ['视频', '生成', '动画'],
    isNew: true,
    description: 'AI视频生成',
    difficulty: 'hard',
    estimatedTime: '5-10分钟',
  },
  {
    key: 'colorPalette',
    emoji: '🎨',
    titleKey: 'transformations.effects.colorPalette.title',
    category: 'creative',
    tags: ['色彩', '调色板', '艺术'],
    description: '色彩调色板生成',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },
  {
    key: 'isolate',
    emoji: '🎯',
    titleKey: 'transformations.effects.isolate.title',
    category: 'enhancement',
    tags: ['抠图', '背景', '分离'],
    description: '人物抠图和背景分离',
    difficulty: 'medium',
    estimatedTime: '2-3分钟',
  },
  {
    key: 'background',
    emoji: '🪩',
    titleKey: 'transformations.effects.background.title',
    category: 'enhancement',
    tags: ['背景', '替换', '风格'],
    description: '背景替换和风格化',
    difficulty: 'easy',
    estimatedTime: '1-2分钟',
  },
]

// 获取功能配置
export const getFeatureConfig = (key: string): FeatureConfig | undefined => {
  return FEATURE_CONFIGS.find(config => config.key === key)
}

// 按分类获取功能
export const getFeaturesByCategory = (category: string): FeatureConfig[] => {
  return FEATURE_CONFIGS.filter(config => config.category === category)
}

// 获取热门功能
export const getPopularFeatures = (): FeatureConfig[] => {
  return FEATURE_CONFIGS.filter(config => config.isPopular)
}

// 获取新功能
export const getNewFeatures = (): FeatureConfig[] => {
  return FEATURE_CONFIGS.filter(config => config.isNew)
}

// 搜索功能
export const searchFeatures = (query: string): FeatureConfig[] => {
  const lowerQuery = query.toLowerCase()
  return FEATURE_CONFIGS.filter(
    config =>
      config.titleKey.toLowerCase().includes(lowerQuery) ||
      config.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (config.description && config.description.toLowerCase().includes(lowerQuery))
  )
}
