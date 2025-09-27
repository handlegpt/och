import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './auth/AuthModal'
import { AdminPanel } from './admin/AdminPanel'
import { useTranslation } from '../../i18n/context'

export const UserInfo: React.FC = () => {
  const { user, signOut, isAdmin, userProfile } = useAuth()
  const { t } = useTranslation()
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!user) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <button
          onClick={() => setShowAuthModal(true)}
          className='px-3 py-2 text-sm font-semibold text-[var(--text-primary)] bg-[rgba(107,114,128,0.2)] rounded-md hover:bg-[rgba(107,114,128,0.4)] transition-colors duration-200'
        >
          {t('app.login')}
        </button>

        {/* AuthModal for non-logged in users */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      {/* 用户头像和基本信息 */}
      <div className='flex items-center gap-3'>
        {/* 用户头像 */}
        <div className='relative'>
          {userProfile?.avatar_url ? (
            <img
              src={userProfile.avatar_url}
              alt='User Avatar'
              className='w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] object-cover'
            />
          ) : (
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-sm font-semibold'>
              {(userProfile?.display_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          {/* 在线状态指示器 */}
          <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[var(--bg-primary)] rounded-full'></div>
        </div>

        {/* 用户信息 */}
        <div className='flex flex-col'>
          <span className='text-sm font-medium text-[var(--text-primary)]'>
            {userProfile?.display_name || user.email?.split('@')[0] || 'User'}
          </span>
          <span className='text-xs text-[var(--text-tertiary)]'>
            {userProfile?.subscription_tier || 'free'}
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className='flex items-center gap-2'>
        {isAdmin && (
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className='px-3 py-1.5 text-xs font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200 flex items-center gap-1'
          >
            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              />
            </svg>
            {t('app.admin')}
          </button>
        )}

        <button
          onClick={async e => {
            e.preventDefault()
            e.stopPropagation()

            const button = e.currentTarget
            // 防止重复点击
            if (button.disabled) return
            button.disabled = true

            try {
              console.log('Attempting to sign out...')
              await signOut()
              console.log('Sign out successful')

              // 不需要手动刷新页面，React状态会自动更新
              // 用户状态会通过onAuthStateChange自动清除
            } catch (error) {
              console.error('Sign out error:', error)
              alert('退出登录失败，请重试')
            } finally {
              // 重新启用按钮（检查按钮是否仍然存在）
              if (button && button.parentNode) {
                button.disabled = false
              }
            }
          }}
          className='px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] bg-[rgba(107,114,128,0.2)] rounded-md hover:bg-[rgba(107,114,128,0.4)] transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
            />
          </svg>
          {t('app.logout')}
        </button>
      </div>

      {showAdminPanel && isAdmin && (
        <div className='absolute top-16 right-4 bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6 shadow-2xl shadow-black/20 z-50 w-96 max-h-[80vh] overflow-y-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-[var(--accent-primary)]'>管理面板</h3>
            <button
              onClick={() => setShowAdminPanel(false)}
              className='text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <AdminPanel />
        </div>
      )}

      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              color: 'black',
              minWidth: '400px',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>登录 Och AI</h2>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Google 登录
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
