import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import en from './en'
import zh from './zh'

type Language = 'en' | 'zh'

const translations = { en, zh }

interface LanguageContextType {
  language: Language
  changeLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation()

  const [language, setLanguage] = useState<Language>(() => {
    try {
      // 首先检查URL参数中的语言设置
      if (location?.search) {
        const urlParams = new URLSearchParams(location.search)
        const urlLang = urlParams.get('lang')
        if (urlLang === 'en' || urlLang === 'zh') {
          return urlLang
        }
      }

      // 然后检查是否有保存的语言设置
      if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('language')
        if (savedLang === 'en' || savedLang === 'zh') {
          return savedLang
        }

        // 如果没有保存的设置，根据浏览器语言自动选择
        const browserLang = navigator.language || navigator.languages?.[0] || 'en'

        // 检查是否是中文（包括 zh-CN, zh-TW, zh-HK 等）
        if (browserLang.startsWith('zh')) {
          return 'zh'
        }
      }

      // 其他情况默认英文
      return 'en'
    } catch {
      // 出错时默认英文
      return 'en'
    }
  })

  // 监听URL变化并更新语言
  useEffect(() => {
    if (location?.search) {
      const urlParams = new URLSearchParams(location.search)
      const urlLang = urlParams.get('lang')
      if (urlLang === 'en' || urlLang === 'zh') {
        setLanguage(urlLang)
      }
    }
  }, [location.search])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language)
      }
    } catch (e) {
      console.error('Failed to save language to localStorage', e)
    }
  }, [language])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  const t = (key: string): string => {
    if (!key) return ''
    const keys = key.split('.')
    let result: any = translations[language]
    for (const k of keys) {
      result = result?.[k]
      if (result === undefined) {
        // Fallback to English if key not found in current language
        let fallbackResult: any = translations['en']
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk]
        }
        return fallbackResult || key
      }
    }
    return result || key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
