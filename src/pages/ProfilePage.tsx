import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../../i18n/context'
import { UserSettings } from '../components/user/UserSettings'
import { AdminPanel } from '../components/admin/AdminPanel'
import { UserHistory } from '../components/user/UserHistory'
import { ProfileImprovements } from '../components/user/ProfileImprovements'
import { DashboardLayout } from '../components/user/DashboardLayout'
import { FavoritesManager } from '../components/user/FavoritesManager'
import { PrivacyControls } from '../components/user/PrivacyControls'

export const ProfilePage: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'history' | 'favorites' | 'settings' | 'privacy' | 'improvements' | 'admin'
  >('dashboard')

  if (!user) {
    return (
      <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>🔐</div>
          <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>
            {t('app.profile.loginRequired')}
          </h2>
          <p className='text-[var(--text-secondary)]'>
            {t('app.profile.loginRequiredDescription')}
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'dashboard', label: '仪表板', icon: '📊' },
    { key: 'history', label: t('app.profile.tabs.history'), icon: '📝' },
    { key: 'favorites', label: '我的收藏', icon: '⭐' },
    { key: 'settings', label: t('app.profile.tabs.settings'), icon: '⚙️' },
    { key: 'privacy', label: '隐私控制', icon: '🔒' },
    { key: 'improvements', label: '改善建议', icon: '🚀' },
    ...(isAdmin ? [{ key: 'admin', label: t('app.profile.tabs.admin'), icon: '🛡️' }] : []),
  ] as const

  return (
    <div className='min-h-screen bg-[var(--bg-primary)]'>
      <div className='container mx-auto p-4 md:p-8'>
        {/* 页面标题 */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>
            {t('app.profile.title')}
          </h1>
          <p className='text-[var(--text-secondary)]'>{t('app.profile.subtitle')}</p>
        </div>

        {/* 标签页导航 */}
        <div className='flex border-b border-[var(--border-primary)] mb-8'>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
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

        {/* 标签页内容 */}
        <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
          {activeTab === 'dashboard' && (
            <div>
              <DashboardLayout />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.profile.history.title')}
              </h2>
              <p className='text-[var(--text-secondary)] mb-6'>
                {t('app.profile.history.description')}
              </p>
              <UserHistory />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>我的收藏</h2>
              <p className='text-[var(--text-secondary)] mb-6'>管理您收藏的生成作品</p>
              <FavoritesManager />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.profile.settings.title')}
              </h2>
              <p className='text-[var(--text-secondary)] mb-6'>
                {t('app.profile.settings.description')}
              </p>
              <UserSettings />
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>隐私控制</h2>
              <p className='text-[var(--text-secondary)] mb-6'>管理您的隐私设置和数据权限</p>
              <PrivacyControls />
            </div>
          )}

          {activeTab === 'improvements' && (
            <div>
              <ProfileImprovements />
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div>
              <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.profile.admin.title')}
              </h2>
              <p className='text-[var(--text-secondary)] mb-6'>
                {t('app.profile.admin.description')}
              </p>
              <AdminPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
