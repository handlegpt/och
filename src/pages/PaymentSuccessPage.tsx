import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaymentService } from '../services/paymentService'
import { useAuth } from '../hooks/useAuth'

export const PaymentSuccessPage: React.FC = () => {
  // const [searchParams] = useSearchParams() // 暂时未使用
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    // 验证支付状态
    verifyPayment()
  }, [user, navigate, verifyPayment])

  const verifyPayment = useCallback(async () => {
    try {
      setLoading(true)

      // 获取用户订阅信息
      const subscriptionInfo = await PaymentService.getUserSubscription(user?.id || '')

      if (subscriptionInfo) {
        setSubscription(subscriptionInfo)
      } else {
        setError('未找到订阅信息，请联系客服')
      }
    } catch (err) {
      console.error('验证支付失败:', err)
      setError('验证支付失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [user])

  const handleContinue = () => {
    navigate('/')
  }

  const handleGoToProfile = () => {
    navigate('/profile')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4'></div>
          <p className='text-[var(--text-secondary)]'>验证支付中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center'>
        <div className='max-w-md mx-auto text-center p-6'>
          <div className='w-16 h-16 mx-auto mb-4 text-red-500'>
            <svg fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>支付验证失败</h1>
          <p className='text-[var(--text-secondary)] mb-6'>{error}</p>
          <div className='flex gap-4 justify-center'>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors'
            >
              重试
            </button>
            <button
              onClick={handleContinue}
              className='px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity'
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center'>
      <div className='max-w-md mx-auto text-center p-6'>
        {/* 成功图标 */}
        <div className='w-20 h-20 mx-auto mb-6 text-green-500'>
          <svg fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </div>

        {/* 成功标题 */}
        <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-4'>支付成功！</h1>

        {/* 成功描述 */}
        <p className='text-lg text-[var(--text-secondary)] mb-6'>感谢您的订阅，您的账户已升级</p>

        {/* 订阅信息 */}
        {subscription && (
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] p-6 mb-6'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>订阅详情</h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-[var(--text-secondary)]'>计划</span>
                <span className='text-[var(--text-primary)] font-medium'>
                  {subscription.planId === 'basic'
                    ? '基础版'
                    : subscription.planId === 'pro'
                      ? '专业版'
                      : subscription.planId === 'max'
                        ? '旗舰版'
                        : subscription.planId}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-[var(--text-secondary)]'>计费周期</span>
                <span className='text-[var(--text-primary)] font-medium'>
                  {subscription.billingCycle === 'yearly' ? '年付' : '月付'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-[var(--text-secondary)]'>状态</span>
                <span className='text-green-600 font-medium'>活跃</span>
              </div>
            </div>
          </div>
        )}

        {/* 功能提示 */}
        <div className='bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl p-4 mb-6'>
          <h4 className='text-sm font-semibold text-[var(--text-primary)] mb-2'>
            🎉 您现在可以享受：
          </h4>
          <ul className='text-sm text-[var(--text-secondary)] space-y-1 text-left'>
            <li>• 更多每日生成次数</li>
            <li>• 高级 AI 效果</li>
            <li>• 高清输出质量</li>
            <li>• 批量处理功能</li>
            <li>• 优先技术支持</li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            onClick={handleContinue}
            className='flex-1 px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium'
          >
            开始创作
          </button>
          <button
            onClick={handleGoToProfile}
            className='flex-1 px-6 py-3 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors font-medium'
          >
            管理订阅
          </button>
        </div>

        {/* 帮助信息 */}
        <div className='mt-6 text-sm text-[var(--text-tertiary)]'>
          <p>
            如有问题，请联系{' '}
            <a
              href='mailto:support@och.ai'
              className='text-[var(--accent-primary)] hover:underline'
            >
              support@och.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
