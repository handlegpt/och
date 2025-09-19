import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { PrivacyControls } from '../components/user/PrivacyControls'

export const PrivacyPage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'policy' | 'settings'>('policy')

  const tabs = [
    { key: 'policy', label: '隐私政策', icon: '📄' },
    { key: 'settings', label: '隐私设置', icon: '⚙️' },
  ] as const

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>🔒 隐私与安全</h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>
            了解我们如何保护您的隐私，并管理您的个人设置
          </p>
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
          {activeTab === 'policy' && (
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8'>
              <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>📄 隐私政策</h2>

              <div className='space-y-6 text-[var(--text-secondary)] leading-relaxed'>
                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    1. 信息收集
                  </h3>
                  <p>
                    我们收集您主动提供的信息，包括上传的图像、生成偏好设置和账户信息。
                    我们不会收集您的个人敏感信息，除非您明确同意。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    2. 信息使用
                  </h3>
                  <p>
                    我们使用收集的信息来提供AI图像生成服务、改善用户体验、
                    提供客户支持，以及进行必要的技术维护。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    3. 信息保护
                  </h3>
                  <p>
                    我们采用行业标准的安全措施保护您的信息，包括数据加密、
                    安全传输和访问控制。您的图像数据在生成完成后会被安全处理。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    4. 数据共享
                  </h3>
                  <p>
                    我们不会向第三方出售、交易或转让您的个人信息。
                    只有在法律要求或您明确同意的情况下，我们才会共享您的信息。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    5. 您的权利
                  </h3>
                  <p>
                    您有权访问、更正、删除您的个人信息，以及撤回同意。
                    如果您已登录，可以在隐私设置中管理这些选项。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    6. 联系我们
                  </h3>
                  <p>
                    如果您对隐私政策有任何疑问，请通过应用内的反馈功能联系我们。
                    我们会在24小时内回复您的询问。
                  </p>
                </section>

                <div className='mt-8 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-lg'>
                  <p className='text-sm text-[var(--accent-primary)]'>
                    <strong>最后更新：</strong> 2024年1月1日
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              {!user ? (
                <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8 text-center'>
                  <div className='text-6xl mb-4'>🔐</div>
                  <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>需要登录</h2>
                  <p className='text-[var(--text-secondary)] mb-6'>
                    要管理您的隐私设置，请先登录您的账户
                  </p>
                  <button className='px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'>
                    立即登录
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>
                    ⚙️ 隐私设置
                  </h2>
                  <PrivacyControls />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
