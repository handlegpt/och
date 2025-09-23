import { useEffect } from 'react'
import { useLanguage as useLanguageStore } from '../stores/appStore'
import en from '../../i18n/en'
import zh from '../../i18n/zh'

const translations = { en, zh }

export const useLanguage = () => {
  const { language, setLanguage, setBrowserDetected } = useLanguageStore()

  // 初始化语言检测
  useEffect(() => {
    if (!language.browserDetected) {
      try {
        // 检查是否有保存的语言设置
        const savedLang = localStorage.getItem('language')
        if (savedLang === 'en' || savedLang === 'zh') {
          setLanguage(savedLang)
          setBrowserDetected(true)
          return
        }

        // 根据浏览器语言自动选择
        const browserLang = navigator.language || navigator.languages?.[0] || 'en'
        const detectedLang = browserLang.startsWith('zh') ? 'zh' : 'en'

        setLanguage(detectedLang)
        setBrowserDetected(true)
      } catch (error) {
        console.error('Language detection failed:', error)
        setLanguage('en')
        setBrowserDetected(true)
      }
    }
  }, [language.browserDetected, setLanguage, setBrowserDetected])

  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: any = translations[language.current]

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

  return {
    language: language.current,
    setLanguage,
    t,
  }
}
