import React, { useState, useEffect, useCallback } from 'react'
// import { useTranslation } from '../../../i18n/context';
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { AvatarUpload } from './AvatarUpload'
import { ShareManager } from './ShareManager'

interface DashboardStats {
  totalGenerations: number
  totalFavorites: number
  thisWeekGenerations: number
  mostUsedFeature: string
}

interface RecentActivity {
  id: string
  type: 'generation' | 'favorite' | 'share'
  title: string
  timestamp: string
  content_url?: string
}

export const DashboardLayout: React.FC = () => {
  // const { t } = useTranslation();
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalGenerations: 0,
    totalFavorites: 0,
    thisWeekGenerations: 0,
    mostUsedFeature: '',
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    if (!user) return

    try {
      // 获取总生成数
      const { count: totalGen } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // 获取收藏数
      const { count: totalFav } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // 获取本周生成数
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { count: weekGen } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())

      // 获取最常用功能
      const { data: featureData } = await supabase
        .from('ai_generations')
        .select('transformation_type')
        .eq('user_id', user.id)

      const featureCounts =
        featureData?.reduce(
          (acc, item) => {
            acc[item.transformation_type] = (acc[item.transformation_type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ) || {}

      const mostUsed = Object.entries(featureCounts).reduce(
        (a, b) => (featureCounts[a[0]] > featureCounts[b[0]] ? a : b),
        ['', 0]
      )[0]

      setStats({
        totalGenerations: totalGen || 0,
        totalFavorites: totalFav || 0,
        thisWeekGenerations: weekGen || 0,
        mostUsedFeature: mostUsed,
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [user])

  // 获取最近活动
  const fetchRecentActivity = useCallback(async () => {
    if (!user) return

    try {
      // 获取最近的生成记录
      const { data: generations } = await supabase
        .from('ai_generations')
        .select('id, title, created_at, content_url, transformation_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // 获取最近的收藏记录
      const { data: favorites } = await supabase
        .from('user_favorites')
        .select('id, title, created_at, content_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      const activities: RecentActivity[] = [
        ...(generations?.map(gen => ({
          id: gen.id,
          type: 'generation' as const,
          title: gen.title,
          timestamp: gen.created_at,
          content_url: gen.content_url,
        })) || []),
        ...(favorites?.map(fav => ({
          id: fav.id,
          type: 'favorite' as const,
          title: fav.title,
          timestamp: fav.created_at,
          content_url: fav.content_url,
        })) || []),
      ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8)

      setRecentActivity(activities)
    } catch (err) {
      console.error('Error fetching recent activity:', err)
    }
  }, [user])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchStats(), fetchRecentActivity()])
      setLoading(false)
    }
    loadData()
  }, [fetchStats, fetchRecentActivity])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 用户信息卡片 */}
      <div className='bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl p-6 text-white'>
        <div className='flex items-center space-x-4'>
          <AvatarUpload size='lg' />
          <div className='flex-1'>
            <h2 className='text-2xl font-bold mb-1'>
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '用户'}
            </h2>
            <p className='text-white/80 mb-4'>{user?.email}</p>
            <div className='flex space-x-4 text-sm'>
              <span>🎨 创作者</span>
              <span>⭐ 活跃用户</span>
              <span>🚀 AI爱好者</span>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[var(--text-secondary)] mb-1'>总生成数</p>
              <p className='text-2xl font-bold text-[var(--text-primary)]'>
                {stats.totalGenerations}
              </p>
            </div>
            <div className='text-3xl'>🎨</div>
          </div>
        </div>

        <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[var(--text-secondary)] mb-1'>收藏数</p>
              <p className='text-2xl font-bold text-[var(--text-primary)]'>
                {stats.totalFavorites}
              </p>
            </div>
            <div className='text-3xl'>⭐</div>
          </div>
        </div>

        <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[var(--text-secondary)] mb-1'>本周生成</p>
              <p className='text-2xl font-bold text-[var(--text-primary)]'>
                {stats.thisWeekGenerations}
              </p>
            </div>
            <div className='text-3xl'>📈</div>
          </div>
        </div>

        <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[var(--text-secondary)] mb-1'>最常用功能</p>
              <p className='text-lg font-bold text-[var(--text-primary)] truncate'>
                {stats.mostUsedFeature || '暂无'}
              </p>
            </div>
            <div className='text-3xl'>🔥</div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 最近活动 */}
        <div className='lg:col-span-2'>
          <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>最近活动</h3>
            {recentActivity.length === 0 ? (
              <div className='text-center py-8'>
                <div className='text-4xl mb-2'>📝</div>
                <p className='text-[var(--text-secondary)]'>暂无活动记录</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className='flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors duration-200'
                  >
                    <div className='text-2xl'>
                      {activity.type === 'generation'
                        ? '🎨'
                        : activity.type === 'favorite'
                          ? '⭐'
                          : '🔗'}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
                        {activity.title}
                      </p>
                      <p className='text-xs text-[var(--text-secondary)]'>
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.content_url && (
                      <div className='w-8 h-8 rounded overflow-hidden bg-[var(--bg-secondary)]'>
                        <img
                          src={activity.content_url}
                          alt=''
                          className='w-full h-full object-cover'
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <div className='space-y-6'>
          {/* 快速分享 */}
          <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>快速分享</h3>
            <ShareManager />
          </div>

          {/* 成就徽章 */}
          <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>成就徽章</h3>
            <div className='grid grid-cols-2 gap-3'>
              <div className='text-center p-3 bg-[var(--bg-secondary)] rounded-lg'>
                <div className='text-2xl mb-1'>🎯</div>
                <div className='text-xs text-[var(--text-secondary)]'>首次生成</div>
              </div>
              <div className='text-center p-3 bg-[var(--bg-secondary)] rounded-lg'>
                <div className='text-2xl mb-1'>🔥</div>
                <div className='text-xs text-[var(--text-secondary)]'>连续创作</div>
              </div>
              <div className='text-center p-3 bg-[var(--bg-secondary)] rounded-lg'>
                <div className='text-2xl mb-1'>⭐</div>
                <div className='text-xs text-[var(--text-secondary)]'>收藏达人</div>
              </div>
              <div className='text-center p-3 bg-[var(--bg-secondary)] rounded-lg'>
                <div className='text-2xl mb-1'>🚀</div>
                <div className='text-xs text-[var(--text-secondary)]'>分享专家</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
