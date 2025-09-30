import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from '../../../i18n/context'

interface Feature {
  key: string
  emoji: string
  titleKey: string
  category: string
  tags: string[]
  isPopular?: boolean
  isNew?: boolean
  description?: string
}

interface EnhancedFeatureGridProps {
  features: Feature[]
  onSelect: (feature: Feature) => void
  onBack?: () => void
  title?: string
  description?: string
}

export const EnhancedFeatureGrid: React.FC<EnhancedFeatureGridProps> = ({
  features,
  onSelect,
  onBack,
  title,
  description,
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'new' | 'name'>('default')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCategoryEffects, setShowCategoryEffects] = useState(false)

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(features.map(f => f.category))]
    return cats.map(cat => {
      const translationKey = `categories.${cat}`
      const translatedLabel = cat === 'all' ? t('categories.all') : t(translationKey)

      // 如果翻译失败，使用硬编码的中文映射
      const fallbackLabels: Record<string, string> = {
        creative: '创意设计',
        toys: '玩具模型',
        fashion: '时尚美妆',
        realistic: '写实渲染',
        enhancement: '图像增强',
        reference: '参考工具',
      }

      const finalLabel =
        translatedLabel === translationKey ? fallbackLabels[cat] || cat : translatedLabel

      return {
        key: cat,
        label: finalLabel,
        count: cat === 'all' ? features.length : features.filter(f => f.category === cat).length,
      }
    })
  }, [features, t])

  // 过滤和排序功能
  const filteredAndSortedFeatures = useMemo(() => {
    let filtered = features

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory)
    }

    // 按搜索查询过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        f =>
          t(f.titleKey).toLowerCase().includes(query) ||
          f.tags.some(tag => tag.toLowerCase().includes(query)) ||
          (f.description && f.description.toLowerCase().includes(query))
      )
    }

    // 排序
    switch (sortBy) {
      case 'popular':
        filtered = filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        break
      case 'new':
        filtered = filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'name':
        filtered = filtered.sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey)))
        break
      default:
        // 保持默认顺序
        break
    }

    return filtered
  }, [features, selectedCategory, searchQuery, sortBy, t])

  const handleFeatureClick = useCallback(
    (feature: Feature) => {
      // 如果是category_effects且有items，显示子效果
      if (feature.key === 'category_effects' && feature.items) {
        setShowCategoryEffects(true)
        return
      }
      onSelect(feature)
    },
    [onSelect]
  )

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setSearchQuery('') // 清除搜索查询
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any)
  }, [])

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  return (
    <div className='container mx-auto p-4 md:p-8 animate-fade-in'>
      {/* 标题和返回按钮 */}
      <div className='mb-8'>
        {onBack && (
          <button
            onClick={onBack}
            className='flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-[rgba(107,114,128,0.1)] mb-4'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            {t('app.back')}
          </button>
        )}
        <h2 className='text-3xl font-bold text-center mb-4 text-[var(--accent-primary)]'>
          {title || t('transformationSelector.title')}
        </h2>
        <p className='text-lg text-center text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto'>
          {description || t('transformationSelector.description')}
        </p>
      </div>

      {/* 搜索和筛选栏 */}
      <div className='mb-8 space-y-4'>
        {/* 搜索框 */}
        <div className='relative max-w-md mx-auto'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-[var(--text-secondary)]'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <input
            type='text'
            placeholder={t('features.allFeatures.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className='w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent'
          />
        </div>

        {/* 分类、排序和视图模式 */}
        <div className='flex flex-wrap items-center justify-center gap-4'>
          {/* 分类筛选 */}
          <div className='flex flex-wrap gap-2'>
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* 排序选择 */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className='px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]'
          >
            <option value='default'>{t('features.sort.default')}</option>
            <option value='popular'>{t('features.sort.popular')}</option>
            <option value='new'>{t('features.sort.new')}</option>
            <option value='name'>{t('features.sort.name')}</option>
          </select>

          {/* 视图模式切换 */}
          <div className='flex bg-[var(--bg-secondary)] rounded-lg p-1'>
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
              </svg>
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      <div className='mb-6 text-center'>
        <p className='text-[var(--text-secondary)]'>
          {t('features.allFeatures.foundCount').replace(
            '{count}',
            filteredAndSortedFeatures.length.toString()
          )}
          {searchQuery && ` (${t('common.search')}: "${searchQuery}")`}
          {selectedCategory !== 'all' &&
            ` (${t('features.allFeatures.categoryLabel')}${categories.find(c => c.key === selectedCategory)?.label})`}
        </p>
      </div>

      {/* 功能网格/列表 */}
      {showCategoryEffects ? (
        // 显示50个艺术效果
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-[var(--text-primary)]'>
              {t('transformations.categories.effects.title')}
            </h2>
            <button
              onClick={() => setShowCategoryEffects(false)}
              className='flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-[rgba(107,114,128,0.1)]'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              {t('app.back')}
            </button>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {features
              .find(f => f.key === 'category_effects')
              ?.items?.map((item: any) => (
                <button
                  key={item.key}
                  onClick={() => onSelect(item)}
                  className='group flex flex-col items-center justify-center text-center transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] p-4 aspect-square bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                >
                  <span className='text-4xl mb-2 transition-transform duration-200 group-hover:scale-110'>
                    {item.emoji}
                  </span>
                  <span className='text-sm font-semibold text-[var(--text-primary)]'>
                    {t(item.titleKey)}
                  </span>
                </button>
              ))}
          </div>
        </div>
      ) : filteredAndSortedFeatures.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>🔍</div>
          <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
            未找到匹配的功能
          </h3>
          <p className='text-[var(--text-secondary)] mb-4'>尝试调整搜索条件或选择其他分类</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'
          >
            清除筛选
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'space-y-3'
          }
        >
          {filteredAndSortedFeatures.map(feature => (
            <button
              key={feature.key}
              onClick={() => handleFeatureClick(feature)}
              className={`group flex items-center justify-center text-center transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] ${
                viewMode === 'grid'
                  ? 'flex-col p-4 aspect-square bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                  : 'w-full p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] hover:border-[var(--accent-primary)] text-left'
              }`}
            >
              <div className='flex items-center gap-3'>
                <span
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    viewMode === 'grid' ? 'text-4xl mb-2' : 'text-2xl'
                  }`}
                >
                  {feature.emoji}
                </span>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span
                      className={`font-semibold text-[var(--text-primary)] ${
                        viewMode === 'grid' ? 'text-sm' : 'text-base'
                      }`}
                    >
                      {t(feature.titleKey)}
                    </span>
                    {feature.isPopular && (
                      <span className='text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full'>
                        {t('features.labels.popular')}
                      </span>
                    )}
                    {feature.isNew && (
                      <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
                        {t('features.labels.new')}
                      </span>
                    )}
                  </div>
                  {viewMode === 'list' && feature.description && (
                    <p className='text-sm text-[var(--text-secondary)]'>{feature.description}</p>
                  )}
                  {viewMode === 'list' && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {feature.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className='text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-1 rounded'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
