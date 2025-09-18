import React, { useState } from 'react';
// import { useTranslation } from '../../../i18n/context';

interface ImprovementSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'ui' | 'feature' | 'performance' | 'security';
  icon: string;
  status: 'suggested' | 'in-progress' | 'completed';
}

export const ProfileImprovements: React.FC = () => {
  // const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const improvements: ImprovementSuggestion[] = [
    // UI/UX 改进
    {
      id: 'profile-avatar-upload',
      title: '头像上传功能',
      description: '允许用户直接上传头像图片，而不是只能使用URL',
      priority: 'high',
      category: 'ui',
      icon: '📸',
      status: 'suggested'
    },
    {
      id: 'profile-theme-customization',
      title: '主题自定义',
      description: '提供更多主题选项，包括自定义颜色方案',
      priority: 'medium',
      category: 'ui',
      icon: '🎨',
      status: 'suggested'
    },
    {
      id: 'profile-dashboard-layout',
      title: '仪表板布局优化',
      description: '重新设计用户仪表板，提供更直观的数据展示',
      priority: 'high',
      category: 'ui',
      icon: '📊',
      status: 'suggested'
    },

    // 功能增强
    {
      id: 'profile-favorites',
      title: '收藏功能',
      description: '允许用户收藏喜欢的生成结果，创建个人画廊',
      priority: 'high',
      category: 'feature',
      icon: '❤️',
      status: 'suggested'
    },
    {
      id: 'profile-sharing',
      title: '分享功能',
      description: '支持将生成结果分享到社交媒体或生成分享链接',
      priority: 'medium',
      category: 'feature',
      icon: '🔗',
      status: 'suggested'
    },
    {
      id: 'profile-batch-operations',
      title: '批量操作增强',
      description: '支持批量重命名、移动、分类生成结果',
      priority: 'medium',
      category: 'feature',
      icon: '📦',
      status: 'suggested'
    },
    {
      id: 'profile-search-filter',
      title: '高级搜索和过滤',
      description: '按日期、类型、标签等条件搜索和过滤生成历史',
      priority: 'high',
      category: 'feature',
      icon: '🔍',
      status: 'suggested'
    },
    {
      id: 'profile-ai-suggestions',
      title: 'AI 推荐系统',
      description: '基于用户历史推荐相似风格或类型的生成',
      priority: 'low',
      category: 'feature',
      icon: '🤖',
      status: 'suggested'
    },

    // 性能优化
    {
      id: 'profile-lazy-loading',
      title: '懒加载优化',
      description: '实现图片和数据的懒加载，提升页面加载速度',
      priority: 'high',
      category: 'performance',
      icon: '⚡',
      status: 'suggested'
    },
    {
      id: 'profile-caching',
      title: '智能缓存',
      description: '实现用户数据的智能缓存，减少重复请求',
      priority: 'medium',
      category: 'performance',
      icon: '💾',
      status: 'suggested'
    },

    // 安全增强
    {
      id: 'profile-2fa',
      title: '双因素认证',
      description: '为账户添加双因素认证，提升安全性',
      priority: 'high',
      category: 'security',
      icon: '🔐',
      status: 'suggested'
    },
    {
      id: 'profile-privacy-controls',
      title: '隐私控制',
      description: '提供更细粒度的隐私设置，控制数据可见性',
      priority: 'medium',
      category: 'security',
      icon: '🛡️',
      status: 'suggested'
    }
  ];

  const categories = [
    { value: 'all', label: '全部', icon: '📋' },
    { value: 'ui', label: '界面优化', icon: '🎨' },
    { value: 'feature', label: '功能增强', icon: '⚡' },
    { value: 'performance', label: '性能优化', icon: '🚀' },
    { value: 'security', label: '安全增强', icon: '🔒' }
  ];

  const priorities = [
    { value: 'all', label: '全部优先级', icon: '📊' },
    { value: 'high', label: '高优先级', icon: '🔴' },
    { value: 'medium', label: '中优先级', icon: '🟡' },
    { value: 'low', label: '低优先级', icon: '🟢' }
  ];

  const filteredImprovements = improvements.filter(improvement => {
    const categoryMatch = selectedCategory === 'all' || improvement.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || improvement.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'in-progress': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'suggested': return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          🚀 用户后台改善建议
        </h2>
        <p className="text-[var(--text-secondary)]">
          基于当前功能分析，以下是建议的改进方向
        </p>
      </div>

      {/* 筛选器 */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">分类:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">优先级:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.icon} {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 改善建议列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredImprovements.map((improvement) => (
          <div
            key={improvement.id}
            className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6 hover:border-[var(--accent-primary)] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{improvement.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {improvement.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(improvement.priority)}`}>
                      {improvement.priority === 'high' ? '高优先级' : 
                       improvement.priority === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(improvement.status)}`}>
                      {improvement.status === 'suggested' ? '建议中' :
                       improvement.status === 'in-progress' ? '进行中' : '已完成'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {improvement.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)]">
                {categories.find(c => c.value === improvement.category)?.label}
              </span>
              <button className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors">
                查看详情 →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          📈 改善统计
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--accent-primary)]">
              {improvements.length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">总建议数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {improvements.filter(i => i.priority === 'high').length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">高优先级</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {improvements.filter(i => i.status === 'in-progress').length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">进行中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {improvements.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">已完成</div>
          </div>
        </div>
      </div>
    </div>
  );
};
