/**
 * 成本控制面板组件
 * 显示用户成本使用情况和限制
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { CostControlService, UserCostStats } from '../services/costControl'

interface CostControlPanelProps {
  className?: string
  showDetails?: boolean
}

export const CostControlPanel: React.FC<CostControlPanelProps> = ({
  className = '',
  showDetails = true,
}) => {
  const { user } = useAuth()
  const [costStats, setCostStats] = useState<UserCostStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchCostStats()
  }, [user, fetchCostStats])

  const fetchCostStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取用户成本统计
      const stats = await CostControlService.getUserCostStats(user?.id || '', 'free') // 这里需要从用户配置获取实际层级

      if (stats) {
        setCostStats(stats)
      } else {
        setError('Failed to load cost statistics')
      }
    } catch (err) {
      console.error('Error fetching cost stats:', err)
      setError('Error loading cost statistics')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div
        className={`bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-4 ${className}`}
      >
        <div className='flex items-center justify-center py-4'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-primary)]'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 ${className}`}
      >
        <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <span className='text-sm font-medium'>Cost Control Error</span>
        </div>
        <p className='text-sm text-red-500 dark:text-red-300 mt-1'>{error}</p>
      </div>
    )
  }

  if (!costStats) {
    return null
  }

  const dailyUsagePercent = (costStats.dailyCost / costStats.dailyLimit) * 100
  const monthlyUsagePercent = (costStats.monthlyCost / costStats.monthlyLimit) * 100

  const getUsageColor = (percent: number) => {
    if (percent >= 100) return 'text-red-500'
    if (percent >= 80) return 'text-yellow-500'
    if (percent >= 50) return 'text-blue-500'
    return 'text-green-500'
  }

  const getUsageBgColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500'
    if (percent >= 80) return 'bg-yellow-500'
    if (percent >= 50) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div
      className={`bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-4 ${className}`}
    >
      {/* 标题 */}
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2'>
          <svg
            className='w-5 h-5 text-[var(--accent-primary)]'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
            />
          </svg>
          Cost Control
        </h3>
        <button
          onClick={fetchCostStats}
          className='text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
        </button>
      </div>

      {/* 每日使用情况 */}
      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium text-[var(--text-primary)]'>Daily Usage</span>
          <span className={`text-sm font-bold ${getUsageColor(dailyUsagePercent)}`}>
            ${costStats.dailyCost.toFixed(4)} / ${costStats.dailyLimit}
          </span>
        </div>
        <div className='w-full bg-[var(--bg-secondary)] rounded-full h-2'>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(dailyUsagePercent)}`}
            style={{ width: `${Math.min(dailyUsagePercent, 100)}%` }}
          />
        </div>
        <div className='flex items-center justify-between mt-1'>
          <span className='text-xs text-[var(--text-secondary)]'>
            {dailyUsagePercent.toFixed(1)}% used
          </span>
          <span className='text-xs text-[var(--text-secondary)]'>
            ${costStats.remainingDaily.toFixed(4)} remaining
          </span>
        </div>
      </div>

      {/* 每月使用情况 */}
      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium text-[var(--text-primary)]'>Monthly Usage</span>
          <span className={`text-sm font-bold ${getUsageColor(monthlyUsagePercent)}`}>
            ${costStats.monthlyCost.toFixed(2)} / ${costStats.monthlyLimit}
          </span>
        </div>
        <div className='w-full bg-[var(--bg-secondary)] rounded-full h-2'>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(monthlyUsagePercent)}`}
            style={{ width: `${Math.min(monthlyUsagePercent, 100)}%` }}
          />
        </div>
        <div className='flex items-center justify-between mt-1'>
          <span className='text-xs text-[var(--text-secondary)]'>
            {monthlyUsagePercent.toFixed(1)}% used
          </span>
          <span className='text-xs text-[var(--text-secondary)]'>
            ${costStats.remainingMonthly.toFixed(2)} remaining
          </span>
        </div>
      </div>

      {/* 状态指示器 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className={`w-2 h-2 rounded-full ${
              costStats.canMakeRequest ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className='text-sm text-[var(--text-secondary)]'>
            {costStats.canMakeRequest ? 'API requests allowed' : 'API requests blocked'}
          </span>
        </div>

        {!costStats.canMakeRequest && (
          <div className='text-xs text-red-500 font-medium'>Cost limit exceeded</div>
        )}
      </div>

      {/* 详细信息 */}
      {showDetails && (
        <div className='mt-4 pt-4 border-t border-[var(--border-primary)]'>
          <div className='grid grid-cols-2 gap-4 text-xs'>
            <div>
              <span className='text-[var(--text-secondary)]'>Daily Limit:</span>
              <span className='ml-1 font-medium text-[var(--text-primary)]'>
                ${costStats.dailyLimit}
              </span>
            </div>
            <div>
              <span className='text-[var(--text-secondary)]'>Monthly Limit:</span>
              <span className='ml-1 font-medium text-[var(--text-primary)]'>
                ${costStats.monthlyLimit}
              </span>
            </div>
          </div>

          {/* 预警信息 */}
          {(dailyUsagePercent >= 80 || monthlyUsagePercent >= 80) && (
            <div className='mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
              <div className='flex items-center gap-2'>
                <svg className='w-4 h-4 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-sm font-medium text-yellow-700 dark:text-yellow-300'>
                  Cost Alert
                </span>
              </div>
              <p className='text-xs text-yellow-600 dark:text-yellow-400 mt-1'>
                {dailyUsagePercent >= 80 && `Daily usage at ${dailyUsagePercent.toFixed(1)}%`}
                {monthlyUsagePercent >= 80 && `Monthly usage at ${monthlyUsagePercent.toFixed(1)}%`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CostControlPanel
