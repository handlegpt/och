import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLanguage } from './useLanguage'

// Mock the store to prevent infinite loops
vi.mock('../stores/appStore', () => ({
  useLanguage: () => ({
    language: { current: 'zh', browserDetected: false },
    setLanguage: vi.fn(),
    setBrowserDetected: vi.fn(),
  }),
}))

// Mock translations
vi.mock('../../i18n/zh', () => ({
  default: {
    home: {
      title: '首页',
      hero: {
        title: '欢迎使用 Och AI',
      },
    },
  },
}))

vi.mock('../../i18n/en', () => ({
  default: {
    home: {
      title: 'Home',
      hero: {
        title: 'Welcome to Och AI',
      },
    },
  },
}))

describe('useLanguage', () => {
  beforeEach(() => {
    // 清除 localStorage
    localStorage.clear()
    // 重置 navigator.language
    Object.defineProperty(navigator, 'language', {
      value: 'en',
      writable: true,
    })
  })

  it('initializes with default language', () => {
    const { result } = renderHook(() => useLanguage())

    expect(result.current.language).toBe('zh')
    expect(typeof result.current.setLanguage).toBe('function')
    expect(typeof result.current.t).toBe('function')
  })

  it('translates keys correctly', () => {
    const { result } = renderHook(() => useLanguage())

    // 测试中文翻译
    expect(result.current.t('home.title')).toBe('首页')
    expect(result.current.t('home.hero.title')).toBe('欢迎使用 Och AI')
  })

  it('changes language when setLanguage is called', () => {
    const { result } = renderHook(() => useLanguage())

    act(() => {
      result.current.setLanguage('en')
    })

    expect(result.current.language).toBe('en')
  })

  it('falls back to English for missing keys', () => {
    const { result } = renderHook(() => useLanguage())

    // 测试不存在的键
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key')
  })

  it('detects browser language on first load', () => {
    // 模拟中文浏览器
    Object.defineProperty(navigator, 'language', {
      value: 'zh-CN',
      writable: true,
    })

    const { result } = renderHook(() => useLanguage())

    // 应该检测到中文
    expect(result.current.language).toBe('zh')
  })

  it('detects English browser language', () => {
    // 模拟英文浏览器
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      writable: true,
    })

    const { result } = renderHook(() => useLanguage())

    // 应该检测到英文
    expect(result.current.language).toBe('en')
  })

  it('handles navigator.languages array', () => {
    // 模拟 navigator.languages
    Object.defineProperty(navigator, 'languages', {
      value: ['zh-CN', 'en-US'],
      writable: true,
    })

    const { result } = renderHook(() => useLanguage())

    // 应该使用第一个语言
    expect(result.current.language).toBe('zh')
  })

  it('handles missing navigator.language gracefully', () => {
    // 模拟缺失的 navigator.language
    Object.defineProperty(navigator, 'language', {
      value: undefined,
      writable: true,
    })

    Object.defineProperty(navigator, 'languages', {
      value: undefined,
      writable: true,
    })

    const { result } = renderHook(() => useLanguage())

    // 应该回退到英文
    expect(result.current.language).toBe('en')
  })

  it('persists language selection', () => {
    const { result } = renderHook(() => useLanguage())

    act(() => {
      result.current.setLanguage('en')
    })

    // 检查是否保存到 localStorage
    expect(localStorage.getItem('language')).toBe('en')
  })

  it('loads saved language from localStorage', () => {
    // 预设 localStorage
    localStorage.setItem('language', 'en')

    const { result } = renderHook(() => useLanguage())

    expect(result.current.language).toBe('en')
  })

  it('handles translation errors gracefully', () => {
    const { result } = renderHook(() => useLanguage())

    // 测试深层嵌套的键
    expect(result.current.t('very.deep.nested.key')).toBe('very.deep.nested.key')
  })
})
