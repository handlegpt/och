import React, { useState } from 'react'
import { useTranslation } from '../i18n/context'
import { useNavigate, useLocation } from 'react-router-dom'

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  const handleLanguageChange = (newLang: string) => {
    changeLanguage(newLang as 'en' | 'zh')

    // 更新URL以反映语言变化
    const currentPath = location.pathname
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('lang', newLang)

    // 导航到新的URL
    navigate(`${currentPath}?${searchParams.toString()}`, { replace: true })

    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 py-2 px-3 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-primary)] transition-all duration-200 shadow-sm'
        aria-label='Select language'
      >
        <span className='text-lg'>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 mt-1 w-40 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50 overflow-hidden'>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--bg-secondary)] transition-colors duration-150 ${
                language === lang.code
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              <span className='text-lg'>{lang.flag}</span>
              <span className='font-medium'>{lang.name}</span>
              {language === lang.code && (
                <svg className='w-4 h-4 ml-auto' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />}
    </div>
  )
}

export default LanguageSwitcher
