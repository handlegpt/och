import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
// import { useTranslation } from '../../../i18n/context';
import { SkeletonLoader } from '../ui/SkeletonLoader'

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

  useEffect(() => {
    if (user) {
      const fetchUserStats = async () => {
        try {
          setLoading(true)

          // 获取总生成数
          const { count: totalGenerations } = await supabase
            .from('ai_generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

          // 获取本周生成数
          const weekStart = new Date()
          weekStart.setDate(weekStart.getDate() - weekStart.getDay())
          weekStart.setHours(0, 0, 0, 0)
          const { count: thisWeekGenerations } = await supabase
            .from('ai_generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', weekStart.toISOString())

          // 获取收藏数
          const { count: totalFavorites } = await supabase
            .from('user_favorites')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

          // 获取最近生成
          const { data: recentGeneration } = await supabase
            .from('ai_generations')
            .select('created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          setStats({
            totalGenerations: totalGenerations || 0,
            thisWeekGenerations: thisWeekGenerations || 0,
            totalFavorites: totalFavorites || 0,
            lastGeneration: recentGeneration?.created_at || null,
          })
        } catch (error) {
          console.error('Error fetching user stats:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchUserStats()
    }
  }, [user])

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
      <div className='space-y-4'>
        <SkeletonLoader variant='text' width={120} height={20} />

        {/* 统计卡片骨架屏 */}
        <div className='grid grid-cols-2 gap-3'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='bg-[var(--bg-secondary)] rounded-lg p-3 space-y-2'>
              <SkeletonLoader variant='text' width='60%' height={12} />
              <SkeletonLoader variant='text' width='40%' height={18} />
            </div>
          ))}
        </div>

        {/* 详细信息骨架屏 */}
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <SkeletonLoader variant='text' width={80} height={14} />
            <SkeletonLoader variant='text' width={60} height={14} />
          </div>
          <div className='flex justify-between items-center'>
            <SkeletonLoader variant='text' width={80} height={14} />
            <SkeletonLoader variant='text' width={100} height={14} />
          </div>
        </div>
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
