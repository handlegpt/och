import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../i18n/context'

interface StructuredDataProps {
  type?: 'WebSite' | 'WebPage' | 'Organization' | 'SoftwareApplication' | 'Product'
  data?: any
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type = 'WebSite', data }) => {
  const { language } = useTranslation()
  const location = useLocation()

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: 'Och AI',
    description:
      language === 'zh'
        ? 'AI驱动的图像生成和编辑工具，将您的照片转换为3D手办、动漫风格、高清增强等多种艺术效果。'
        : 'AI-powered image generation and editing tool that transforms your photos into 3D figurines, anime styles, HD enhancement and more.',
    url:
      typeof window !== 'undefined'
        ? `${window.location.origin}${location.pathname}`
        : location.pathname,
    inLanguage: language === 'zh' ? 'zh-CN' : 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Och AI',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      logo: {
        '@type': 'ImageObject',
        url:
          typeof window !== 'undefined'
            ? `${window.location.origin}/images/logo.png`
            : '/images/logo.png',
      },
    },
  }

  const getPageSpecificData = () => {
    switch (location.pathname) {
      case '/':
        return {
          ...baseStructuredData,
          '@type': 'WebSite',
          potentialAction: {
            '@type': 'SearchAction',
            target:
              typeof window !== 'undefined'
                ? `${window.location.origin}/search?q={search_term_string}`
                : '/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
          mainEntity: {
            '@type': 'SoftwareApplication',
            name: 'Och AI',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
            featureList: [
              'AI Image Generation',
              '3D Figurine Transformation',
              'Anime Style Conversion',
              'HD Image Enhancement',
              'Batch Processing',
              'Multiple AI Effects',
            ],
          },
        }

      case '/pricing':
        return {
          ...baseStructuredData,
          '@type': 'WebPage',
          mainEntity: {
            '@type': 'Product',
            name: 'Och AI Subscription Plans',
            description: 'Choose the perfect plan for your AI image generation needs',
            offers: [
              {
                '@type': 'Offer',
                name: 'Free Plan',
                price: '0',
                priceCurrency: 'USD',
                description: '3 daily generations, basic AI effects',
              },
              {
                '@type': 'Offer',
                name: 'Standard Plan',
                price: '9.99',
                priceCurrency: 'USD',
                description: '50 daily generations, advanced AI effects',
              },
              {
                '@type': 'Offer',
                name: 'Professional Plan',
                price: '19.99',
                priceCurrency: 'USD',
                description: '200 daily generations, all AI effects, API access',
              },
            ],
          },
        }

      case '/categories':
        return {
          ...baseStructuredData,
          '@type': 'WebPage',
          mainEntity: {
            '@type': 'ItemList',
            name: 'AI Image Transformation Categories',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: '3D Figurine',
                description: 'Transform photos into 3D figurine style',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Anime Style',
                description: 'Convert photos to anime/manga style',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'HD Enhancement',
                description: 'Enhance image quality and resolution',
              },
            ],
          },
        }

      default:
        return baseStructuredData
    }
  }

  const structuredData = data || getPageSpecificData()

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  )
}

// 面包屑导航结构化数据
export const BreadcrumbStructuredData: React.FC<{
  items: Array<{ name: string; url: string }>
}> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  )
}

// FAQ结构化数据
export const FAQStructuredData: React.FC<{ faqs: Array<{ question: string; answer: string }> }> = ({
  faqs,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  )
}
