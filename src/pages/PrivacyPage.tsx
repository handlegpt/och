import React from 'react'
import { useTranslation } from '../../i18n/context'

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>
            🔒 {t('privacy.title')}
          </h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>{t('privacy.subtitle')}</p>
        </div>

        {/* 隐私政策内容 */}
        <div className='max-w-4xl mx-auto'>
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8'>
            <div className='space-y-6 text-[var(--text-secondary)] leading-relaxed'>
              <section>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                  1. {t('privacy.section1.title')}
                </h3>
                <p>{t('privacy.section1.content')}</p>
              </section>

              <section>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                  2. {t('privacy.section2.title')}
                </h3>
                <p>{t('privacy.section2.content')}</p>
              </section>

              <section>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                  3. {t('privacy.section3.title')}
                </h3>
                <p>{t('privacy.section3.content')}</p>
              </section>

              <section>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                  4. {t('privacy.section4.title')}
                </h3>
                <p>{t('privacy.section4.content')}</p>
              </section>

              <section>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                  5. {t('privacy.section5.title')}
                </h3>
                <p>{t('privacy.section5.content')}</p>
              </section>

              <section>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                  6. {t('privacy.section6.title')}
                </h3>
                <p>{t('privacy.section6.content')}</p>
              </section>

              <div className='mt-8 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-lg'>
                <p className='text-sm text-[var(--accent-primary)]'>
                  <strong>{t('privacy.lastUpdated')}:</strong> {t('privacy.updateDate')}
                </p>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <div className='mt-8 p-6 bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] text-center'>
            <div className='text-4xl mb-4'>ℹ️</div>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
              {t('privacy.manageSettings.title')}
            </h3>
            <p className='text-[var(--text-secondary)] mb-4'>
              {t('privacy.manageSettings.description')}
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <a
                href='/profile'
                className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'
              >
                {t('privacy.manageSettings.button')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
