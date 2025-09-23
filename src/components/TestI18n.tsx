import React, { useState, useEffect } from 'react'

// 简化的国际化测试组件
export const TestI18n: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const [loading, setLoading] = useState(true)

  // 模拟语言检测
  useEffect(() => {
    console.log('TestI18n: Detecting language')

    const detectLanguage = () => {
      try {
        // 检查本地存储
        const savedLang = localStorage.getItem('test-language')
        if (savedLang === 'en' || savedLang === 'zh') {
          setLanguage(savedLang)
          setLoading(false)
          return
        }

        // 模拟浏览器语言检测
        const browserLang = navigator.language || 'en'
        const detectedLang = browserLang.startsWith('zh') ? 'zh' : 'en'
        setLanguage(detectedLang)
      } catch (error) {
        console.error('Language detection error:', error)
        setLanguage('en')
      } finally {
        setLoading(false)
      }
    }

    detectLanguage()
  }, []) // 空依赖数组

  const translations = {
    en: {
      title: 'Internationalization Test',
      greeting: 'Hello, World!',
      description: 'This component tests i18n functionality.',
      switchTo: 'Switch to Chinese',
    },
    zh: {
      title: '国际化测试',
      greeting: '你好，世界！',
      description: '这个组件测试国际化功能。',
      switchTo: '切换到英文',
    },
  }

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  const handleLanguageChange = () => {
    const newLang = language === 'en' ? 'zh' : 'en'
    setLanguage(newLang)
    localStorage.setItem('test-language', newLang)
  }

  if (loading) {
    return <div className='p-4'>Loading language...</div>
  }

  return (
    <div className='p-4'>
      <h2>{t('title')}</h2>
      <p>{t('greeting')}</p>
      <p>{t('description')}</p>
      <button
        onClick={handleLanguageChange}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        {t('switchTo')}
      </button>
    </div>
  )
}
