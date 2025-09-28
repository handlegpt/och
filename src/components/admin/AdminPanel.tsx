import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { MonitoringDashboard } from './MonitoringDashboard'
// import { useTranslation } from '../../../i18n/context';
// import { DataPersistenceService } from '../../services/dataPersistence';

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalGenerations: number
  todayGenerations: number
  systemStatus: 'healthy' | 'warning' | 'error'
}

export const AdminPanel: React.FC = () => {
  useAuth()
  // const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalGenerations: 0,
    todayGenerations: 0,
    systemStatus: 'healthy',
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'users' | 'system'>(
    'overview'
  )

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    if (!supabase) return

    setLoading(true)
    try {
      // 获取用户统计
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // 获取活跃用户（最近7天有活动的用户）
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: activeUsers } = await supabase
        .from('ai_generations')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      // 获取总生成次数
      const { count: totalGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })

      // 获取今日生成次数
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count: todayGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalGenerations: totalGenerations || 0,
        todayGenerations: todayGenerations || 0,
        systemStatus: 'healthy',
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      setStats(prev => ({ ...prev, systemStatus: 'error' }))
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '正常'
      case 'warning':
        return '警告'
      case 'error':
        return '错误'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className='p-6 text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)] mx-auto'></div>
        <p className='text-[var(--text-secondary)] mt-2'>加载中...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-4xl mx-auto'>
      {/* 标签页导航 */}
      <div className='flex border-b border-[var(--border-primary)] mb-6'>
        {[
          { key: 'overview', label: '概览', icon: '📊' },
          { key: 'monitoring', label: '监控仪表板', icon: '📈' },
          { key: 'users', label: '用户管理', icon: '👥' },
          { key: 'system', label: '系统设置', icon: '⚙️' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className='mr-2'>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 概览标签页 */}
      {activeTab === 'overview' && (
        <div className='space-y-6'>
          {/* 统计卡片 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>总用户数</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {stats.totalUsers}
                  </p>
                </div>
                <div className='w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>活跃用户</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {stats.activeUsers}
                  </p>
                </div>
                <div className='w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>总生成次数</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {stats.totalGenerations}
                  </p>
                </div>
                <div className='w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-purple-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>今日生成</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {stats.todayGenerations}
                  </p>
                </div>
                <div className='w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-orange-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 系统状态 */}
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>系统状态</h3>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(stats.systemStatus).replace('text-', 'bg-')}`}
                ></div>
                <span className='text-[var(--text-primary)]'>系统运行状态</span>
              </div>
              <span className={`font-medium ${getStatusColor(stats.systemStatus)}`}>
                {getStatusText(stats.systemStatus)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 监控仪表板标签页 */}
      {activeTab === 'monitoring' && (
        <div className='space-y-6'>
          <MonitoringDashboard />
        </div>
      )}

      {/* 用户管理标签页 */}
      {activeTab === 'users' && (
        <div className='space-y-6'>
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>用户管理</h3>
            <p className='text-[var(--text-secondary)]'>用户管理功能开发中...</p>
          </div>
        </div>
      )}

      {/* 系统设置标签页 */}
      {activeTab === 'system' && (
        <div className='space-y-6'>
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>系统设置</h3>
            <p className='text-[var(--text-secondary)]'>系统设置功能开发中...</p>
          </div>
        </div>
      )}
    </div>
  )
}
