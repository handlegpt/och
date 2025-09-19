import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../../i18n/context'

export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: t('nav.home'),
      activeIcon: '🏠',
    },
    {
      path: '/categories',
      icon: '🎨',
      label: t('nav.categories'),
      activeIcon: '🎨',
    },
    {
      path: '/profile',
      icon: '👤',
      label: t('nav.profile'),
      activeIcon: '👤',
    },
    {
      path: '/privacy',
      icon: '🔒',
      label: t('nav.privacy'),
      activeIcon: '🔒',
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: t('nav.settings'),
      activeIcon: '⚙️',
    },
  ]

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card-alpha)] backdrop-blur-lg border-t border-[var(--border-primary)]'>
      <div className='flex items-center justify-around py-2 px-4'>
        {navItems.map(item => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                active
                  ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <span className='text-lg mb-1'>{active ? item.activeIcon : item.icon}</span>
              <span className='text-xs font-medium truncate w-full text-center'>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
