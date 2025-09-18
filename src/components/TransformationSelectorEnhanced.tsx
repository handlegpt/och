import React, { useState, useCallback } from 'react';
import { useTranslation } from '../../../i18n/context';
import { EnhancedFeatureGrid } from './ui/EnhancedFeatureGrid';
import { FEATURE_CONFIGS, FEATURE_CATEGORIES } from '../config/featureCategories';

interface TransformationSelectorEnhancedProps {
  transformations: any[];
  onSelect: (transformation: any) => void;
  hasPreviousResult: boolean;
  onOrderChange: (newOrder: any[]) => void;
  activeCategory: any | null;
  setActiveCategory: (category: any | null) => void;
}

export const TransformationSelectorEnhanced: React.FC<TransformationSelectorEnhancedProps> = ({
  transformations,
  onSelect,
  hasPreviousResult,
  onOrderChange,
  activeCategory,
  setActiveCategory
}) => {
  const { t } = useTranslation();
  const [showEnhancedGrid, setShowEnhancedGrid] = useState(false);

  // 将transformations转换为FeatureConfig格式
  const features = transformations.map(trans => {
    const config = FEATURE_CONFIGS.find(c => c.key === trans.key);
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
    };
  });

  const handleFeatureSelect = useCallback((feature: any) => {
    const transformation = transformations.find(t => t.key === feature.key);
    if (transformation) {
      onSelect(transformation);
    }
  }, [transformations, onSelect]);

  const handleBackToCategories = useCallback(() => {
    setShowEnhancedGrid(false);
  }, []);

  const handleShowEnhancedGrid = useCallback(() => {
    setShowEnhancedGrid(true);
  }, []);

  // 如果显示增强网格
  if (showEnhancedGrid) {
    return (
      <EnhancedFeatureGrid
        features={features}
        onSelect={handleFeatureSelect}
        onBack={handleBackToCategories}
        title="所有功能"
        description="浏览和搜索所有可用的AI生成功能"
      />
    );
  }

  // 原始的分类视图
  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      {/* 标题和描述 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-[var(--accent-primary)]">
          {t('transformationSelector.title')}
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
          {hasPreviousResult 
            ? t('transformationSelector.descriptionWithResult')
            : t('transformationSelector.description')
          }
        </p>
        
        {/* 增强功能按钮 */}
        <button
          onClick={handleShowEnhancedGrid}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:shadow-lg transition-all duration-200 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          浏览所有功能
        </button>
      </div>

      {/* 分类网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {FEATURE_CATEGORIES.map(category => {
          const categoryFeatures = features.filter(f => f.category === category.key);
          const popularCount = categoryFeatures.filter(f => f.isPopular).length;
          const newCount = categoryFeatures.filter(f => f.isNew).length;
          
          return (
            <button
              key={category.key}
              onClick={() => {
                const categoryTransformation = transformations.find(t => t.key === category.key);
                if (categoryTransformation) {
                  setActiveCategory(categoryTransformation);
                }
              }}
              className="group relative p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)]"
            >
              {/* 背景渐变 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200`} />
              
              {/* 内容 */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{category.icon}</span>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                {/* 统计信息 */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    {categoryFeatures.length} 个功能
                  </span>
                  <div className="flex gap-2">
                    {popularCount > 0 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        {popularCount} 热门
                      </span>
                    )}
                    {newCount > 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {newCount} 新功能
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 热门功能预览 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          热门功能
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {features.filter(f => f.isPopular).slice(0, 5).map(feature => (
            <button
              key={feature.key}
              onClick={() => handleFeatureSelect(feature)}
              className="group flex flex-col items-center justify-center text-center p-4 aspect-square bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)]"
            >
              <span className="text-4xl mb-2 transition-transform duration-200 group-hover:scale-110">
                {feature.emoji}
              </span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">
                {t(feature.titleKey)}
              </span>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full mt-1">
                热门
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 新功能预览 */}
      {features.filter(f => f.isNew).length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            新功能
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {features.filter(f => f.isNew).slice(0, 5).map(feature => (
              <button
                key={feature.key}
                onClick={() => handleFeatureSelect(feature)}
                className="group flex flex-col items-center justify-center text-center p-4 aspect-square bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)]"
              >
                <span className="text-4xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {feature.emoji}
                </span>
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  {t(feature.titleKey)}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1">
                  新功能
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 如果用户点击了分类，显示该分类下的功能 */}
      {activeCategory && (
        <div>
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-[rgba(107,114,128,0.1)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('app.back')}
            </button>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center gap-3">
              <span className="text-4xl">{activeCategory.emoji}</span>
              {t(activeCategory.titleKey)}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(activeCategory.items || []).map((item: any, index: number) => (
              <button
                key={item.key}
                onClick={() => onSelect(item)}
                className="group flex flex-col items-center justify-center text-center p-4 aspect-square bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)]"
              >
                <span className="text-4xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {item.emoji}
                </span>
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  {t(item.titleKey)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
