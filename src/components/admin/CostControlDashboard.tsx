/**
 * 成本控制管理员面板
 * 显示系统成本统计和管理功能
 */

import React, { useState, useEffect } from 'react'
import { CostControlService } from '../../services/costControl'

interface SystemCostStats {
  totalDailyCost: number
  totalMonthlyCost: number
  userCount: number
  averageCostPerUser: number
}

interface UserCostData {
  userId: string
  dailyCost: number
  monthlyCost: number
  dailyLimit: number
  monthlyLimit: number
  canMakeRequest: boolean
  remainingDaily: number
  remainingMonthly: number
}

export const CostControlDashboard: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemCostStats | null>(null)
  const [userCosts] = useState<UserCostData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'monthly'>('daily')

  useEffect(() => {
    fetchCostData()
  }, [])

  const fetchCostData = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取系统成本统计
      const stats = await CostControlService.getSystemCostStats()
      if (stats) {
        setSystemStats(stats)
      }

      // 这里可以添加获取用户成本数据的逻辑
      // const userCosts = await CostControlService.getAllUserCosts()
      // setUserCosts(userCosts)
    } catch (err) {
      console.error('Error fetching cost data:', err)
      setError('Failed to load cost data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6'>
        <div className='flex items-center gap-2 text-red-600 dark:text-red-400 mb-2'>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-medium'>Cost Control Error</span>
        </div>
        <p className='text-sm text-red-500 dark:text-red-300'>{error}</p>
        <button
          onClick={fetchCostData}
          className='mt-3 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 系统成本概览 */}
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-[var(--text-primary)] flex items-center gap-2'>
            <svg
              className='w-6 h-6 text-[var(--accent-primary)]'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            System Cost Overview
          </h2>
          <button
            onClick={fetchCostData}
            className='text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
          </button>
        </div>

        {systemStats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* 今日总成本 */}
            <div className='bg-[var(--bg-secondary)] rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>Today's Cost</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    ${systemStats.totalDailyCost.toFixed(2)}
                  </p>
                </div>
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-blue-600 dark:text-blue-400'
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
                </div>
              </div>
            </div>

            {/* 本月总成本 */}
            <div className='bg-[var(--bg-secondary)] rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>Monthly Cost</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    ${systemStats.totalMonthlyCost.toFixed(2)}
                  </p>
                </div>
                <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-green-600 dark:text-green-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 活跃用户数 */}
            <div className='bg-[var(--bg-secondary)] rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>Active Users</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {systemStats.userCount}
                  </p>
                </div>
                <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-purple-600 dark:text-purple-400'
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

            {/* 平均每用户成本 */}
            <div className='bg-[var(--bg-secondary)] rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>Avg Cost/User</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    ${systemStats.averageCostPerUser.toFixed(2)}
                  </p>
                </div>
                <div className='w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-yellow-600 dark:text-yellow-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 成本趋势图表 */}
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>Cost Trends</h3>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setSelectedTimeframe('daily')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTimeframe === 'daily'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setSelectedTimeframe('monthly')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTimeframe === 'monthly'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className='h-64 flex items-center justify-center text-[var(--text-secondary)]'>
          <div className='text-center'>
            <svg
              className='w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            <p className='text-sm'>Cost trend chart will be implemented here</p>
            <p className='text-xs text-[var(--text-tertiary)] mt-1'>
              Integration with charting library needed
            </p>
          </div>
        </div>
      </div>

      {/* 用户成本详情 */}
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>User Cost Details</h3>
          <button className='px-3 py-1 bg-[var(--accent-primary)] text-white rounded text-sm hover:bg-[var(--accent-primary-hover)] transition-colors'>
            Export Data
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-[var(--border-primary)]'>
                <th className='text-left py-2 text-[var(--text-primary)]'>User ID</th>
                <th className='text-left py-2 text-[var(--text-primary)]'>Daily Cost</th>
                <th className='text-left py-2 text-[var(--text-primary)]'>Monthly Cost</th>
                <th className='text-left py-2 text-[var(--text-primary)]'>Daily Limit</th>
                <th className='text-left py-2 text-[var(--text-primary)]'>Monthly Limit</th>
                <th className='text-left py-2 text-[var(--text-primary)]'>Status</th>
              </tr>
            </thead>
            <tbody>
              {userCosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className='text-center py-8 text-[var(--text-secondary)]'>
                    No user cost data available
                  </td>
                </tr>
              ) : (
                userCosts.map((user, index) => (
                  <tr key={index} className='border-b border-[var(--border-primary)]'>
                    <td className='py-2 text-[var(--text-primary)] font-mono text-xs'>
                      {user.userId.substring(0, 8)}...
                    </td>
                    <td className='py-2 text-[var(--text-primary)]'>
                      ${user.dailyCost.toFixed(4)}
                    </td>
                    <td className='py-2 text-[var(--text-primary)]'>
                      ${user.monthlyCost.toFixed(2)}
                    </td>
                    <td className='py-2 text-[var(--text-primary)]'>${user.dailyLimit}</td>
                    <td className='py-2 text-[var(--text-primary)]'>${user.monthlyLimit}</td>
                    <td className='py-2'>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.canMakeRequest
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {user.canMakeRequest ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 成本控制设置 */}
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
          Cost Control Settings
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
              Global Daily Cost Limit
            </label>
            <input
              type='number'
              step='0.01'
              className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]'
              placeholder='Enter daily limit'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
              Global Monthly Cost Limit
            </label>
            <input
              type='number'
              step='0.01'
              className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]'
              placeholder='Enter monthly limit'
            />
          </div>
        </div>

        <div className='mt-6 flex items-center gap-4'>
          <button className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'>
            Save Settings
          </button>
          <button className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors'>
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}

export default CostControlDashboard
