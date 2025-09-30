import React, { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from '../../i18n/context'
import { EnhancedFeatureGrid } from './ui/EnhancedFeatureGrid'
import { FEATURE_CONFIGS } from '../config/featureCategories'

interface TransformationSelectorEnhancedProps {
  transformations: any[]
  onSelect: (transformation: any) => void
  hasPreviousResult: boolean
  onOrderChange: (newOrder: any[]) => void
  activeCategory: any | null
  setActiveCategory: (category: any | null) => void
}

export const TransformationSelectorEnhanced: React.FC<TransformationSelectorEnhancedProps> = ({
  transformations,
  onSelect,
  hasPreviousResult: _hasPreviousResult,
  onOrderChange: _onOrderChange,
  activeCategory: _activeCategory,
  setActiveCategory: _setActiveCategory,
}) => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  // 将transformations转换为FeatureConfig格式
  const features = transformations.map(trans => {
    const config = FEATURE_CONFIGS.find(c => c.key === trans.key)
    return {
      key: trans.key,
      emoji: trans.emoji,
      titleKey: trans.titleKey,
      category: config?.category || 'creative',
      tags: config?.tags || [],
      isPopular: config?.isPopular || false,
      isNew: config?.isNew || false,
      description: config?.description,
      difficulty: config?.difficulty,
      estimatedTime: config?.estimatedTime,
      items: trans.items, // 添加items属性
    }
  })

  const handleFeatureSelect = useCallback(
    (feature: any) => {
      // 如果是category_effects，需要特殊处理
      if (feature.key === 'category_effects' && feature.items) {
        // 显示50个艺术效果选项，而不是直接选择
        // 这里需要展开items并显示为子选项
        return
      }

      // 查找transformation，如果找不到，说明是子效果，直接传递
      const transformation = transformations.find(t => t.key === feature.key)
      if (transformation) {
        onSelect(transformation)
      } else {
        // 如果是子效果（不在主transformations中），直接传递
        onSelect(feature)
      }
    },
    [transformations, onSelect]
  )

  const handleBackToCategories = useCallback(() => {
    // 更新URL参数回到分类视图
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('view', 'categories')
    newSearchParams.delete('category')
    setSearchParams(newSearchParams, { replace: false })
  }, [searchParams, setSearchParams])

  // 直接显示所有功能页面
  return (
    <EnhancedFeatureGrid
      features={features}
      onSelect={handleFeatureSelect}
      onBack={handleBackToCategories}
      title={t('features.allFeatures.title')}
      description={t('features.allFeatures.description')}
    />
  )
}
