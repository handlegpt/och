import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../../i18n/context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const { t } = useTranslation()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError(t('auth.magicLink.error'))
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await signInWithEmail(email)
      setSuccess(t('auth.magicLink.success'))
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20'>
      <div className='bg-card rounded-xl border border-primary p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-primary'>{t('auth.title')}</h2>
          <button onClick={onClose} className='text-secondary hover:text-primary transition-colors'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='space-y-4'>
          {/* Google 登录 */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className='w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            {loading ? t('auth.loading') : t('auth.googleLogin')}
          </button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-primary' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-card text-secondary'>{t('auth.or')}</span>
            </div>
          </div>

          {/* Magic Link 登录 */}
          <div className='space-y-3'>
            <div className='text-center'>
              <h3 className='text-sm font-medium text-primary mb-1'>{t('auth.magicLink.title')}</h3>
              <p className='text-xs text-secondary'>{t('auth.magicLink.description')}</p>
            </div>

            <form onSubmit={handleEmailLogin} className='space-y-3'>
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-primary mb-1'>
                  {t('auth.magicLink.emailLabel')}
                </label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('auth.magicLink.emailPlaceholder')}
                  className='w-full px-3 py-2 bg-secondary border border-primary rounded-lg focus-ring-accent text-primary'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full py-2 px-4 bg-gradient-accent text-on-accent font-semibold rounded-lg hover-bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                        fill='none'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    {t('auth.magicLink.sending')}
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                    {t('auth.magicLink.sendButton')}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 错误和成功消息 */}
          {error && (
            <div className='p-3 bg-error border border-error rounded-lg'>
              <p className='text-sm text-error'>{error}</p>
            </div>
          )}

          {success && (
            <div className='p-3 bg-green-100 border border-green-300 rounded-lg'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <p className='text-sm text-green-800'>{success}</p>
              </div>
            </div>
          )}

          <div className='text-xs text-tertiary text-center'>{t('auth.terms')}</div>
        </div>
      </div>
    </div>
  )
}
