import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from '../../i18n/context'
import { useAuth } from '../hooks/useAuth'
import { useGenerationState } from '../hooks/useGenerationState'
import { LoginPromptModal } from './LoginPromptModal'
import { MagicLinkModal } from './MagicLinkModal'

// Lazy load heavy components
const GenerationWorkflow = lazy(() =>
  import('./GenerationWorkflow').then(m => ({ default: m.GenerationWorkflow }))
)

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, signInWithGoogle, signInWithMagicLink } = useAuth()
  const [state, actions] = useGenerationState()

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false)
  
  // 从URL参数获取状态
  const selectedFeature = searchParams.get('feature')

  // 同步URL参数和状态
  useEffect(() => {
    if (selectedFeature && !state.selectedTransformation) {
      // 从URL参数恢复选中的功能
      const transformation = state.transformations.find(t => t.key === selectedFeature)
      if (transformation) {
        actions.setSelectedTransformation(transformation)
      }
    }
  }, [selectedFeature, state.transformations, state.selectedTransformation, actions])

  // 监听全局状态变化，当selectedTransformation被重置时，清除URL参数
  // 但是只有在用户明确返回选择时才重置URL，而不是因为其他操作
  React.useEffect(() => {
    if (!state.selectedTransformation && selectedFeature) {
      // 检查是否是因为用户点击了返回按钮或其他明确的操作
      // 如果是，则重置URL；如果不是，则保持URL不变
      const currentView = searchParams.get('view')
      if (currentView === 'create') {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete('feature')
        newSearchParams.set('view', 'features')
        setSearchParams(newSearchParams, { replace: true })
      }
    }
  }, [state.selectedTransformation, selectedFeature, searchParams, setSearchParams])

  const handleLoginRequired = useCallback(() => {
    setShowLoginPrompt(true)
  }, [])

  const handleLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false)
    if (signInWithGoogle) {
      signInWithGoogle()
    }
  }, [signInWithGoogle])

  const handleMagicLinkLogin = useCallback(
    async (email: string) => {
      if (signInWithMagicLink) {
        await signInWithMagicLink(email)
      }
    },
    [signInWithMagicLink]
  )

  const handleShowMagicLinkModal = useCallback(() => {
    setShowLoginPrompt(false)
    setShowMagicLinkModal(true)
  }, [])

  const handleStartCreating = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('view', 'categories')
    setSearchParams(newSearchParams, { replace: false })
  }, [searchParams, setSearchParams])

  const handleViewAllFeatures = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('view', 'features')
    setSearchParams(newSearchParams, { replace: false })
  }, [searchParams, setSearchParams])

  const handleFeatureClick = useCallback(
    (feature: any) => {
      // 从 TRANSFORMATIONS 中找到对应的转换
      const transformation = state.transformations.find(t => t.key === feature.id)
      if (transformation) {
        actions.setSelectedTransformation(transformation)
        // 更新URL参数
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set('view', 'create')
        newSearchParams.set('feature', feature.id)
        setSearchParams(newSearchParams, { replace: false })
      }
    },
    [actions, state.transformations, searchParams, setSearchParams]
  )

  // 如果用户选择了功能，显示生成界面
  // 检查URL参数或状态中是否有选中的功能
  const isCreateView = searchParams.get('view') === 'create'
  const hasSelectedFeature = state.selectedTransformation || selectedFeature
  
  if (isCreateView && hasSelectedFeature) {
    return (
      <div className='min-h-screen bg-[var(--bg-primary)]'>
        <main>
          <Suspense
            fallback={
              <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4'></div>
                  <p className='text-[var(--text-secondary)]'>加载中...</p>
                </div>
              </div>
            }
          >
            <GenerationWorkflow
              state={state}
              actions={actions}
              user={user}
              t={t}
              onLoginRequired={handleLoginRequired}
            />
          </Suspense>
        </main>

        {/* 登录提醒模态框 */}
        <Suspense fallback={null}>
          <LoginPromptModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            onGoogleLogin={handleLoginPrompt}
            onMagicLinkLogin={handleShowMagicLinkModal}
          />
        </Suspense>

        {/* Magic Link模态框 */}
        <Suspense fallback={null}>
          <MagicLinkModal
            isOpen={showMagicLinkModal}
            onClose={() => setShowMagicLinkModal(false)}
            onMagicLinkLogin={handleMagicLinkLogin}
          />
        </Suspense>
      </div>
    )
  }

  // 如果用户点击了"开始创作"或"查看所有功能"，显示功能选择界面
  if (searchParams.get('view') === 'categories' || searchParams.get('view') === 'features') {
    return (
      <div className='min-h-screen bg-[var(--bg-primary)]'>
        <main>
          <Suspense
            fallback={
              <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4'></div>
                  <p className='text-[var(--text-secondary)]'>加载中...</p>
                </div>
              </div>
            }
          >
            <GenerationWorkflow
              state={state}
              actions={actions}
              user={user}
              t={t}
              onLoginRequired={handleLoginRequired}
            />
          </Suspense>
        </main>

        {/* 登录提醒模态框 */}
        <Suspense fallback={null}>
          <LoginPromptModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            onGoogleLogin={handleLoginPrompt}
            onMagicLinkLogin={handleShowMagicLinkModal}
          />
        </Suspense>

        {/* Magic Link模态框 */}
        <Suspense fallback={null}>
          <MagicLinkModal
            isOpen={showMagicLinkModal}
            onClose={() => setShowMagicLinkModal(false)}
            onMagicLinkLogin={handleMagicLinkLogin}
          />
        </Suspense>
      </div>
    )
  }

  // 主要功能预览
  const featuredTransformations = [
    {
      id: 'customPrompt',
      name: t('transformations.effects.customPrompt.title'),
      description: t('transformations.effects.customPrompt.description'),
      icon: '✨',
      category: 'creative',
    },
    {
      id: 'hdEnhance',
      name: t('transformations.effects.hdEnhance.title'),
      description: t('transformations.effects.hdEnhance.description'),
      icon: '🔍',
      category: 'enhancement',
    },
    {
      id: 'figurine',
      name: t('transformations.effects.figurine.title'),
      description: t('transformations.effects.figurine.description'),
      icon: '🎭',
      category: '3d',
    },
    {
      id: 'cosplay',
      name: t('transformations.effects.cosplay.title'),
      description: t('transformations.effects.cosplay.description'),
      icon: '🎭',
      category: 'style',
    },
  ]

  return (
    <div className='min-h-screen bg-[var(--bg-primary)]'>
      {/* Hero Section */}
      <section className='relative overflow-hidden min-h-screen flex items-center'>
        {/* Animated Background */}
        <div className='absolute inset-0'>
          {/* Gradient Background */}
          <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/10 to-transparent'></div>

          {/* Floating Particles */}
          <div className='absolute inset-0'>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className='absolute w-2 h-2 bg-[var(--accent-primary)]/30 rounded-full animate-float'
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Geometric Shapes */}
          <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent rounded-full blur-xl animate-pulse'></div>
          <div
            className='absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-l from-[var(--accent-secondary)]/20 to-transparent rounded-full blur-xl animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-[var(--accent-primary)]/15 to-[var(--accent-secondary)]/15 rounded-full blur-lg animate-bounce'
            style={{ animationDuration: '4s' }}
          ></div>
        </div>

        <div className='relative container mx-auto px-4 py-20'>
          <div className='text-center max-w-5xl mx-auto'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-card-alpha)] backdrop-blur-lg border border-[var(--border-primary)] rounded-full text-sm text-[var(--text-secondary)] mb-8 animate-fade-in'>
              <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
              {t('home.hero.badge')}
            </div>

            {/* Main Title */}
            <h1 className='text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight'>
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] animate-gradient-x'>
                {t('home.hero.title')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className='text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)] mb-12 leading-relaxed max-w-3xl mx-auto'>
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'>
              <button
                onClick={handleStartCreating}
                className='group relative px-10 py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-[var(--accent-primary)]/25 transform hover:scale-105 transition-all duration-300 overflow-hidden'
              >
                <span className='relative z-10 flex items-center gap-3'>
                  <span>🚀</span>
                  {t('home.hero.cta')}
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-[var(--accent-primary-hover)] to-[var(--accent-secondary-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className='group px-10 py-5 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-lg rounded-2xl hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 backdrop-blur-lg bg-[var(--bg-card-alpha)]/50'
              >
                <span className='flex items-center gap-3'>
                  <span>👤</span>
                  {t('home.hero.explore')}
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto'>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mb-2'>
                  10K+
                </div>
                <div className='text-[var(--text-secondary)]'>{t('home.hero.stats.users')}</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-[var(--accent-secondary)] mb-2'>
                  50+
                </div>
                <div className='text-[var(--text-secondary)]'>{t('home.hero.stats.models')}</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mb-2'>
                  99.9%
                </div>
                <div className='text-[var(--text-secondary)]'>{t('home.hero.stats.uptime')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <div className='w-6 h-10 border-2 border-[var(--accent-primary)] rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-[var(--accent-primary)] rounded-full mt-2 animate-pulse'></div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className='py-32 relative'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-sm text-[var(--accent-primary)] mb-6'>
              <span>✨</span>
              {t('home.features.badge')}
            </div>
            <h2 className='text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6'>
              {t('home.features.title')}
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed'>
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
            {featuredTransformations.map((feature, index) => (
              <div
                key={feature.id}
                className='group relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-3xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/10 hover:-translate-y-4 cursor-pointer overflow-hidden'
                onClick={() => handleFeatureClick(feature)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Hover Effect Background */}
                <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                {/* Icon */}
                <div className='relative mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300'>
                    {feature.icon}
                  </div>
                  <div className='absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    →
                  </div>
                </div>

                {/* Content */}
                <h3 className='text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors duration-300'>
                  {feature.name}
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
              </div>
            ))}
          </div>

          <div className='text-center'>
            <button
              onClick={handleViewAllFeatures}
              className='group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden'
            >
              <span className='relative z-10 flex items-center gap-3'>
                <span>🎨</span>
                {t('home.features.viewAll')}
                <span className='group-hover:translate-x-1 transition-transform duration-300'>
                  →
                </span>
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-[var(--accent-primary-hover)] to-[var(--accent-secondary-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 bg-[var(--bg-secondary)]'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4'>
              {t('home.howItWorks.title')}
            </h2>
            <p className='text-lg text-[var(--text-secondary)] max-w-2xl mx-auto'>
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                step: 1,
                icon: '📸',
                title: t('home.howItWorks.step1.title'),
                description: t('home.howItWorks.step1.description'),
              },
              {
                step: 2,
                icon: '🎨',
                title: t('home.howItWorks.step2.title'),
                description: t('home.howItWorks.step2.description'),
              },
              {
                step: 3,
                icon: '✨',
                title: t('home.howItWorks.step3.title'),
                description: t('home.howItWorks.step3.description'),
              },
            ].map((step, _index) => (
              <div key={step.step} className='text-center'>
                <div className='relative mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center text-2xl mx-auto mb-4'>
                    {step.icon}
                  </div>
                  <div className='absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold'>
                    {step.step}
                  </div>
                </div>
                <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-3'>
                  {step.title}
                </h3>
                <p className='text-[var(--text-secondary)]'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4'>
            {t('home.cta.title')}
          </h2>
          <p className='text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto'>
            {t('home.cta.subtitle')}
          </p>
          <button
            onClick={handleStartCreating}
            className='px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg'
          >
            {t('home.cta.button')}
          </button>
        </div>
      </section>

      {/* 登录提醒模态框 */}
      <Suspense fallback={null}>
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          onGoogleLogin={handleLoginPrompt}
          onMagicLinkLogin={handleShowMagicLinkModal}
        />
      </Suspense>

      {/* Magic Link模态框 */}
      <Suspense fallback={null}>
        <MagicLinkModal
          isOpen={showMagicLinkModal}
          onClose={() => setShowMagicLinkModal(false)}
          onMagicLinkLogin={handleMagicLinkLogin}
        />
      </Suspense>

      {/* 添加自定义动画样式 */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
