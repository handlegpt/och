/**
 * 监控仪表板组件
 * 显示系统性能指标、错误统计、用户活动等
 */

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalGenerations: number
  todayGenerations: number
  errorRate: number
  avgResponseTime: number
  costToday: number
  costThisMonth: number
}

interface PerformanceStats {
  avgGenerationTime: number
  slowestOperations: Array<{
    operation: string
    avgTime: number
    count: number
  }>
  databasePerformance: {
    avgQueryTime: number
    slowQueries: number
  }
}

export const MonitoringDashboard: React.FC = () => {
  const { isAdmin } = useAuth()
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  // 检查管理员权限
  const isAuthorized = isAdmin

  const fetchSystemStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取用户统计
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: activeUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      // 获取生成统计
      const { count: totalGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })

      const { count: todayGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0])

      // 获取成本统计
      const { data: costData } = await supabase
        .from('system_cost_stats')
        .select('total_daily_cost, total_monthly_cost')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      setSystemStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalGenerations: totalGenerations || 0,
        todayGenerations: todayGenerations || 0,
        errorRate: 0, // 需要从Sentry获取
        avgResponseTime: 0, // 需要从性能监控获取
        costToday: costData?.total_daily_cost || 0,
        costThisMonth: costData?.total_monthly_cost || 0,
      })
    } catch (err) {
      console.error('Error fetching system stats:', err)
      setError('获取系统统计失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchErrorStats = async () => {
    try {
      // 这里应该从Sentry API获取错误统计
      // 由于Sentry API需要特殊配置，这里使用模拟数据
      console.log('Fetching error stats...')
    } catch (err) {
      console.error('Error fetching error stats:', err)
    }
  }

  const fetchPerformanceStats = async () => {
    try {
      // 获取性能统计
      const { data: performanceData } = await supabase
        .from('ai_generations')
        .select('processing_time_ms, transformation_type')
        .not('processing_time_ms', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1000)

      if (performanceData) {
        const avgTime =
          performanceData.reduce((sum, item) => sum + (item.processing_time_ms || 0), 0) /
          performanceData.length

        // 按操作类型分组统计
        const operationStats = performanceData.reduce(
          (acc, item) => {
            const type = item.transformation_type || 'unknown'
            if (!acc[type]) {
              acc[type] = { totalTime: 0, count: 0 }
            }
            acc[type].totalTime += item.processing_time_ms || 0
            acc[type].count += 1
            return acc
          },
          {} as Record<string, { totalTime: number; count: number }>
        )

        const slowestOperations = Object.entries(operationStats)
          .map(([operation, stats]) => ({
            operation,
            avgTime: stats.totalTime / stats.count,
            count: stats.count,
          }))
          .sort((a, b) => b.avgTime - a.avgTime)
          .slice(0, 5)

        setPerformanceStats({
          avgGenerationTime: avgTime,
          slowestOperations,
          databasePerformance: {
            avgQueryTime: 0, // 需要从数据库监控获取
            slowQueries: 0,
          },
        })
      }
    } catch (err) {
      console.error('Error fetching performance stats:', err)
    }
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchSystemStats()
      fetchErrorStats()
      fetchPerformanceStats()
    }
  }, [selectedTimeframe, isAuthorized])

  // 检查管理员权限
  if (!isAuthorized) {
    return (
      <div className='p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
        <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-medium'>访问被拒绝</span>
        </div>
        <p className='text-sm text-red-500 dark:text-red-300 mt-1'>您没有权限访问监控仪表板</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='h-32 bg-gray-200 dark:bg-gray-700 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
        <div className='flex items-center gap-2 text-red-600 dark:text-red-400 mb-2'>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-medium'>加载失败</span>
        </div>
        <p className='text-sm text-red-500 dark:text-red-300'>{error}</p>
        <button
          onClick={() => {
            setError(null)
            fetchSystemStats()
          }}
          className='mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors'
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      {/* 标题和时间选择器 */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-[var(--text-primary)]'>监控仪表板</h2>
        <div className='flex gap-2'>
          {(['1h', '24h', '7d', '30d'] as const).map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* 系统概览卡片 */}
      {systemStats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-[var(--text-secondary)]'>总用户数</p>
                <p className='text-2xl font-bold text-[var(--text-primary)]'>
                  {systemStats.totalUsers}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-blue-600 dark:text-blue-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-[var(--text-secondary)]'>活跃用户</p>
                <p className='text-2xl font-bold text-[var(--text-primary)]'>
                  {systemStats.activeUsers}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-green-600 dark:text-green-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-[var(--text-secondary)]'>今日生成</p>
                <p className='text-2xl font-bold text-[var(--text-primary)]'>
                  {systemStats.todayGenerations}
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-purple-600 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-[var(--text-secondary)]'>今日成本</p>
                <p className='text-2xl font-bold text-[var(--text-primary)]'>
                  ${systemStats.costToday.toFixed(2)}
                </p>
              </div>
              <div className='w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-yellow-600 dark:text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 性能统计 */}
      {performanceStats && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>性能统计</h3>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-[var(--text-secondary)]'>平均生成时间</span>
                <span className='font-semibold text-[var(--text-primary)]'>
                  {performanceStats.avgGenerationTime.toFixed(0)}ms
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-[var(--text-secondary)]'>数据库平均查询时间</span>
                <span className='font-semibold text-[var(--text-primary)]'>
                  {performanceStats.databasePerformance.avgQueryTime.toFixed(0)}ms
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-[var(--text-secondary)]'>慢查询数量</span>
                <span className='font-semibold text-[var(--text-primary)]'>
                  {performanceStats.databasePerformance.slowQueries}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>最慢操作</h3>
            <div className='space-y-3'>
              {performanceStats.slowestOperations.map((op, index) => (
                <div key={index} className='flex justify-between items-center'>
                  <span className='text-[var(--text-secondary)] text-sm'>{op.operation}</span>
                  <div className='text-right'>
                    <div className='font-semibold text-[var(--text-primary)]'>
                      {op.avgTime.toFixed(0)}ms
                    </div>
                    <div className='text-xs text-[var(--text-tertiary)]'>{op.count} 次调用</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 刷新按钮 */}
      <div className='flex justify-center'>
        <button
          onClick={() => {
            fetchSystemStats()
            fetchErrorStats()
            fetchPerformanceStats()
          }}
          className='px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'
        >
          刷新数据
        </button>
      </div>
    </div>
  )
}

export default MonitoringDashboard
