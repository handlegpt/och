import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../i18n/context'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  noindex?: boolean
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  noindex = false,
}) => {
  const { language } = useTranslation()
  const location = useLocation()

  const currentUrl =
    url ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${location.pathname}`
      : location.pathname)
  const currentTitle = title || 'Och AI - Transform Every Photo Into Art'
  const currentDescription =
    description ||
    'AI-powered image generation and editing. Transform your photos into 3D figurines, anime styles, HD enhancement and more.'
  const currentKeywords =
    keywords || 'AI image generation, photo editing, 3D figurine, anime style, HD enhancement'

  useEffect(() => {
    try {
      // 更新页面标题
      document.title = currentTitle

      // 更新或创建meta标签
      const updateMetaTag = (name: string, content: string, property?: boolean) => {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
        let meta = document.querySelector(selector) as HTMLMetaElement

        if (!meta) {
          meta = document.createElement('meta')
          if (property) {
            meta.setAttribute('property', name)
          } else {
            meta.setAttribute('name', name)
          }
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', content)
      }

      // 基础meta标签
      updateMetaTag('description', currentDescription)
      updateMetaTag('keywords', currentKeywords)
      updateMetaTag('robots', noindex ? 'noindex,nofollow' : 'index,follow')

      // Open Graph标签
      updateMetaTag('og:title', currentTitle, true)
      updateMetaTag('og:description', currentDescription, true)
      updateMetaTag('og:type', type, true)
      updateMetaTag('og:url', currentUrl, true)
      updateMetaTag('og:image', image, true)
      updateMetaTag('og:site_name', 'Och AI', true)
      updateMetaTag('og:locale', language === 'zh' ? 'zh_CN' : 'en_US', true)

      // Twitter Card标签
      updateMetaTag('twitter:card', 'summary_large_image')
      updateMetaTag('twitter:title', currentTitle)
      updateMetaTag('twitter:description', currentDescription)
      updateMetaTag('twitter:image', image)

      // 语言标签
      updateMetaTag('language', language)
      updateMetaTag('content-language', language)

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', currentUrl)

      // Hreflang标签（多语言支持）
      const hreflangEn = document.querySelector(
        'link[rel="alternate"][hreflang="en"]'
      ) as HTMLLinkElement
      const hreflangZh = document.querySelector(
        'link[rel="alternate"][hreflang="zh"]'
      ) as HTMLLinkElement

      if (!hreflangEn) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', 'en')
        link.setAttribute('href', `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}lang=en`)
        document.head.appendChild(link)
      }

      if (!hreflangZh) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', 'zh')
        link.setAttribute('href', `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}lang=zh`)
        document.head.appendChild(link)
      }
    } catch (error) {
      console.error('SEO Head error:', error)
    }
  }, [
    currentTitle,
    currentDescription,
    currentKeywords,
    image,
    currentUrl,
    type,
    noindex,
    language,
  ])

  return null
}

// 预定义的SEO配置
export const SEO_CONFIGS = {
  home: {
    title: 'Och AI - Transform Every Photo Into Art',
    description:
      'AI-powered image generation and editing. Transform your photos into 3D figurines, anime styles, HD enhancement and more. 50+ AI effects available.',
    keywords:
      'AI image generation, photo editing, 3D figurine, anime style, HD enhancement, artificial intelligence, image transformation',
  },
  pricing: {
    title: 'Pricing - Och AI',
    description:
      'Choose the perfect plan for your AI image generation needs. Free, Standard, Professional, and Enterprise plans available.',
    keywords: 'AI pricing, image generation pricing, Och AI plans, subscription pricing',
  },
  profile: {
    title: 'Profile - Och AI',
    description:
      'Manage your Och AI account, view generation history, and customize your preferences.',
    keywords: 'user profile, account management, generation history',
  },
  categories: {
    title: 'Categories - Och AI',
    description:
      'Explore different AI image transformation categories including 3D figurines, anime styles, and artistic effects.',
    keywords:
      'AI categories, image transformation types, 3D figurine, anime style, artistic effects',
  },
  social: {
    title: 'Social Gallery - Och AI',
    description:
      'Discover amazing AI-generated images from our community. Share your creations and get inspired.',
    keywords: 'AI gallery, community, shared creations, inspiration',
  },
  privacy: {
    title: 'Privacy Policy - Och AI',
    description: 'Learn how Och AI protects your privacy and handles your data.',
    keywords: 'privacy policy, data protection, user privacy',
  },
  settings: {
    title: 'Settings - Och AI',
    description: 'Customize your Och AI experience with personalized settings.',
    keywords: 'user settings, preferences, customization',
  },
}
