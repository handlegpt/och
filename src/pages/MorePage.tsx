import React, { useState } from 'react'

export const MorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'about'>('contact')

  const tabs = [
    { key: 'contact', label: '联系', icon: '📞' },
    { key: 'about', label: '关于', icon: 'ℹ️' },
  ] as const

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>📱 更多</h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>联系我们和了解更多信息</p>
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
              <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>📞 联系我们</h2>

              <div className='space-y-6 text-[var(--text-secondary)] leading-relaxed'>
                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    💬 反馈与建议
                  </h3>
                  <p>
                    我们非常重视您的反馈！如果您在使用过程中遇到任何问题，
                    或者有改进建议，请随时联系我们。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    🛠️ 技术支持
                  </h3>
                  <p>
                    遇到技术问题？我们的技术支持团队会尽快为您解决。
                    请详细描述您遇到的问题，我们会提供专业的帮助。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    💡 功能请求
                  </h3>
                  <p>
                    有新的功能想法？我们欢迎您的创意！ 告诉我们您希望看到的新功能，我们会认真考虑。
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-3'>
                    📧 联系方式
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>📧</span>
                      <div>
                        <p className='font-medium text-[var(--text-primary)]'>邮箱</p>
                        <p className='text-sm'>support@ochai.com</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>💬</span>
                      <div>
                        <p className='font-medium text-[var(--text-primary)]'>在线客服</p>
                        <p className='text-sm'>工作日 9:00-18:00</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>📱</span>
                      <div>
                        <p className='font-medium text-[var(--text-primary)]'>应用内反馈</p>
                        <p className='text-sm'>在个人中心提交反馈</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className='mt-8 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-lg'>
                  <p className='text-sm text-[var(--accent-primary)]'>
                    <strong>响应时间：</strong> 我们会在24小时内回复您的邮件
                  </p>
                </div>
              </div>
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
