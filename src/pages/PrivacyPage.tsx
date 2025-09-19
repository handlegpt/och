import React from 'react'

export const PrivacyPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20'>
      <div className='container mx-auto px-4 py-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>🔒 隐私政策</h1>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto'>
            了解我们如何保护您的隐私和数据安全
          </p>
        </div>

        {/* 隐私政策内容 */}
        <div className='max-w-4xl mx-auto'>
          <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-8'>
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
                  如果您已登录，可以在个人中心的隐私设置中管理这些选项。
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

          {/* 提示信息 */}
          <div className='mt-8 p-6 bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] text-center'>
            <div className='text-4xl mb-4'>ℹ️</div>
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
              管理您的隐私设置
            </h3>
            <p className='text-[var(--text-secondary)] mb-4'>
              要管理您的个人隐私设置和数据权限，请登录后在个人中心或"更多"页面中进行设置。
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <a
                href='/profile'
                className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'
              >
                前往个人中心
              </a>
              <a
                href='/more'
                className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors duration-200'
              >
                更多设置
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
