import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
// import { useTranslation } from '../../../i18n/context';
import { DataPersistenceService } from '../../services/dataPersistence'

interface UserStatsData {
  totalGenerations: number
  thisMonthGenerations: number
  thisWeekGenerations: number
  todayGenerations: number
  favoriteTransformation: string
  lastGeneration: string | null
}

export const UserStats: React.FC = () => {
  const { user } = useAuth()
  // const { t } = useTranslation();
  const [stats, setStats] = useState<UserStatsData>({
    totalGenerations: 0,
    thisMonthGenerations: 0,
    thisWeekGenerations: 0,
    todayGenerations: 0,
    favoriteTransformation: '',
    lastGeneration: null,
  })
  const [loading, setLoading] = useState(true)

  const fetchUserStats = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      // 使用数据持久化服务获取统计数据
      const usageStats = await DataPersistenceService.getUserUsageStats(user.id)

      // 获取最常用的变换类型
      const { data: transformationData, error: transformationError } = await supabase
        .from('ai_generations')
        .select('transformation_type')
        .eq('user_id', user.id)

      if (transformationError) {
        console.error('Error fetching transformation data:', transformationError)
      }

      const transformationCounts =
        transformationData && transformationData.length > 0
          ? transformationData.reduce((acc: any, item) => {
              acc[item.transformation_type] = (acc[item.transformation_type] || 0) + 1
              return acc
            }, {})
          : {}

      const favoriteTransformation =
        transformationCounts && Object.keys(transformationCounts).length > 0
          ? Object.keys(transformationCounts).reduce((a, b) =>
              transformationCounts[a] > transformationCounts[b] ? a : b
            )
          : ''

      // 获取最后一次生成时间
      const { data: lastGenerationData, error: lastGenerationError } = await supabase
        .from('ai_generations')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (lastGenerationError && lastGenerationError.code !== 'PGRST116') {
        console.error('Error fetching last generation data:', lastGenerationError)
      }

      setStats({
        totalGenerations: usageStats.totalGenerations,
        thisMonthGenerations: usageStats.thisMonthGenerations,
        thisWeekGenerations: usageStats.thisWeekGenerations,
        todayGenerations: usageStats.todayGenerations,
        favoriteTransformation,
        lastGeneration: lastGenerationData?.created_at || null,
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
      // 设置默认值，避免一直加载
      setStats({
        totalGenerations: 0,
        thisMonthGenerations: 0,
        thisWeekGenerations: 0,
        todayGenerations: 0,
        favoriteTransformation: '',
        lastGeneration: null,
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user, fetchUserStats])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className='p-4 text-center'>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-primary)] mx-auto'></div>
        <p className='text-[var(--text-secondary)] mt-2 text-sm'>加载中...</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>使用统计</h3>

      {/* 统计卡片 */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='bg-[var(--bg-secondary)] rounded-lg p-3'>
          <div className='text-xs text-[var(--text-secondary)]'>总生成次数</div>
          <div className='text-lg font-bold text-[var(--text-primary)]'>
            {stats.totalGenerations}
          </div>
        </div>

        <div className='bg-[var(--bg-secondary)] rounded-lg p-3'>
          <div className='text-xs text-[var(--text-secondary)]'>本月生成</div>
          <div className='text-lg font-bold text-[var(--text-primary)]'>
            {stats.thisMonthGenerations}
          </div>
        </div>

        <div className='bg-[var(--bg-secondary)] rounded-lg p-3'>
          <div className='text-xs text-[var(--text-secondary)]'>本周生成</div>
          <div className='text-lg font-bold text-[var(--text-primary)]'>
            {stats.thisWeekGenerations}
          </div>
        </div>

        <div className='bg-[var(--bg-secondary)] rounded-lg p-3'>
          <div className='text-xs text-[var(--text-secondary)]'>今日生成</div>
          <div className='text-lg font-bold text-[var(--text-primary)]'>
            {stats.todayGenerations}
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className='space-y-3'>
        {stats.favoriteTransformation && (
          <div className='flex justify-between items-center text-sm'>
            <span className='text-[var(--text-secondary)]'>最常用功能:</span>
            <span className='text-[var(--text-primary)] font-medium'>
              {stats.favoriteTransformation}
            </span>
          </div>
        )}

        {stats.lastGeneration && (
          <div className='flex justify-between items-center text-sm'>
            <span className='text-[var(--text-secondary)]'>最后生成:</span>
            <span className='text-[var(--text-primary)] font-medium'>
              {formatDate(stats.lastGeneration)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
