import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../../i18n/context'
import { UserSettings } from '../components/user/UserSettings'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import ThemeSwitcher from '../../components/ThemeSwitcher'

export const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()

  if (!user) {
    return (
      <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4'>
        <div className='text-center max-w-md'>
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

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20 md:pb-8'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>⚙️ Settings</h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>
            Customize your application experience and account settings
          </p>
        </div>

        <div className='max-w-4xl mx-auto space-y-8'>
          {/* 应用设置 */}
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
            <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
              🌐 Application Settings
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium text-[var(--text-primary)]'>Language Settings</h3>
                  <p className='text-sm text-[var(--text-secondary)]'>
                    Choose your preferred language
                  </p>
                </div>
                <LanguageSwitcher />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium text-[var(--text-primary)]'>Theme Settings</h3>
                  <p className='text-sm text-[var(--text-secondary)]'>Choose light or dark theme</p>
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          {/* 用户设置 */}
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
            <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
              👤 User Settings
            </h2>
            <UserSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
