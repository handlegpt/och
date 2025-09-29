import React from 'react'
import { useTranslation } from '../i18n/context'
import { useNavigate, useLocation } from 'react-router-dom'

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en'
    changeLanguage(newLang)

    // 更新URL以反映语言变化
    const currentPath = location.pathname
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('lang', newLang)

    // 导航到新的URL
    navigate(`${currentPath}?${searchParams.toString()}`, { replace: true })
  }

  return (
    <button
      onClick={toggleLanguage}
      className='py-2 px-3 text-sm font-semibold text-[var(--text-primary)] bg-[rgba(107,114,128,0.2)] rounded-md hover:bg-[rgba(107,114,128,0.4)] transition-colors duration-200'
      aria-label='Switch language'
    >
      {language === 'en' ? '中文' : 'EN'}
    </button>
  )
}

export default LanguageSwitcher
