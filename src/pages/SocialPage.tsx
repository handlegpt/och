import React, { useState } from 'react'
import { useTranslation } from '../../i18n/context'
import { GalleryWall } from '../components/social/GalleryWall'
import { UserCollections } from '../components/social/UserCollections'

export const SocialPage: React.FC = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'gallery' | 'collections'>('gallery')

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pb-20'>
      <div className='container mx-auto p-4 md:p-8'>
        {/* 页面标题 */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>
            {t('social.title')}
          </h1>
          <p className='text-[var(--text-secondary)]'>{t('social.subtitle')}</p>
        </div>

        {/* 标签页导航 */}
        <div className='flex border-b border-[var(--border-primary)] mb-8'>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'gallery'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className='mr-2'>🖼️</span>
            {t('social.gallery.title')}
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'collections'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className='mr-2'>📚</span>
            {t('social.collections.title')}
          </button>
        </div>

        {/* 标签页内容 */}
        <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
          {activeTab === 'gallery' && (
            <div>
              <GalleryWall />
            </div>
          )}

          {activeTab === 'collections' && (
            <div>
              <UserCollections />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
