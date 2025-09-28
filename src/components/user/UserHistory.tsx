import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
// import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../../i18n/context'
import { DataPersistenceService } from '../../services/dataPersistence'
import ImagePreviewModal from '../../../components/ImagePreviewModal'
import { SkeletonLoader } from '../ui/SkeletonLoader'
import { LazyImage } from '../ui/LazyImage'

interface GenerationHistory {
  id?: string
  transformation_type: string
  input_image_url: string | null
  output_image_url: string | null
  prompt: string | null
  custom_prompt: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at?: string
}

export const UserHistory: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [history, setHistory] = useState<GenerationHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showBatchActions, setShowBatchActions] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const fetchUserHistory = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      // 使用数据持久化服务获取历史记录
      const historyData = await DataPersistenceService.getUserGenerationHistory(user.id, 20, 0)

      // 如果选择了特定类型，进行过滤
      const filteredHistory =
        selectedType === 'all'
          ? historyData
          : historyData.filter(item => item.transformation_type === selectedType)

      setHistory(filteredHistory)
    } catch (error) {
      console.error('Error fetching user history:', error)
      // 设置空数组，避免一直加载
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [user, selectedType])

  useEffect(() => {
    if (user) {
      fetchUserHistory()
    }
  }, [user, selectedType, fetchUserHistory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'processing':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      case 'pending':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'processing':
        return 'Processing'
      case 'failed':
        return 'Failed'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  const transformationTypes = [
    { value: 'all', label: 'All' },
    { value: 'pose', label: 'Pose Transform' },
    { value: 'style', label: 'Style Transform' },
    { value: 'background', label: 'Background Transform' },
    { value: 'face', label: 'Face Transform' },
    { value: 'custom', label: 'Custom' },
  ]

  // 批量操作功能
  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
    setShowBatchActions(newSelected.size > 0)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === history.length) {
      setSelectedItems(new Set())
      setShowBatchActions(false)
    } else {
      setSelectedItems(new Set(history.map(item => item.id || '').filter(id => id)))
      setShowBatchActions(true)
    }
  }

  const handleBatchDelete = async () => {
    if (!user || selectedItems.size === 0) return

    try {
      const deletePromises = Array.from(selectedItems).map(itemId =>
        DataPersistenceService.deleteGenerationRecord(itemId, user.id)
      )

      await Promise.all(deletePromises)
      setSelectedItems(new Set())
      setShowBatchActions(false)
      fetchUserHistory() // 刷新列表
    } catch (error) {
      console.error('Error deleting items:', error)
    }
  }

  const handleBatchDownload = () => {
    selectedItems.forEach(itemId => {
      const item = history.find(h => h.id === itemId)
      if (item?.output_image_url && item.id) {
        const link = document.createElement('a')
        link.href = item.output_image_url
        link.download = `och-ai-${item.transformation_type}-${item.id}.png`
        link.click()
      }
    })
  }

  const handleImageClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl)
  }

  const handleClosePreview = () => {
    setPreviewImageUrl(null)
  }

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    link.click()
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        {/* 标题骨架屏 */}
        <div className='flex justify-between items-center'>
          <SkeletonLoader variant='text' width={120} height={20} />
          <SkeletonLoader variant='rectangular' width={120} height={32} />
        </div>

        {/* 历史记录骨架屏 */}
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className='bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border-primary)]'
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <SkeletonLoader variant='rectangular' width={16} height={16} />
                  <SkeletonLoader variant='text' width={80} height={14} />
                  <SkeletonLoader variant='text' width={40} height={12} />
                </div>
                <div className='flex items-center gap-2'>
                  <SkeletonLoader variant='text' width={60} height={12} />
                  <div className='flex items-center gap-1'>
                    <SkeletonLoader variant='circular' width={24} height={24} />
                    <SkeletonLoader variant='circular' width={24} height={24} />
                  </div>
                </div>
              </div>

              <SkeletonLoader variant='text' width='90%' height={12} className='mb-2' />

              <div className='flex gap-3'>
                <SkeletonLoader variant='rounded' width={64} height={64} />
                <SkeletonLoader variant='rounded' width={64} height={64} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
          {t('app.profile.history.title')}
        </h3>
        <div className='flex items-center gap-2'>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className='px-3 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
          >
            {transformationTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 批量操作工具栏 */}
      {showBatchActions && (
        <div className='bg-[var(--accent-primary)] bg-opacity-10 border border-[var(--accent-primary)] border-opacity-30 rounded-lg p-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-[var(--accent-primary)] font-medium'>
              {selectedItems.size} items selected
            </span>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleBatchDownload}
                className='px-3 py-1 text-xs bg-[var(--accent-primary)] text-white rounded-md hover:bg-[var(--accent-primary-hover)] transition-colors'
              >
                Batch Download
              </button>
              <button
                onClick={handleBatchDelete}
                className='px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
              >
                Batch Delete
              </button>
              <button
                onClick={() => {
                  setSelectedItems(new Set())
                  setShowBatchActions(false)
                }}
                className='px-3 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
              >
                Cancel Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className='text-center py-8'>
          <div className='text-4xl mb-2'>🎨</div>
          <p className='text-[var(--text-secondary)]'>No generation history yet</p>
          <p className='text-sm text-[var(--text-tertiary)]'>Start creating your first image!</p>
        </div>
      ) : (
        <div className='space-y-3 max-h-96 overflow-y-auto'>
          {/* 全选按钮 */}
          {history.length > 0 && (
            <div className='flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]'>
              <input
                type='checkbox'
                checked={selectedItems.size === history.length}
                onChange={handleSelectAll}
                className='w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]'
              />
              <span className='text-sm text-[var(--text-secondary)]'>
                {selectedItems.size === history.length
                  ? t('common.deselectAll')
                  : t('common.selectAll')}
              </span>
            </div>
          )}

          {history.map((item, index) => (
            <div
              key={item.id || `item-${index}`}
              className={`bg-[var(--bg-secondary)] rounded-lg p-3 border transition-colors ${
                item.id && selectedItems.has(item.id)
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                  : 'border-[var(--border-primary)]'
              }`}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={item.id ? selectedItems.has(item.id) : false}
                    onChange={() => item.id && handleSelectItem(item.id)}
                    className='w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]'
                  />
                  <span className='text-sm font-medium text-[var(--text-primary)]'>
                    {item.transformation_type}
                  </span>
                  <span className={`text-xs ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-[var(--text-tertiary)]'>
                    {item.created_at ? formatDate(item.created_at) : 'Unknown time'}
                  </span>
                  <div className='flex items-center gap-1'>
                    {item.output_image_url && (
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = item.output_image_url || ''
                          link.download = `och-ai-${item.transformation_type}-${item.id || 'unknown'}.png`
                          link.click()
                        }}
                        className='p-1 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                        title='Download'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (item.id && confirm('Are you sure you want to delete this record?')) {
                          DataPersistenceService.deleteGenerationRecord(
                            item.id,
                            user?.id || ''
                          ).then(() => {
                            fetchUserHistory()
                          })
                        }
                      }}
                      className='p-1 text-[var(--text-secondary)] hover:text-red-500 transition-colors'
                      title='Delete'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {(item.prompt || item.custom_prompt) && (
                <p className='text-xs text-[var(--text-secondary)] mb-2 line-clamp-2'>
                  {item.custom_prompt || item.prompt}
                </p>
              )}

              <div className='flex gap-3'>
                {item.input_image_url && (
                  <div className='relative group'>
                    <div
                      className='w-16 h-16 rounded-lg overflow-hidden bg-[var(--bg-primary)] cursor-pointer border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-colors'
                      onClick={() => handleImageClick(item.input_image_url || '')}
                    >
                      <LazyImage
                        src={item.input_image_url || ''}
                        alt='Input'
                        className='w-full h-full object-cover'
                        threshold={0.1}
                        rootMargin='50px'
                      />
                    </div>
                    <div className='absolute -top-1 -right-1 bg-[var(--accent-primary)] text-white text-xs px-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      Original
                    </div>
                    <div className='absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDownloadImage(
                            item.input_image_url || '',
                            `input-${item.id || 'unknown'}.png`
                          )
                        }}
                        className='hover:text-[var(--accent-primary)]'
                        title='Download Original'
                      >
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {item.output_image_url && (
                  <div className='relative group'>
                    <div
                      className='w-16 h-16 rounded-lg overflow-hidden bg-[var(--bg-primary)] cursor-pointer border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-colors'
                      onClick={() => handleImageClick(item.output_image_url || '')}
                    >
                      <LazyImage
                        src={item.output_image_url}
                        alt='Output'
                        className='w-full h-full object-cover'
                        threshold={0.1}
                        rootMargin='50px'
                      />
                    </div>
                    <div className='absolute -top-1 -right-1 bg-[var(--accent-secondary)] text-white text-xs px-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      Generated
                    </div>
                    <div className='absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDownloadImage(
                            item.output_image_url || '',
                            `och-ai-${item.transformation_type}-${item.id || 'unknown'}.png`
                          )
                        }}
                        className='hover:text-[var(--accent-primary)]'
                        title='Download Generated'
                      >
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 图像预览模态框 */}
      <ImagePreviewModal imageUrl={previewImageUrl} onClose={handleClosePreview} />
    </div>
  )
}
