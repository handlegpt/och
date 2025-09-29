import React, { useState, useEffect, useCallback } from 'react'
import { PaymentService, SubscriptionInfo } from '../../services/paymentService'
import {
  getPlanDisplayName,
  getPlanDescription,
  getPlanFeatures,
  SubscriptionStatus,
} from '../../lib/stripe'
import { useAuth } from '../../hooks/useAuth'

export const SubscriptionManager: React.FC = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 获取订阅信息
  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user, fetchSubscription])

  const fetchSubscription = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const subscriptionInfo = await PaymentService.getUserSubscription(user.id)
      setSubscription(subscriptionInfo)
    } catch (error) {
      console.error('获取订阅信息失败:', error)
      setMessage({ type: 'error', text: '获取订阅信息失败' })
    } finally {
      setLoading(false)
    }
  }, [user])

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return

    if (!confirm('确定要取消订阅吗？您将失去所有高级功能访问权限。')) {
      return
    }

    setActionLoading('cancel')
    try {
      const success = await PaymentService.cancelSubscription(user.id)
      if (success) {
        setMessage({ type: 'success', text: '订阅已取消，将在当前计费周期结束后生效' })
        await fetchSubscription() // 刷新订阅信息
      } else {
        setMessage({ type: 'error', text: '取消订阅失败，请稍后重试' })
      }
    } catch (error) {
      console.error('取消订阅失败:', error)
      setMessage({ type: 'error', text: '取消订阅失败，请稍后重试' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleResumeSubscription = async () => {
    if (!user || !subscription) return

    setActionLoading('resume')
    try {
      const success = await PaymentService.resumeSubscription(user.id)
      if (success) {
        setMessage({ type: 'success', text: '订阅已恢复' })
        await fetchSubscription() // 刷新订阅信息
      } else {
        setMessage({ type: 'error', text: '恢复订阅失败，请稍后重试' })
      }
    } catch (error) {
      console.error('恢复订阅失败:', error)
      setMessage({ type: 'error', text: '恢复订阅失败，请稍后重试' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdatePaymentMethod = async () => {
    if (!user) return

    setActionLoading('payment')
    try {
      const portalUrl = await PaymentService.updatePaymentMethod(user.id)
      if (portalUrl) {
        window.open(portalUrl, '_blank')
      } else {
        setMessage({ type: 'error', text: '无法打开支付管理页面' })
      }
    } catch (error) {
      console.error('更新支付方式失败:', error)
      setMessage({ type: 'error', text: '更新支付方式失败，请稍后重试' })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusDisplay = (status: SubscriptionStatus): { text: string; color: string } => {
    const statusMap = {
      [SubscriptionStatus.ACTIVE]: { text: '活跃', color: 'text-green-600' },
      [SubscriptionStatus.CANCELED]: { text: '已取消', color: 'text-red-600' },
      [SubscriptionStatus.PAST_DUE]: { text: '逾期', color: 'text-yellow-600' },
      [SubscriptionStatus.UNPAID]: { text: '未支付', color: 'text-red-600' },
      [SubscriptionStatus.INCOMPLETE]: { text: '未完成', color: 'text-yellow-600' },
      [SubscriptionStatus.INCOMPLETE_EXPIRED]: { text: '未完成已过期', color: 'text-red-600' },
      [SubscriptionStatus.TRIALING]: { text: '试用中', color: 'text-blue-600' },
    }
    return statusMap[status] || { text: '未知', color: 'text-gray-600' }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className='text-center p-8'>
        <div className='w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)]'>
          <svg fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>暂无订阅</h3>
        <p className='text-[var(--text-secondary)] mb-4'>您当前使用的是免费计划</p>
        <a
          href='/pricing'
          className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity'
        >
          查看订阅计划
        </a>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(subscription.status)
  const planFeatures = getPlanFeatures(subscription.planId)

  return (
    <div className='space-y-6'>
      {/* 消息提示 */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 订阅概览 */}
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h3 className='text-xl font-bold text-[var(--text-primary)] mb-1'>
              {getPlanDisplayName(subscription.planId)}
            </h3>
            <p className='text-[var(--text-secondary)] mb-2'>
              {getPlanDescription(subscription.planId)}
            </p>
            <div className='flex items-center gap-2'>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusDisplay.color === 'text-green-600'
                    ? 'bg-green-100'
                    : statusDisplay.color === 'text-red-600'
                      ? 'bg-red-100'
                      : statusDisplay.color === 'text-yellow-600'
                        ? 'bg-yellow-100'
                        : 'bg-gray-100'
                }`}
              >
                {statusDisplay.text}
              </span>
              <span className='text-sm text-[var(--text-secondary)]'>
                {subscription.billingCycle === 'yearly' ? '年付' : '月付'}
              </span>
            </div>
          </div>
        </div>

        {/* 计费周期信息 */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-sm text-[var(--text-secondary)] mb-1'>当前周期开始</p>
            <p className='text-sm font-medium text-[var(--text-primary)]'>
              {subscription.currentPeriodStart.toLocaleDateString('zh-CN')}
            </p>
          </div>
          <div>
            <p className='text-sm text-[var(--text-secondary)] mb-1'>当前周期结束</p>
            <p className='text-sm font-medium text-[var(--text-primary)]'>
              {subscription.currentPeriodEnd.toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>

        {/* 取消提醒 */}
        {subscription.cancelAtPeriodEnd && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4'>
            <p className='text-yellow-700 text-sm'>
              您的订阅将在 {subscription.currentPeriodEnd.toLocaleDateString('zh-CN')} 取消
            </p>
          </div>
        )}

        {/* 功能列表 */}
        <div className='mb-4'>
          <h4 className='text-sm font-medium text-[var(--text-primary)] mb-2'>包含功能</h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {planFeatures.map((feature, index) => (
              <div
                key={index}
                className='flex items-center gap-2 text-sm text-[var(--text-secondary)]'
              >
                <svg
                  className='w-4 h-4 text-green-500 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={handleUpdatePaymentMethod}
            disabled={actionLoading === 'payment'}
            className='px-4 py-2 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50'
          >
            {actionLoading === 'payment' ? '处理中...' : '管理支付方式'}
          </button>

          {subscription.status === SubscriptionStatus.ACTIVE && !subscription.cancelAtPeriodEnd && (
            <button
              onClick={handleCancelSubscription}
              disabled={actionLoading === 'cancel'}
              className='px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50'
            >
              {actionLoading === 'cancel' ? '处理中...' : '取消订阅'}
            </button>
          )}

          {subscription.cancelAtPeriodEnd && (
            <button
              onClick={handleResumeSubscription}
              disabled={actionLoading === 'resume'}
              className='px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50'
            >
              {actionLoading === 'resume' ? '处理中...' : '恢复订阅'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
