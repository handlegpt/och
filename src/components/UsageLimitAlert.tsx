import React from 'react'
import { useUsageLimit } from '../hooks/useUsageLimit'
import { useAuth } from '../hooks/useAuth'

export const UsageLimitAlert: React.FC = () => {
  const { user } = useAuth()
  const { usageLimit, loading } = useUsageLimit()

  if (loading || !user) return null

  const { dailyLimit, usedToday, remainingToday, canGenerate } = usageLimit

  // 调试信息 - 只在开发环境输出
  if (process.env.NODE_ENV === 'development') {
    console.log('UsageLimitAlert - usageLimit:', usageLimit)
  }

  // 如果数据无效，不显示警告
  if (dailyLimit === undefined || usedToday === undefined || remainingToday === undefined) {
    console.warn('UsageLimitAlert - Invalid usage limit data:', usageLimit)
    return null
  }

  // 如果还有剩余次数，不显示警告
  if (canGenerate && remainingToday > 2) return null

  // 计算使用百分比
  const usagePercentage = (usedToday / dailyLimit) * 100

  // 根据使用情况显示不同级别的警告
  const getAlertType = () => {
    if (!canGenerate) return 'error' // 已用完
    if (usagePercentage >= 80) return 'warning' // 接近限制
    if (usagePercentage >= 60) return 'info' // 中等使用
    return null
  }

  const alertType = getAlertType()
  if (!alertType) return null

  const getAlertStyles = () => {
    switch (alertType) {
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          text: 'text-red-400',
          icon: '🚫',
          title: '今日生成次数已用完',
          message: `您今天已使用 ${usedToday}/${dailyLimit} 次生成，请明天再试或升级账户。`,
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/20',
          text: 'text-yellow-400',
          icon: '⚠️',
          title: '使用量接近限制',
          message: `您今天已使用 ${usedToday}/${dailyLimit} 次生成，还剩 ${remainingToday} 次。`,
        }
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          text: 'text-blue-400',
          icon: 'ℹ️',
          title: '使用量提醒',
          message: `您今天已使用 ${usedToday}/${dailyLimit} 次生成，还剩 ${remainingToday} 次。`,
        }
      default:
        return null
    }
  }

  const styles = getAlertStyles()
  if (!styles) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border backdrop-blur-sm ${styles.bg}`}
    >
      <div className='flex items-start gap-3'>
        <span className='text-lg'>{styles.icon}</span>
        <div className='flex-1'>
          <h4 className={`font-semibold text-sm ${styles.text} mb-1`}>{styles.title}</h4>
          <p className='text-xs text-[var(--text-secondary)] mb-2'>{styles.message}</p>

          {/* 进度条 */}
          <div className='w-full bg-[var(--bg-secondary)] rounded-full h-1.5 mb-2'>
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                alertType === 'error'
                  ? 'bg-red-500'
                  : alertType === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>

          {/* 升级提示 */}
          {alertType === 'error' && (
            <button className='text-xs text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors'>
              升级到Pro获得更多次数 →
            </button>
          )}
        </div>

        {/* 关闭按钮 */}
        <button className='text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors'>
          ×
        </button>
      </div>
    </div>
  )
}
