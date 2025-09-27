import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import ThemeSwitcher from '../../components/ThemeSwitcher'
import { UserInfo } from './UserInfo'
import { useGenerationState } from '../hooks/useGenerationState'

export const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [, actions] = useGenerationState()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogoClick = () => {
    // 重置所有状态
    actions.setSelectedTransformation(null)
    actions.clearPrimaryImage()
    actions.clearSecondaryImage()
    actions.setGeneratedContent(null)
    actions.setError(null)
    actions.setIsLoading(false)
    actions.setMaskData(null)
    actions.setCustomPrompt('')
    actions.setActiveTool('none')
    actions.setActiveCategory(null)

    // 导航到首页
    navigate('/')

    // 强制刷新页面以确保状态完全重置
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <header className='bg-[var(--bg-card-alpha)] backdrop-blur-lg sticky top-0 z-20 border-b border-[var(--border-primary)]'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className='text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] transition-all duration-200 cursor-pointer'
          >
            och.ai
          </button>

          {/* 主导航 - 参考 Nano Banana AI */}
          <nav className='hidden md:flex items-center gap-8'>
            <Link
              to='/categories'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/categories')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Features
            </Link>

            <Link
              to='/pricing'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/pricing')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pricing
            </Link>

            <Link
              to='/social'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/social')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Showcase
            </Link>

            <Link
              to='/profile'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/profile')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Profile
            </Link>

            <Link
              to='/more'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/more')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              More
            </Link>
          </nav>

          {/* 右侧工具 */}
          <div className='flex items-center gap-3'>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <UserInfo />
          </div>
        </div>

        {/* 移动端导航 */}
        <div className='md:hidden mt-3 pt-3 border-t border-[var(--border-primary)]'>
          <nav className='flex items-center gap-4 flex-wrap'>
            <Link
              to='/categories'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/categories')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Features
            </Link>

            <Link
              to='/pricing'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/pricing')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pricing
            </Link>

            <Link
              to='/social'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/social')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Showcase
            </Link>

            <Link
              to='/profile'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/profile')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Profile
            </Link>

            <Link
              to='/more'
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/more')
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              More
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
