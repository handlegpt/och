import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '../../../i18n/context'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { LazyImage, LazyVideo } from '../ui/LazyImage'

interface FavoriteItem {
  id: string
  user_id: string
  content_type: 'image' | 'video'
  content_url: string
  title: string
  description?: string
  created_at: string
  transformation_key: string
}

export const FavoritesManager: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')

  // 获取收藏列表
  const fetchFavorites = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFavorites(data || [])
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError('获取收藏列表失败')
    } finally {
      setLoading(false)
    }
  }, [user])

  // 添加收藏
  // const addToFavorites = useCallback(async (item: Omit<FavoriteItem, 'id' | 'user_id' | 'created_at'>) => {
  //   if (!user) return;

  //   try {
  //     const { data, error } = await supabase
  //       .from('user_favorites')
  //       .insert([{
  //         ...item,
  //         user_id: user.id
  //       }])
  //       .select()
  //       .single();

  //     if (error) throw error;
  //     setFavorites(prev => [data, ...prev]);
  //   } catch (err) {
  //     console.error('Error adding to favorites:', err);
  //     setError('添加收藏失败');
  //   }
  // }, [user]);

  // 移除收藏
  const removeFromFavorites = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('user_favorites').delete().eq('id', id)

      if (error) throw error
      setFavorites(prev => prev.filter(item => item.id !== id))
    } catch (_err) {
      console.error('Error removing from favorites:', _err)
      setError('移除收藏失败')
    }
  }, [])

  // 下载内容
  const downloadContent = useCallback(async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (_err) {
      console.error('Error downloading content:', _err)
      setError('下载失败')
    }
  }, [])

  // 分享内容
  const shareContent = useCallback(async (item: FavoriteItem) => {
    const shareData = {
      title: item.title,
      text: item.description || '查看我的AI生成作品',
      url: item.content_url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        console.log('Share cancelled')
      }
    } else {
      // 降级到复制链接
      try {
        await navigator.clipboard.writeText(item.content_url)
        alert('链接已复制到剪贴板')
      } catch (_err) {
        console.error('Error copying to clipboard:', _err)
      }
    }
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('user_favorites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching favorites:', error)
          return
        }

        setFavorites(data || [])
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const filteredFavorites = favorites.filter(
    item => filter === 'all' || item.content_type === filter
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-red-500 mb-4'>{error}</div>
        <button
          onClick={fetchFavorites}
          className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 标题和统计 */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
            {t('app.profile.favorites.title')}
          </h3>
          <p className='text-sm text-[var(--text-secondary)]'>
            {t('app.profile.favorites.count', { count: favorites.length })}
          </p>
        </div>
      </div>

      {/* 筛选器 */}
      <div className='flex space-x-2'>
        {(['all', 'image', 'video'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filter === type
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {type === 'all'
              ? t('common.all')
              : type === 'image'
                ? t('common.image')
                : t('common.video')}
          </button>
        ))}
      </div>

      {/* 收藏列表 */}
      {filteredFavorites.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>⭐</div>
          <h4 className='text-lg font-medium text-[var(--text-primary)] mb-2'>
            {t('common.noFavorites')}
          </h4>
          <p className='text-[var(--text-secondary)]'>{t('common.startCreating')}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredFavorites.map(item => (
            <div
              key={item.id}
              className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:shadow-lg transition-shadow duration-200'
            >
              {/* 内容预览 */}
              <div className='aspect-square bg-[var(--bg-secondary)] flex items-center justify-center'>
                {item.content_type === 'image' ? (
                  <LazyImage
                    src={item.content_url}
                    alt={item.title}
                    className='w-full h-full object-cover'
                    threshold={0.1}
                    rootMargin='100px'
                  />
                ) : (
                  <LazyVideo
                    src={item.content_url}
                    className='w-full h-full object-cover'
                    threshold={0.1}
                    rootMargin='100px'
                  />
                )}
              </div>

              {/* 内容信息 */}
              <div className='p-4'>
                <h4 className='font-medium text-[var(--text-primary)] mb-1 truncate'>
                  {item.title}
                </h4>
                {item.description && (
                  <p className='text-sm text-[var(--text-secondary)] mb-3 line-clamp-2'>
                    {item.description}
                  </p>
                )}
                <div className='text-xs text-[var(--text-secondary)] mb-4'>
                  {new Date(item.created_at).toLocaleDateString()}
                </div>

                {/* 操作按钮 */}
                <div className='flex space-x-2'>
                  <button
                    onClick={() =>
                      downloadContent(
                        item.content_url,
                        `${item.title}.${item.content_type === 'image' ? 'png' : 'mp4'}`
                      )
                    }
                    className='flex-1 px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors duration-200 text-sm'
                  >
                    📥 下载
                  </button>
                  <button
                    onClick={() => shareContent(item)}
                    className='flex-1 px-3 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200 text-sm'
                  >
                    🔗 分享
                  </button>
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className='px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm'
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
