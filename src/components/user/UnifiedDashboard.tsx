import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../../i18n/context'
import { supabase } from '../../lib/supabase'

interface UnifiedStats {
  // 基础统计
  totalGenerations: number
  totalFavorites: number
  thisWeekGenerations: number
  thisMonthGenerations: number
  todayGenerations: number

  // 功能使用
  mostUsedFeature: string
  featureUsage: Record<string, number>

  // 时间统计
  lastGeneration: string | null
  averageGenerationsPerDay: number

  // 社交统计
  publicWorks: number
  totalLikes: number
  totalComments: number
}

interface RecentActivity {
  id: string
  transformation_type: string
  created_at: string
  content_url?: string
  title?: string
}

// 缓存统计数据
const statsCache = new Map<string, { data: UnifiedStats; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

export const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [stats, setStats] = useState<UnifiedStats>({
    totalGenerations: 0,
    totalFavorites: 0,
    thisWeekGenerations: 0,
    thisMonthGenerations: 0,
    todayGenerations: 0,
    mostUsedFeature: '',
    featureUsage: {},
    lastGeneration: null,
    averageGenerationsPerDay: 0,
    publicWorks: 0,
    totalLikes: 0,
    totalComments: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'social'>('overview')

  // 获取综合统计数据
  const fetchUnifiedStats = useCallback(async () => {
    if (!user) return

    // 检查缓存
    const cacheKey = `stats_${user.id}`
    const cached = statsCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setStats(cached.data)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // 测试数据库连接
      console.log('🔍 Testing database connection for user:', user.id)

      // 基础生成统计
      const { count: totalGen, error: totalGenError } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (totalGenError) {
        console.error('❌ Error fetching total generations:', totalGenError)
        console.error('Error details:', {
          code: totalGenError.code,
          message: totalGenError.message,
          details: totalGenError.details,
          hint: totalGenError.hint,
        })

        // 如果表不存在或权限问题，使用默认值
        if (
          totalGenError.code === 'PGRST116' ||
          totalGenError.message.includes('relation') ||
          totalGenError.message.includes('does not exist') ||
          totalGenError.code === 'PGRST301'
        ) {
          console.warn(
            '⚠️ ai_generations table may not exist or no permission, using default values'
          )
        }
      } else {
        console.log('✅ Successfully fetched total generations:', totalGen)
      }

      // 收藏统计
      const { count: totalFav } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // 时间范围统计
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const [todayResult, weekResult, monthResult] = await Promise.all([
        supabase
          .from('ai_generations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString()),
        supabase
          .from('ai_generations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString()),
        supabase
          .from('ai_generations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', monthAgo.toISOString()),
      ])

      // 功能使用统计
      const { data: featureData } = await supabase
        .from('ai_generations')
        .select('transformation_type')
        .eq('user_id', user.id)

      const featureUsage =
        featureData?.reduce(
          (acc, item) => {
            acc[item.transformation_type] = (acc[item.transformation_type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ) || {}

      const mostUsedFeature = Object.entries(featureUsage).reduce(
        (a, b) => (featureUsage[a[0]] > featureUsage[b[0]] ? a : b),
        ['', 0]
      )[0]

      // 最后一次生成
      const { data: lastGen } = await supabase
        .from('ai_generations')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // 社交统计
      const [publicWorksResult, likesResult, commentsResult] = await Promise.all([
        supabase
          .from('public_gallery')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('gallery_likes')
          .select('gallery_id')
          .in(
            'gallery_id',
            await supabase
              .from('public_gallery')
              .select('id')
              .eq('user_id', user.id)
              .then(res => res.data?.map(item => item.id) || [])
          ),
        supabase
          .from('gallery_comments')
          .select('gallery_id')
          .in(
            'gallery_id',
            await supabase
              .from('public_gallery')
              .select('id')
              .eq('user_id', user.id)
              .then(res => res.data?.map(item => item.id) || [])
          ),
      ])

      // 计算平均每日生成数
      const daysSinceFirst = user.created_at
        ? Math.max(
            1,
            Math.ceil((Date.now() - new Date(user.created_at).getTime()) / (24 * 60 * 60 * 1000))
          )
        : 1

      const newStats = {
        totalGenerations: totalGen || 0,
        totalFavorites: totalFav || 0,
        thisWeekGenerations: weekResult.count || 0,
        thisMonthGenerations: monthResult.count || 0,
        todayGenerations: todayResult.count || 0,
        mostUsedFeature,
        featureUsage,
        lastGeneration: lastGen?.created_at || null,
        averageGenerationsPerDay: Math.round(((totalGen || 0) / daysSinceFirst) * 10) / 10,
        publicWorks: publicWorksResult.count || 0,
        totalLikes: likesResult.count || 0,
        totalComments: commentsResult.count || 0,
      }

      setStats(newStats)

      // 缓存数据
      statsCache.set(cacheKey, { data: newStats, timestamp: Date.now() })

      // 获取最近活动
      const { data: recentData } = await supabase
        .from('ai_generations')
        .select('id, transformation_type, created_at, content_url, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentActivity(recentData || [])
    } catch (error) {
      console.error('Error fetching unified stats:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchUnifiedStats()
  }, [fetchUnifiedStats])

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  return (
    <div className='unified-dashboard'>
      {/* 视图切换 */}
      <div className='flex gap-2 mb-6'>
        <button
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'overview'
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('app.profile.dashboard.overview')}
        </button>
        <button
          onClick={() => setActiveView('detailed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'detailed'
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('app.profile.dashboard.detailed')}
        </button>
        <button
          onClick={() => setActiveView('social')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'social'
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('app.profile.dashboard.social')}
        </button>
      </div>

      {/* 概览视图 */}
      {activeView === 'overview' && (
        <div className='space-y-6'>
          {/* 关键指标卡片 */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-2xl font-bold text-[var(--accent-primary)]'>
                {stats.totalGenerations}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.totalGenerations')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-2xl font-bold text-[var(--accent-primary)]'>
                {stats.thisWeekGenerations}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.thisWeek')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-2xl font-bold text-[var(--accent-primary)]'>
                {stats.totalFavorites}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.favorites')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-2xl font-bold text-[var(--accent-primary)]'>
                {stats.publicWorks}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.publicWorks')}
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
              {t('app.profile.dashboard.quickActions.title')}
            </h3>
            <div className='flex gap-4'>
              <button className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity'>
                {t('app.profile.dashboard.quickActions.createNew')}
              </button>
              <button className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:opacity-90 transition-opacity'>
                {t('app.profile.dashboard.quickActions.shareWork')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详细视图 */}
      {activeView === 'detailed' && (
        <div className='space-y-6'>
          {/* 时间统计 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-xl font-bold text-[var(--text-primary)]'>
                {stats.todayGenerations}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.today')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-xl font-bold text-[var(--text-primary)]'>
                {stats.thisMonthGenerations}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.thisMonth')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-xl font-bold text-[var(--text-primary)]'>
                {stats.averageGenerationsPerDay}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.dailyAverage')}
              </div>
            </div>
          </div>

          {/* 功能使用统计 */}
          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
              {t('app.profile.dashboard.featureUsage.title')}
            </h3>
            <div className='space-y-2'>
              {Object.entries(stats.featureUsage)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([feature, count]) => (
                  <div key={feature} className='flex justify-between items-center'>
                    <span className='text-[var(--text-primary)]'>{feature}</span>
                    <span className='text-[var(--text-secondary)]'>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 社交视图 */}
      {activeView === 'social' && (
        <div className='space-y-6'>
          {/* 社交统计 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-xl font-bold text-[var(--accent-primary)]'>
                {stats.publicWorks}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.publicWorks')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-xl font-bold text-[var(--accent-primary)]'>
                {stats.totalLikes}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.totalLikes')}
              </div>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-primary)]'>
              <div className='text-xl font-bold text-[var(--accent-primary)]'>
                {stats.totalComments}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                {t('app.profile.dashboard.stats.totalComments')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 最近活动 */}
      <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
          {t('app.profile.dashboard.stats.recentActivity')}
        </h3>
        {recentActivity.length > 0 ? (
          <div className='space-y-3'>
            {recentActivity.map(activity => (
              <div
                key={activity.id}
                className='flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg'
              >
                <div className='w-10 h-10 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center text-white font-bold'>
                  {activity.transformation_type.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-[var(--text-primary)]'>
                    {activity.title || activity.transformation_type}
                  </div>
                  <div className='text-sm text-[var(--text-secondary)]'>
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-[var(--text-secondary)]'>
            {t('app.profile.dashboard.noActivity')}
          </div>
        )}
      </div>
    </div>
  )
}
