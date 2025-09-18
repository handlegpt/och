import React, { useState, useCallback } from 'react'
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
  hasPreviousResult,
  onOrderChange: _onOrderChange,
  activeCategory,
  setActiveCategory
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
      estimatedTime: config?.estimatedTime
    }
  })

  const handleFeatureSelect = useCallback((feature: any) => {
    const transformation = transformations.find(t => t.key === feature.key)
    if (transformation) {
      onSelect(transformation)
    }
  }, [transformations, onSelect])

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
      title='所有功能'
      description='浏览和搜索所有可用的AI生成功能'
    />
  )
}