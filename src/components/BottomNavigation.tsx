import React from 'react'
import { Link } from 'react-router-dom'

export const BottomNavigation: React.FC = () => {
  const productLinks = [
    { path: '/categories', label: 'AI Editor' },
    { path: '/categories', label: 'Features' },
    { path: '/social', label: 'Gallery' },
  ]

  const resourceLinks = [
    { path: '/pricing', label: 'Pricing' },
    { path: '/profile', label: 'Support' },
    { path: '/profile', label: 'API' },
  ]

  const companyLinks = [
    { path: '/profile', label: 'About' },
    { path: '/profile', label: 'Blog' },
    { path: '/profile', label: 'Contact' },
  ]

  return (
    <>
      {/* 完整Footer - 参考 Nano Banana AI */}
      <footer className='bg-[var(--bg-card-alpha)] backdrop-blur-lg border-t border-[var(--border-primary)] mt-20'>
        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* 左侧：公司信息和联系方式 */}
            <div className='space-y-6'>
              {/* Logo和描述 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-8 h-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>O</span>
                  </div>
                  <span className='text-xl font-bold text-[var(--text-primary)]'>och.ai</span>
                </div>
                <p className='text-[var(--text-secondary)] leading-relaxed max-w-md'>
                  Transform any image with simple text prompts. och.ai's advanced model delivers
                  consistent character editing and scene preservation.
                </p>
              </div>

              {/* 社交媒体图标 */}
              <div className='flex items-center gap-4'>
                <a
                  href='#'
                  className='w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors'
                >
                  <span className='text-sm'>𝕏</span>
                </a>
                <a
                  href='#'
                  className='w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors'
                >
                  <span className='text-sm'>📧</span>
                </a>
                <a
                  href='#'
                  className='w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors'
                >
                  <span className='text-sm'>💬</span>
                </a>
              </div>

              {/* 联系信息 */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                  Contact Us
                </h3>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm font-medium text-[var(--text-primary)]'>
                      Official Support Email
                    </p>
                    <a
                      href='mailto:support@och.ai'
                      className='text-sm text-[var(--accent-primary)] hover:underline'
                    >
                      support@och.ai
                    </a>
                    <p className='text-xs text-[var(--text-secondary)] mt-1'>
                      For technical support and customer service
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：链接分组 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Product */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Product</h3>
                <ul className='space-y-3'>
                  {productLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Resources</h3>
                <ul className='space-y-3'>
                  {resourceLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Company</h3>
                <ul className='space-y-3'>
                  {companyLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 底部版权和链接 */}
          <div className='border-t border-[var(--border-primary)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-[var(--text-secondary)]'>
              © 2025 • och.ai All rights reserved.
            </p>
            <div className='flex items-center gap-6'>
              <Link
                to='/privacy'
                className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                to='/more'
                className='text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
