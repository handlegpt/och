import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { UserSettings } from '../components/user/UserSettings'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import ThemeSwitcher from '../../components/ThemeSwitcher'

export const MorePage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>('settings')

  const tabs = [
    { key: 'settings', label: '设置', icon: '⚙️' },
    { key: 'about', label: '关于', icon: 'ℹ️' },
  ] as const

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>⚙️ 应用设置</h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>
            管理您的应用设置和了解更多信息
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
          {activeTab === 'settings' && (
            <div className='space-y-8'>
              {!user ? (
                <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8 text-center'>
                  <div className='text-6xl mb-4'>🔐</div>
                  <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>需要登录</h2>
                  <p className='text-[var(--text-secondary)] mb-6'>
                    要管理您的设置，请先登录您的账户
                  </p>
                  <button className='px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'>
                    立即登录
                  </button>
                </div>
              ) : (
                <>
                  {/* 应用设置 */}
                  <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
                    <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
                      🌐 应用设置
                    </h2>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-medium text-[var(--text-primary)]'>语言设置</h3>
                          <p className='text-sm text-[var(--text-secondary)]'>选择您的首选语言</p>
                        </div>
                        <LanguageSwitcher />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-medium text-[var(--text-primary)]'>主题设置</h3>
                          <p className='text-sm text-[var(--text-secondary)]'>选择明暗主题</p>
                        </div>
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>

                  {/* 用户设置 */}
                  <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
                    <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-4'>
                      👤 用户设置
                    </h2>
                    <UserSettings />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8'>
              <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>ℹ️ 关于应用</h2>

              <div className='space-y-6 text-[var(--text-secondary)] leading-relaxed'>
                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    🎨 Och AI
                  </h3>
                  <p>
                    一个强大的AI图像生成和编辑平台，提供50+种专业级AI效果，
                    包括3D手办、动漫风格、高清增强等功能。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    ✨ 主要功能
                  </h3>
                  <ul className='list-disc list-inside space-y-2 ml-4'>
                    <li>AI图像生成与编辑</li>
                    <li>多种艺术风格转换</li>
                    <li>高清图像增强</li>
                    <li>3D效果生成</li>
                    <li>自定义提示词</li>
                    <li>批量处理支持</li>
                  </ul>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    🚀 技术特点
                  </h3>
                  <ul className='list-disc list-inside space-y-2 ml-4'>
                    <li>基于Google Gemini AI技术</li>
                    <li>实时生成预览</li>
                    <li>云端安全存储</li>
                    <li>多语言支持</li>
                    <li>响应式设计</li>
                  </ul>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    📞 联系我们
                  </h3>
                  <p>
                    如果您有任何问题或建议，请通过应用内的反馈功能联系我们。
                    我们致力于为您提供最佳的AI图像生成体验。
                  </p>
                </section>

                <div className='mt-8 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-lg'>
                  <p className='text-sm text-[var(--accent-primary)]'>
                    <strong>版本：</strong> 1.0.0 | <strong>更新：</strong> 2024年1月
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
