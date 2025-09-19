import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../../i18n/context'

export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // 优化为4个主要菜单项，避免与顶部导航重复
  const navItems = [
    {
      path: '/',
      icon: '🏠',
      activeIcon: '🏠',
      label: t('nav.home'),
      description: '首页',
    },
    {
      path: '/categories',
      icon: '🎨',
      activeIcon: '🎨',
      label: t('nav.categories'),
      description: 'AI效果',
    },
    {
      path: '/privacy',
      icon: '🔒',
      activeIcon: '🔒',
      label: '隐私',
      description: '隐私政策',
    },
    {
      path: '/more',
      icon: '⚙️',
      activeIcon: '⚙️',
      label: '设置',
      description: '应用设置',
    },
  ]

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card-alpha)] backdrop-blur-lg border-t border-[var(--border-primary)] shadow-lg'>
      {/* 安全区域适配 */}
      <div className='pb-safe-area-inset-bottom'>
        <div className='flex items-center justify-around py-3 px-2 max-w-md mx-auto'>
          {navItems.map(item => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                  active
                    ? 'text-[var(--accent-primary)] scale-105'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105'
                }`}
              >
                {/* 活跃状态背景 */}
                {active && (
                  <div className='absolute inset-0 bg-[var(--accent-primary)]/10 rounded-xl animate-pulse'></div>
                )}

                {/* 图标容器 */}
                <div
                  className={`relative z-10 mb-1 transition-all duration-300 ${
                    active ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  <span className='text-xl'>{active ? item.activeIcon : item.icon}</span>

                  {/* 活跃状态指示器 */}
                  {active && (
                    <div className='absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-ping'></div>
                  )}
                </div>

                {/* 标签文字 */}
                <span
                  className={`text-xs font-medium truncate w-full text-center transition-all duration-300 ${
                    active
                      ? 'text-[var(--accent-primary)] font-semibold'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {item.label}
                </span>

                {/* 悬停提示 */}
                <div className='absolute bottom-full mb-2 px-2 py-1 bg-[var(--bg-card)] text-[var(--text-primary)] text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20'>
                  {item.description}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-[var(--bg-card)]'></div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
