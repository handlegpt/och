import React, { useState } from 'react'
import { useTranslation } from '../../../i18n/context'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

interface ShareToGalleryProps {
  imageUrl: string
  transformationType: string
  title?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const ShareToGallery: React.FC<ShareToGalleryProps> = ({
  imageUrl,
  transformationType,
  title,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isSharing, setIsSharing] = useState(false)
  const [shareTitle, setShareTitle] = useState(title || '')
  const [shareDescription, setShareDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const handleShare = async () => {
    if (!user || !imageUrl) return

    setIsSharing(true)
    try {
      // 保存到 public_gallery 表
      const { data, error } = await supabase
        .from('public_gallery')
        .insert({
          user_id: user.id,
          title:
            shareTitle || `AI生成_${transformationType}_${new Date().toISOString().split('T')[0]}`,
          description: shareDescription,
          image_url: imageUrl,
          transformation_type: transformationType,
          is_public: isPublic,
          is_featured: false,
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          share_count: 0,
        })
        .select()
        .single()

      if (error) {
        console.error('Error sharing to gallery:', error)
        alert(t('social.share.error'))
        return
      }

      console.log('Successfully shared to gallery:', data)
      onSuccess?.()
    } catch (error) {
      console.error('Error sharing to gallery:', error)
      alert(t('social.share.error'))
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6 max-w-md w-full mx-4'>
        <div className='mb-6'>
          <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
            {t('social.shareToGallery.title')}
          </h3>
          <p className='text-[var(--text-secondary)] text-sm'>
            {t('social.shareToGallery.subtitle')}
          </p>
        </div>

        {/* 预览图片 */}
        <div className='mb-4'>
          <img src={imageUrl} alt={shareTitle} className='w-full h-32 object-cover rounded-lg' />
        </div>

        {/* 标题输入 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            {t('social.shareToGallery.titleLabel')}
          </label>
          <input
            type='text'
            value={shareTitle}
            onChange={e => setShareTitle(e.target.value)}
            placeholder={t('social.shareToGallery.titlePlaceholder')}
            className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]'
          />
        </div>

        {/* 描述输入 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            {t('social.shareToGallery.descriptionLabel')}
          </label>
          <textarea
            value={shareDescription}
            onChange={e => setShareDescription(e.target.value)}
            placeholder={t('social.shareToGallery.descriptionPlaceholder')}
            rows={3}
            className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)] resize-none'
          />
        </div>

        {/* 公开设置 */}
        <div className='mb-6'>
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className='w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]'
            />
            <span className='text-sm text-[var(--text-primary)]'>
              {t('social.shareToGallery.publicLabel')}
            </span>
          </label>
          <p className='text-xs text-[var(--text-secondary)] mt-1 ml-7'>
            {t('social.shareToGallery.publicDescription')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            disabled={isSharing}
            className='flex-1 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50'
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleShare}
            disabled={isSharing || !shareTitle.trim()}
            className='flex-1 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {isSharing ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                {t('social.shareToGallery.sharing')}
              </>
            ) : (
              <>
                <span>📤</span>
                {t('social.shareToGallery.shareButton')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
