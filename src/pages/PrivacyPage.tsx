import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../../i18n/context'
import { PrivacyControls } from '../components/user/PrivacyControls'

export const PrivacyPage: React.FC = () => {
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
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>🔒 隐私控制</h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>
            管理您的隐私设置、数据权限和个人信息安全
          </p>
        </div>

        {/* 隐私控制组件 */}
        <div className='max-w-4xl mx-auto'>
          <PrivacyControls />
        </div>
      </div>
    </div>
  )
}
