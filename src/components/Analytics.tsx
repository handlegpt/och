import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Google Analytics 配置
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-E7DE94T8NW'

// 调试信息
console.log('🔍 GA_TRACKING_ID:', GA_TRACKING_ID)
console.log('🔍 import.meta.env:', import.meta.env)

// 初始化 Google Analytics
export const initGoogleAnalytics = () => {
  console.log('🔍 initGoogleAnalytics called')
  console.log('🔍 GA_TRACKING_ID:', GA_TRACKING_ID)
  console.log('🔍 typeof window:', typeof window)

  if (!GA_TRACKING_ID) {
    console.warn('⚠️ GA_TRACKING_ID is not defined')
    return
  }

  if (typeof window === 'undefined') {
    console.warn('⚠️ window is undefined (SSR)')
    return
  }

  console.log('✅ Starting Google Analytics initialization...')

  // 加载 Google Analytics 脚本
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // 初始化 gtag
  window.dataLayer = window.dataLayer || []
  const gtag = (...args: any[]) => {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })

  console.log('📊 Google Analytics initialized with ID:', GA_TRACKING_ID)
}

// 页面浏览跟踪
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  })

  console.log('📊 Page view tracked:', { url, title })
}

// 事件跟踪
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })

  console.log('📊 Event tracked:', { action, category, label, value })
}

// 用户属性跟踪
export const setUserProperties = (userId: string, properties?: Record<string, any>) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', GA_TRACKING_ID, {
    user_id: userId,
    custom_map: properties,
  })

  console.log('📊 User properties set:', { userId, properties })
}

// 转换跟踪
export const trackConversion = (conversionId: string, value?: number, currency?: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'conversion', {
    send_to: conversionId,
    value: value,
    currency: currency || 'USD',
  })

  console.log('📊 Conversion tracked:', { conversionId, value, currency })
}

// 自定义维度跟踪
export const trackCustomDimension = (index: number, value: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', GA_TRACKING_ID, {
    [`custom_map.dimension${index}`]: value,
  })

  console.log('📊 Custom dimension tracked:', { index, value })
}

// Analytics 组件
export const Analytics: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    console.log('🔍 Analytics component mounted')
    console.log('🔍 GA_TRACKING_ID in component:', GA_TRACKING_ID)
    // 初始化 Google Analytics
    initGoogleAnalytics()
  }, [])

  useEffect(() => {
    console.log('🔍 Location changed:', location.pathname + location.search)
    // 跟踪页面浏览
    if (GA_TRACKING_ID) {
      trackPageView(location.pathname + location.search)
    }
  }, [location])

  return null // 这个组件不渲染任何内容
}

// 预定义的跟踪事件
export const AnalyticsEvents = {
  // 用户行为
  USER_LOGIN: (method: string) => trackEvent('login', 'user', method),
  USER_LOGOUT: () => trackEvent('logout', 'user'),
  USER_SIGNUP: (method: string) => trackEvent('sign_up', 'user', method),

  // 功能使用
  IMAGE_GENERATION: (style: string) => trackEvent('generate_image', 'feature', style),
  IMAGE_UPLOAD: () => trackEvent('upload_image', 'feature'),
  IMAGE_DOWNLOAD: () => trackEvent('download_image', 'feature'),

  // 订阅相关
  SUBSCRIPTION_START: (plan: string) => trackEvent('begin_checkout', 'ecommerce', plan),
  SUBSCRIPTION_COMPLETE: (plan: string, value: number) =>
    trackEvent('purchase', 'ecommerce', plan, value),
  SUBSCRIPTION_CANCEL: (plan: string) => trackEvent('cancel_subscription', 'ecommerce', plan),

  // 页面访问
  PRICING_VIEW: () => trackEvent('view_pricing', 'page'),
  PROFILE_VIEW: () => trackEvent('view_profile', 'page'),
  CATEGORIES_VIEW: () => trackEvent('view_categories', 'page'),

  // 错误跟踪
  ERROR_OCCURRED: (error: string) => trackEvent('error', 'system', error),
  API_ERROR: (endpoint: string) => trackEvent('api_error', 'system', endpoint),
}

// 声明全局类型
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
