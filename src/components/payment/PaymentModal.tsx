import React, { useState, useEffect } from 'react'
import { PaymentService, PaymentRequest, PaymentResponse } from '../../services/paymentService'
import { formatPrice } from '../../lib/stripe'
import { useAuth } from '../../hooks/useAuth'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  billingCycle: 'monthly' | 'yearly'
  price: number
  planName: string
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planId,
  billingCycle,
  price,
  planName,
}) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm')

  // 重置状态当模态框打开/关闭时
  useEffect(() => {
    if (isOpen) {
      setStep('confirm')
      setError(null)
    }
  }, [isOpen])

  const handlePayment = async () => {
    if (!user) {
      setError('请先登录')
      return
    }

    setLoading(true)
    setStep('processing')
    setError(null)

    try {
      const paymentRequest: PaymentRequest = {
        planId,
        billingCycle,
        userId: user.id,
        userEmail: user.email || '',
        successUrl: `${window.location.origin}/payment/success?plan=${planId}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }

      const response: PaymentResponse = await PaymentService.createCheckoutSession(paymentRequest)

      if (response.success && response.sessionId) {
        // 重定向到 Stripe Checkout
        const redirectSuccess = await PaymentService.redirectToCheckout(response.sessionId)
        if (!redirectSuccess) {
          setError('重定向到支付页面失败')
          setStep('error')
        }
      } else {
        setError(response.error || '支付初始化失败')
        setStep('error')
      }
    } catch (err) {
      console.error('支付处理错误:', err)
      setError('支付处理失败，请稍后重试')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (step === 'processing') return // 处理中不允许关闭
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-md w-full mx-4'>
        {/* 头部 */}
        <div className='p-6 border-b border-[var(--border-primary)]'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-[var(--text-primary)]'>
              {step === 'confirm' && '确认订阅'}
              {step === 'processing' && '处理中...'}
              {step === 'success' && '支付成功'}
              {step === 'error' && '支付失败'}
            </h2>
            {step !== 'processing' && (
              <button
                onClick={handleClose}
                className='text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 内容 */}
        <div className='p-6'>
          {step === 'confirm' && (
            <div className='space-y-6'>
              {/* 订阅信息 */}
              <div className='bg-[var(--bg-secondary)] rounded-xl p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)]'>{planName}</h3>
                  <span className='text-2xl font-bold text-[var(--accent-primary)]'>
                    {formatPrice(price)}
                  </span>
                </div>
                <p className='text-sm text-[var(--text-secondary)]'>
                  {billingCycle === 'yearly' ? '年付' : '月付'}
                </p>
              </div>

              {/* 支付说明 */}
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-sm text-[var(--text-secondary)]'>
                  <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  安全支付，由 Stripe 提供支持
                </div>
                <div className='flex items-center gap-3 text-sm text-[var(--text-secondary)]'>
                  <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  随时可以取消订阅
                </div>
                <div className='flex items-center gap-3 text-sm text-[var(--text-secondary)]'>
                  <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  立即生效，无需等待
                </div>
              </div>

              {/* 错误信息 */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <p className='text-red-600 text-sm'>{error}</p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className='flex gap-3'>
                <button
                  onClick={handleClose}
                  className='flex-1 px-4 py-3 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors'
                >
                  取消
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className='flex-1 px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50'
                >
                  确认支付
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 mx-auto'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--accent-primary)]'></div>
              </div>
              <p className='text-[var(--text-secondary)]'>正在跳转到支付页面...</p>
              <p className='text-sm text-[var(--text-tertiary)]'>请稍候，不要关闭此页面</p>
            </div>
          )}

          {step === 'success' && (
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 mx-auto text-green-500'>
                <svg fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-[var(--text-primary)]'>支付成功！</h3>
              <p className='text-[var(--text-secondary)]'>
                您的订阅已激活，可以开始使用所有功能了。
              </p>
              <button
                onClick={handleClose}
                className='w-full px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl hover:opacity-90 transition-opacity'
              >
                开始使用
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 mx-auto text-red-500'>
                <svg fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-[var(--text-primary)]'>支付失败</h3>
              <p className='text-[var(--text-secondary)]'>{error}</p>
              <div className='flex gap-3'>
                <button
                  onClick={handleClose}
                  className='flex-1 px-4 py-3 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors'
                >
                  关闭
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  className='flex-1 px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl hover:opacity-90 transition-opacity'
                >
                  重试
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
