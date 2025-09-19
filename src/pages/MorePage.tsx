import React, { useState } from 'react'
import { useTranslation } from '../../i18n/context'

export const MorePage: React.FC = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'contact' | 'about'>('contact')

  const tabs = [
    { key: 'contact', label: t('more.tabs.contact'), icon: '📞' },
    { key: 'about', label: t('more.tabs.about'), icon: 'ℹ️' },
  ] as const

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>
            📱 {t('more.title')}
          </h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>{t('more.subtitle')}</p>
        </div>

        {/* 标签页导航 */}
        <div className='flex justify-center mb-8'>
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-lg p-1 border border-[var(--border-primary)]'>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <span className='mr-2'>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签页内容 */}
        <div className='max-w-4xl mx-auto'>
          {activeTab === 'contact' && (
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8'>
              <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>
                📞 {t('more.contact.title')}
              </h2>

              <div className='space-y-6 text-[var(--text-secondary)] leading-relaxed'>
                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    💬 {t('more.contact.feedback.title')}
                  </h3>
                  <p>{t('more.contact.feedback.content')}</p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    🛠️ {t('more.contact.support.title')}
                  </h3>
                  <p>{t('more.contact.support.content')}</p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    💡 {t('more.contact.feature.title')}
                  </h3>
                  <p>{t('more.contact.feature.content')}</p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    📧 {t('more.contact.contactMethods.title')}
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>📧</span>
                      <div>
                        <p className='font-medium text-[var(--text-primary)]'>
                          {t('more.contact.contactMethods.email.label')}
                        </p>
                        <p className='text-sm'>support@ochai.com</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>💬</span>
                      <div>
                        <p className='font-medium text-[var(--text-primary)]'>
                          {t('more.contact.contactMethods.chat.label')}
                        </p>
                        <p className='text-sm'>{t('more.contact.contactMethods.chat.hours')}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>📱</span>
                      <div>
                        <p className='font-medium text-[var(--text-primary)]'>
                          {t('more.contact.contactMethods.app.label')}
                        </p>
                        <p className='text-sm'>
                          {t('more.contact.contactMethods.app.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className='mt-8 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-lg'>
                  <p className='text-sm text-[var(--accent-primary)]'>
                    <strong>{t('more.contact.responseTime.label')}:</strong>{' '}
                    {t('more.contact.responseTime.content')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8'>
              <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>
                ℹ️ {t('more.about.title')}
              </h2>

              <div className='space-y-6 text-[var(--text-secondary)] leading-relaxed'>
                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    🎨 {t('more.about.app.title')}
                  </h3>
                  <p>{t('more.about.app.content')}</p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    ✨ {t('more.about.features.title')}
                  </h3>
                  <ul className='list-disc list-inside space-y-2 ml-4'>
                    <li>{t('more.about.features.item1')}</li>
                    <li>{t('more.about.features.item2')}</li>
                    <li>{t('more.about.features.item3')}</li>
                    <li>{t('more.about.features.item4')}</li>
                    <li>{t('more.about.features.item5')}</li>
                    <li>{t('more.about.features.item6')}</li>
                  </ul>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    🚀 {t('more.about.technology.title')}
                  </h3>
                  <ul className='list-disc list-inside space-y-2 ml-4'>
                    <li>{t('more.about.technology.item1')}</li>
                    <li>{t('more.about.technology.item2')}</li>
                    <li>{t('more.about.technology.item3')}</li>
                    <li>{t('more.about.technology.item4')}</li>
                    <li>{t('more.about.technology.item5')}</li>
                  </ul>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    📞 {t('more.about.contact.title')}
                  </h3>
                  <p>{t('more.about.contact.content')}</p>
                </section>

                <div className='mt-8 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-lg'>
                  <p className='text-sm text-[var(--accent-primary)]'>
                    <strong>{t('more.about.version.label')}:</strong> 1.0.0 |{' '}
                    <strong>{t('more.about.update.label')}:</strong> {t('more.about.update.date')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
