import React, { useState } from 'react'
import { useTranslation } from '../../i18n/context'

interface MagicLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onMagicLinkLogin: (email: string) => Promise<void>
}

export const MagicLinkModal: React.FC<MagicLinkModalProps> = ({
  isOpen,
  onClose,
  onMagicLinkLogin,
}) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError('')

    try {
      await onMagicLinkLogin(email)
      setIsMagicLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送Magic Link失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setIsMagicLinkSent(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 背景遮罩 */}
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={handleClose} />

      {/* 模态框 */}
      <div className='relative bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] shadow-2xl p-6 mx-4 max-w-md w-full'>
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 p-1 rounded-full text-[var(--text-secondary)] hover:bg-[rgba(107,114,128,0.2)] hover:text-[var(--text-primary)] transition-colors'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        {/* 内容 */}
        <div className='text-center'>
          {/* 图标 */}
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-primary)] bg-opacity-20 mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-[var(--accent-primary)]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
          </div>

          {/* 标题 */}
          <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
            {t('app.magicLink.title') || 'Magic Link 登录'}
          </h3>

          {/* 描述 */}
          <p className='text-[var(--text-secondary)] mb-6'>
            {t('app.magicLink.description') || '输入您的邮箱地址，我们将发送一个登录链接到您的邮箱'}
          </p>

          {!isMagicLinkSent ? (
            <>
              {/* Magic Link登录表单 */}
              <form onSubmit={handleMagicLinkSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-[var(--text-primary)] mb-2'
                  >
                    {t('app.magicLink.emailLabel') || '邮箱地址'}
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('app.magicLink.emailPlaceholder') || '输入您的邮箱地址'}
                    required
                    className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors placeholder-[var(--text-tertiary)]'
                  />
                </div>

                {error && <div className='text-red-500 text-sm text-center'>{error}</div>}

                <button
                  type='submit'
                  disabled={isLoading || !email}
                  className='w-full px-4 py-2 text-sm font-semibold text-[var(--text-on-accent)] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2'
                >
                  {isLoading ? (
                    <>
                      <svg
                        className='animate-spin h-4 w-4'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      {t('app.magicLink.sending') || '发送中...'}
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                      {t('app.magicLink.sendLink') || '发送登录链接'}
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Magic Link已发送 */
            <div className='space-y-4'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>

              <h4 className='text-lg font-semibold text-[var(--text-primary)]'>
                {t('app.magicLink.linkSent') || '登录链接已发送'}
              </h4>

              <p className='text-[var(--text-secondary)]'>
                {t('app.magicLink.checkEmail') ||
                  '我们已向您的邮箱发送了登录链接，请查收邮件并点击链接完成登录。'}
              </p>

              <p className='text-sm text-[var(--text-tertiary)]'>
                {t('app.magicLink.emailSentTo') || '发送至'}: <strong>{email}</strong>
              </p>

              <button
                onClick={handleClose}
                className='w-full px-4 py-2 text-sm font-semibold text-[var(--text-primary)] bg-[rgba(107,114,128,0.2)] rounded-lg hover:bg-[rgba(107,114,128,0.4)] transition-colors duration-200'
              >
                {t('app.magicLink.close') || '关闭'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
