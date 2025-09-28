import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const BottomNavigation: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // 参考 Nano Banana AI 的完整footer设计
  const quickNavItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
    },
    {
      path: '/categories',
      icon: '🎨',
      label: 'Features',
    },
    {
      path: '/pricing',
      icon: '💎',
      label: 'Pricing',
    },
    {
      path: '/social',
      icon: '🖼️',
      label: 'Showcase',
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile',
    },
  ]

  const productLinks = [
    { path: '/categories', label: 'AI Editor' },
    { path: '/categories', label: 'Features' },
    { path: '/social', label: 'Examples' },
  ]

  const resourceLinks = [
    { path: '/pricing', label: 'Pricing' },
    { path: '/profile', label: 'Support' },
    { path: '/profile', label: 'API' },
  ]

  const companyLinks = [
    { path: '/profile', label: 'About' },
    { path: '/profile', label: 'Blog' },
    { path: '/profile', label: 'Contact' },
  ]

  return (
    <>
      {/* 完整Footer - 参考 Nano Banana AI */}
      <footer className='bg-[var(--bg-card-alpha)] backdrop-blur-lg border-t border-[var(--border-primary)] mt-20'>
        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* 左侧：公司信息和联系方式 */}
            <div className='space-y-6'>
              {/* Logo和描述 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-8 h-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>O</span>
                  </div>
                  <span className='text-xl font-bold text-[var(--text-primary)]'>och.ai</span>
                </div>
                <p className='text-[var(--text-secondary)] leading-relaxed max-w-md'>
                  Transform any image with simple text prompts. och.ai's advanced model delivers
                  consistent character editing and scene preservation.
                </p>
              </div>

              {/* 社交媒体图标 */}
              <div className='flex items-center gap-4'>
                <a
                  href='#'
                  className='w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors'
                >
                  <span className='text-sm'>𝕏</span>
                </a>
                <a
                  href='#'
                  className='w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors'
                >
                  <span className='text-sm'>📧</span>
                </a>
                <a
                  href='#'
                  className='w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors'
                >
                  <span className='text-sm'>💬</span>
                </a>
              </div>

              {/* 联系信息 */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                  Contact Us
                </h3>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm font-medium text-[var(--text-primary)]'>
                      Official Support Email
                    </p>
                    <a
                      href='mailto:support@och.ai'
                      className='text-sm text-[var(--accent-primary)] hover:underline'
                    >
                      support@och.ai
                    </a>
                    <p className='text-xs text-[var(--text-secondary)] mt-1'>
                      For technical support and customer service
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：链接分组 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Product */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Product</h3>
                <ul className='space-y-3'>
                  {productLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Resources</h3>
                <ul className='space-y-3'>
                  {resourceLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Company</h3>
                <ul className='space-y-3'>
                  {companyLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 底部版权和链接 */}
          <div className='border-t border-[var(--border-primary)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-[var(--text-secondary)]'>
              © 2025 • och.ai All rights reserved.
            </p>
            <div className='flex items-center gap-6'>
              <Link
                to='/privacy'
                className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                to='/more'
                className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 移动端快速导航 - 固定在底部 */}
      <nav className='fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card-alpha)] backdrop-blur-lg border-t border-[var(--border-primary)] shadow-lg md:hidden'>
        <div className='pb-safe-area-inset-bottom'>
          <div className='flex items-center justify-around py-3 px-4'>
            {quickNavItems.map(item => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                    active
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {/* 活跃状态背景 */}
                  {active && (
                    <div className='absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl'></div>
                  )}

                  {/* 图标容器 */}
                  <div
                    className={`relative z-10 mb-1 transition-all duration-300 ${
                      active ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    <span className='text-lg'>{item.icon}</span>
                    {/* 活跃状态指示器 */}
                    {active && (
                      <div className='absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-primary)] rounded-full'></div>
                    )}
                  </div>

                  {/* 标签文字 */}
                  <span
                    className={`text-xs font-medium truncate w-full text-center transition-all duration-300 ${
                      active
                        ? 'text-[var(--accent-primary)] font-semibold'
                        : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
