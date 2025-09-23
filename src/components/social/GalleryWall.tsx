import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../../i18n/context'
import { supabase } from '../../lib/supabase'

interface GalleryItem {
  id: string
  title: string
  description?: string
  image_url: string
  transformation_type: string
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
  created_at: string
  user_liked: boolean
  user_info: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
  }
}

interface GalleryWallProps {
  userId?: string
  showUserGallery?: boolean
}

export const GalleryWall: React.FC<GalleryWallProps> = ({ userId, showUserGallery = false }) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchGalleryItems = useCallback(
    async (pageNum: number = 0, reset: boolean = false) => {
      try {
        setLoading(true)

        let query
        if (showUserGallery && userId) {
          // 获取特定用户的作品
          const { data, error } = await supabase.rpc('get_user_gallery', {
            target_user_id: userId,
            limit_count: 20,
            offset_count: pageNum * 20,
          })

          if (error) throw error
          query = data
        } else {
          // 获取热门作品
          const { data, error } = await supabase.rpc('get_trending_gallery', {
            limit_count: 20,
            days_back: 7,
          })

          if (error) throw error
          query = data
        }

        if (reset) {
          setGalleryItems(query || [])
        } else {
          setGalleryItems(prev => [...prev, ...(query || [])])
        }

        setHasMore((query || []).length === 20)
      } catch (error) {
        console.error('Error fetching gallery items:', error)
      } finally {
        setLoading(false)
      }
    },
    [showUserGallery, userId, user]
  )

  useEffect(() => {
    fetchGalleryItems(0, true)
  }, [userId, showUserGallery])

  const handleLike = async (galleryId: string, isLiked: boolean) => {
    if (!user) return

    try {
      if (isLiked) {
        // 取消点赞
        const { error } = await supabase
          .from('gallery_likes')
          .delete()
          .eq('gallery_id', galleryId)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // 添加点赞
        const { error } = await supabase.from('gallery_likes').insert({
          gallery_id: galleryId,
          user_id: user.id,
        })

        if (error) throw error
      }

      // 更新本地状态
      setGalleryItems(prev =>
        prev.map(item =>
          item.id === galleryId
            ? {
                ...item,
                user_liked: !isLiked,
                like_count: isLiked ? item.like_count - 1 : item.like_count + 1,
              }
            : item
        )
      )
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = async (galleryId: string, platform: string) => {
    try {
      // 记录分享
      if (user) {
        await supabase.from('gallery_shares').insert({
          gallery_id: galleryId,
          user_id: user.id,
          platform,
        })
      }

      // 执行分享操作
      const item = galleryItems.find(item => item.id === galleryId)
      if (!item) return

      const shareUrl = `${window.location.origin}/gallery/${galleryId}`
      const shareText = `${item.title} - 在 Och AI 上创作的作品`

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
          )
          break
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
          )
          break
        case 'copy_link':
          navigator.clipboard.writeText(shareUrl)
          // 可以显示一个提示
          break
      }

      // 更新分享数
      setGalleryItems(prev =>
        prev.map(item =>
          item.id === galleryId ? { ...item, share_count: item.share_count + 1 } : item
        )
      )
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchGalleryItems(nextPage, false)
    }
  }

  return (
    <div className='gallery-wall'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {galleryItems.map(item => (
          <GalleryCard key={item.id} item={item} onLike={handleLike} onShare={handleShare} />
        ))}
      </div>

      {loading && (
        <div className='flex justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
        </div>
      )}

      {hasMore && !loading && (
        <div className='flex justify-center py-8'>
          <button
            onClick={loadMore}
            className='px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity'
          >
            {t('social.loadMore')}
          </button>
        </div>
      )}

      {!hasMore && galleryItems.length > 0 && (
        <div className='text-center py-8 text-[var(--text-secondary)]'>
          {t('social.noMoreItems')}
        </div>
      )}
    </div>
  )
}

interface GalleryCardProps {
  item: GalleryItem
  onLike: (galleryId: string, isLiked: boolean) => void
  onShare: (galleryId: string, platform: string) => void
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, onLike, onShare }) => {
  const [showComments, setShowComments] = useState(false)

  return (
    <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:shadow-lg transition-shadow'>
      {/* 图片 */}
      <div className='aspect-square relative group'>
        <img src={item.image_url} alt={item.title} className='w-full h-full object-cover' />

        {/* 悬停操作 */}
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100'>
          <div className='flex gap-2'>
            <button
              onClick={() => onLike(item.id, item.user_liked)}
              className={`p-2 rounded-full ${
                item.user_liked ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 text-gray-700'
              }`}
            >
              ❤️
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className='p-2 rounded-full bg-white bg-opacity-80 text-gray-700'
            >
              💬
            </button>
            <button
              onClick={() => onShare(item.id, 'copy_link')}
              className='p-2 rounded-full bg-white bg-opacity-80 text-gray-700'
            >
              📤
            </button>
          </div>
        </div>
      </div>

      {/* 内容信息 */}
      <div className='p-4'>
        <div className='flex items-center gap-3 mb-3'>
          <img
            src={item.user_info.avatar_url || '/default-avatar.png'}
            alt={item.user_info.display_name}
            className='w-8 h-8 rounded-full'
          />
          <div>
            <p className='font-medium text-[var(--text-primary)]'>{item.user_info.display_name}</p>
            <p className='text-sm text-[var(--text-secondary)]'>@{item.user_info.username}</p>
          </div>
        </div>

        <h3 className='font-semibold text-[var(--text-primary)] mb-2'>{item.title}</h3>

        {item.description && (
          <p className='text-sm text-[var(--text-secondary)] mb-3'>{item.description}</p>
        )}

        {/* 统计信息 */}
        <div className='flex items-center justify-between text-sm text-[var(--text-secondary)]'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1'>❤️ {item.like_count}</span>
            <span className='flex items-center gap-1'>💬 {item.comment_count}</span>
            <span className='flex items-center gap-1'>📤 {item.share_count}</span>
          </div>
          <span className='text-xs'>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
