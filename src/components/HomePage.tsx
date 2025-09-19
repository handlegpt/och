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

  // 如果用户点击了"开始创作"或"查看所有功能"，显示功能浏览界面
  if (searchParams.get('view') === 'categories') {
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
                className='group relative cursor-pointer overflow-hidden transform-gpu perspective-1000'
                onClick={() => handleFeatureClick(feature)}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                }}
              >
                {/* 3D Card Container */}
                <div className='relative w-full h-full transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-5 group-hover:scale-105'>
                  {/* Outer Glow Ring */}
                  <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl scale-110 animate-pulse'></div>

                  {/* Main Card */}
                  <div className='relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-3xl p-8 border border-[var(--border-primary)] group-hover:border-[var(--accent-primary)] transition-all duration-700 shadow-2xl group-hover:shadow-[var(--accent-primary)]/30'>
                    {/* Animated Background Grid */}
                    <div className='absolute inset-0 rounded-3xl opacity-20'>
                      <div
                        className='absolute inset-0'
                        style={{
                          backgroundImage: `
                          linear-gradient(rgba(var(--accent-primary-rgb), 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(var(--accent-primary-rgb), 0.1) 1px, transparent 1px)
                        `,
                          backgroundSize: '20px 20px',
                          animation: 'gridMove 20s linear infinite',
                        }}
                      ></div>
                    </div>

                    {/* Floating Particles */}
                    <div className='absolute inset-0 overflow-hidden rounded-3xl'>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className='absolute w-1 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full animate-float'
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Icon Section with 3D Effects */}
                    <div className='relative mb-6'>
                      {/* Icon Background with Multiple Layers */}
                      <div className='absolute inset-0 w-24 h-24 bg-gradient-to-r from-[var(--accent-primary)]/40 to-[var(--accent-secondary)]/40 rounded-3xl blur-2xl scale-0 group-hover:scale-125 transition-transform duration-700'></div>
                      <div className='absolute inset-0 w-20 h-20 bg-gradient-to-br from-[var(--accent-primary)]/30 to-[var(--accent-secondary)]/30 rounded-2xl blur-lg scale-0 group-hover:scale-110 transition-transform duration-500'></div>

                      {/* Main Icon Container with 3D Effect */}
                      <div className='relative w-16 h-16 bg-gradient-to-br from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/20 to-[var(--accent-primary)]/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 group-hover:-translate-y-2 transition-all duration-700 shadow-2xl group-hover:shadow-[var(--accent-primary)]/50'>
                        <span className='group-hover:animate-bounce group-hover:drop-shadow-lg'>
                          {feature.icon}
                        </span>
                      </div>

                      {/* Floating Action Indicator with Enhanced Animation */}
                      <div className='absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100 shadow-2xl group-hover:shadow-[var(--accent-primary)]/50'>
                        <span className='animate-bounce text-lg'>→</span>
                      </div>

                      {/* Enhanced Sparkle Effects */}
                      <div className='absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping shadow-lg'></div>
                      <div
                        className='absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping shadow-lg'
                        style={{ animationDelay: '0.5s' }}
                      ></div>
                      <div
                        className='absolute top-1/2 left-0 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-ping shadow-lg'
                        style={{ animationDelay: '1s' }}
                      ></div>
                    </div>

                    {/* Content with Enhanced Typography */}
                    <div className='relative z-10'>
                      <h3 className='text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-[var(--accent-secondary)] transition-all duration-700 group-hover:drop-shadow-lg'>
                        {feature.name}
                      </h3>
                      <p className='text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-700 group-hover:drop-shadow-md'>
                        {feature.description}
                      </p>
                    </div>

                    {/* Enhanced Bottom Progress Bar */}
                    <div className='absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full shadow-lg'></div>

                    {/* Corner Accents with Enhanced Effects */}
                    <div className='absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg'></div>
                    <div className='absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse shadow-lg'></div>
                    <div className='absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-ping'></div>
                    <div className='absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-800 animate-ping'></div>
                  </div>

                  {/* Hover Overlay with Enhanced Gradient */}
                  <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl'></div>

                  {/* Shimmer Effect */}
                  <div className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4'>
              {t('home.demo.title')}
            </h2>
            <p className='text-lg text-[var(--text-secondary)] max-w-2xl mx-auto'>
              {t('home.demo.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Demo Card 1 - 3D Figurine */}
            <div className='group bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20 hover:-translate-y-4 cursor-pointer overflow-hidden'>
              <div className='relative mb-4'>
                {/* Before/After Image Container */}
                <div className='aspect-square bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl overflow-hidden relative'>
                  {/* Before Image Placeholder */}
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto'>
                        📸
                      </div>
                      <div className='text-xs text-gray-600 font-medium'>原始照片</div>
                    </div>
                  </div>

                  {/* After Image Placeholder */}
                  <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                    <div className='text-center'>
                      <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto animate-bounce'>
                        🎭
                      </div>
                      <div className='text-xs text-white font-medium drop-shadow-lg'>
                        3D手办效果
                      </div>
                    </div>
                  </div>

                  {/* Transformation Arrow */}
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse'>
                    <span className='text-[var(--accent-primary)] font-bold'>→</span>
                  </div>
                </div>

                <div className='absolute top-2 right-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg'>
                  3D手办
                </div>
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors duration-300'>
                普通照片 → 3D手办
              </h3>
              <p className='text-[var(--text-secondary)] text-sm mb-4 group-hover:text-[var(--text-primary)] transition-colors duration-300'>
                将你的照片转换为精美的3D收藏品手办
              </p>
              <div className='flex items-center justify-between text-xs text-[var(--text-secondary)]'>
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                  处理时间: 30秒
                </span>
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                  分辨率: 1024x1024
                </span>
              </div>
            </div>

            {/* Demo Card 2 - Anime Style */}
            <div className='group bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20 hover:-translate-y-4 cursor-pointer overflow-hidden'>
              <div className='relative mb-4'>
                {/* Before/After Image Container */}
                <div className='aspect-square bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl overflow-hidden relative'>
                  {/* Before Image Placeholder */}
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto'>
                        👤
                      </div>
                      <div className='text-xs text-gray-600 font-medium'>真人照片</div>
                    </div>
                  </div>

                  {/* After Image Placeholder */}
                  <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/20 to-[var(--accent-primary)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                    <div className='text-center'>
                      <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto animate-bounce'>
                        🎨
                      </div>
                      <div className='text-xs text-white font-medium drop-shadow-lg'>动漫风格</div>
                    </div>
                  </div>

                  {/* Transformation Arrow */}
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse'>
                    <span className='text-[var(--accent-secondary)] font-bold'>→</span>
                  </div>
                </div>

                <div className='absolute top-2 right-2 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg'>
                  动漫风格
                </div>
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-secondary)] transition-colors duration-300'>
                真人照片 → 动漫角色
              </h3>
              <p className='text-[var(--text-secondary)] text-sm mb-4 group-hover:text-[var(--text-primary)] transition-colors duration-300'>
                将真实照片转换为精美的动漫风格图像
              </p>
              <div className='flex items-center justify-between text-xs text-[var(--text-secondary)]'>
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                  处理时间: 25秒
                </span>
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                  分辨率: 1024x1024
                </span>
              </div>
            </div>

            {/* Demo Card 3 - HD Enhance */}
            <div className='group bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20 hover:-translate-y-4 cursor-pointer overflow-hidden'>
              <div className='relative mb-4'>
                {/* Before/After Image Container */}
                <div className='aspect-square bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl overflow-hidden relative'>
                  {/* Before Image Placeholder */}
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto'>
                        📷
                      </div>
                      <div className='text-xs text-gray-600 font-medium'>模糊照片</div>
                    </div>
                  </div>

                  {/* After Image Placeholder */}
                  <div className='absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                    <div className='text-center'>
                      <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto animate-bounce'>
                        🔍
                      </div>
                      <div className='text-xs text-white font-medium drop-shadow-lg'>高清图像</div>
                    </div>
                  </div>

                  {/* Transformation Arrow */}
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse'>
                    <span className='text-green-500 font-bold'>→</span>
                  </div>
                </div>

                <div className='absolute top-2 right-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg'>
                  高清增强
                </div>
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-green-500 transition-colors duration-300'>
                模糊照片 → 高清图像
              </h3>
              <p className='text-[var(--text-secondary)] text-sm mb-4 group-hover:text-[var(--text-primary)] transition-colors duration-300'>
                AI智能提升图像清晰度和细节质量
              </p>
              <div className='flex items-center justify-between text-xs text-[var(--text-secondary)]'>
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                  处理时间: 20秒
                </span>
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                  分辨率: 2048x2048
                </span>
              </div>
            </div>
          </div>

          <div className='text-center mt-12'>
            <button
              onClick={handleStartCreating}
              className='px-8 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
            >
              {t('home.demo.seeMore')}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 bg-[var(--bg-secondary)] relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-sm text-[var(--accent-primary)] mb-6'>
              <span>⚡</span>
              简单三步
            </div>
            <h2 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4'>
              {t('home.howItWorks.title')}
            </h2>
            <p className='text-lg text-[var(--text-secondary)] max-w-2xl mx-auto'>
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className='relative'>
            {/* Connection Lines */}
            <div className='hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent transform -translate-y-1/2'></div>
            <div className='hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-[var(--accent-primary)]/50 via-[var(--accent-secondary)]/50 to-[var(--accent-primary)]/50 transform -translate-y-1/2 animate-pulse'></div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
              {[
                {
                  step: 1,
                  icon: '📸',
                  title: t('home.howItWorks.step1.title'),
                  description: t('home.howItWorks.step1.description'),
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-500/10 to-cyan-500/10',
                },
                {
                  step: 2,
                  icon: '🎨',
                  title: t('home.howItWorks.step2.title'),
                  description: t('home.howItWorks.step2.description'),
                  color: 'from-[var(--accent-primary)] to-[var(--accent-secondary)]',
                  bgColor: 'from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10',
                },
                {
                  step: 3,
                  icon: '✨',
                  title: t('home.howItWorks.step3.title'),
                  description: t('home.howItWorks.step3.description'),
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-500/10 to-emerald-500/10',
                },
              ].map((step, index) => (
                <div key={step.step} className='relative group cursor-pointer'>
                  {/* Step Card */}
                  <div className='relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-3xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/30 hover:-translate-y-6 text-center overflow-hidden transform-gpu'>
                    {/* Outer Glow Ring */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl scale-110 animate-pulse`}
                    ></div>

                    {/* Animated Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                    ></div>

                    {/* Floating Particles */}
                    <div className='absolute inset-0 overflow-hidden'>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className='absolute w-1 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full animate-float'
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Step Number Badge with Enhanced Effects */}
                    <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 z-20'>
                      <div className='relative'>
                        {/* Badge Glow */}
                        <div
                          className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${step.color} rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-500`}
                        ></div>

                        {/* Main Badge */}
                        <div
                          className={`relative w-18 h-18 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border-4 border-[var(--bg-card-alpha)]`}
                        >
                          <span className='group-hover:animate-bounce drop-shadow-lg leading-none'>
                            {step.step}
                          </span>
                        </div>

                        {/* Badge Sparkles */}
                        <div className='absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping shadow-lg'></div>
                        <div
                          className='absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping shadow-lg'
                          style={{ animationDelay: '0.5s' }}
                        ></div>
                      </div>
                    </div>

                    {/* Icon Container with 3D Effects */}
                    <div className='relative mb-8 mt-10'>
                      {/* Multiple Glow Layers */}
                      <div
                        className={`absolute inset-0 w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl blur-2xl scale-0 group-hover:scale-125 transition-transform duration-700 mx-auto`}
                      ></div>
                      <div
                        className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl blur-lg scale-0 group-hover:scale-110 transition-transform duration-500 mx-auto`}
                      ></div>

                      {/* Main Icon Container */}
                      <div
                        className={`relative w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-4xl mx-auto group-hover:scale-110 group-hover:rotate-12 group-hover:-translate-y-2 transition-all duration-700 shadow-2xl group-hover:shadow-[var(--accent-primary)]/50`}
                      >
                        <span className='group-hover:animate-bounce group-hover:drop-shadow-lg'>
                          {step.icon}
                        </span>
                      </div>

                      {/* Icon Decorative Elements */}
                      <div className='absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping'></div>
                      <div
                        className='absolute bottom-0 left-0 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping'
                        style={{ animationDelay: '0.5s' }}
                      ></div>
                      <div
                        className='absolute top-1/2 left-0 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-ping'
                        style={{ animationDelay: '1s' }}
                      ></div>
                    </div>

                    {/* Content with Enhanced Typography */}
                    <div className='relative z-10'>
                      <h3 className='text-xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-[var(--accent-secondary)] transition-all duration-700 group-hover:drop-shadow-lg'>
                        {step.title}
                      </h3>
                      <p className='text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-700 leading-relaxed group-hover:drop-shadow-md'>
                        {step.description}
                      </p>
                    </div>

                    {/* Enhanced Bottom Progress Bar */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full shadow-lg`}
                    ></div>

                    {/* Corner Accents */}
                    <div className='absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg'></div>
                    <div className='absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse shadow-lg'></div>
                    <div className='absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-ping'></div>
                    <div className='absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-800 animate-ping'></div>
                  </div>

                  {/* Enhanced Connection Arrow (Mobile) */}
                  {index < 2 && (
                    <div className='md:hidden flex justify-center mt-8 mb-8'>
                      <div className='relative'>
                        {/* Arrow Glow */}
                        <div className='absolute inset-0 w-12 h-12 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full blur-lg scale-0 animate-pulse'></div>

                        {/* Main Arrow */}
                        <div className='relative w-10 h-10 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center text-white text-lg font-bold animate-bounce shadow-2xl'>
                          ↓
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className='py-20 relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)]'>
        {/* Enhanced Background Effects */}
        <div className='absolute inset-0'>
          {/* Floating Orbs */}
          <div className='absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-[var(--accent-primary)]/15 to-transparent rounded-full blur-2xl animate-pulse'></div>
          <div
            className='absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-l from-[var(--accent-secondary)]/15 to-transparent rounded-full blur-2xl animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-full blur-xl animate-pulse'
            style={{ animationDelay: '2s' }}
          ></div>

          {/* Grid Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                animation: 'gridMove 30s linear infinite',
              }}
            ></div>
          </div>
        </div>

        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-24'>
            <div className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[var(--accent-secondary)]/10 to-[var(--accent-primary)]/10 border border-[var(--accent-secondary)]/30 rounded-full text-sm text-[var(--accent-secondary)] mb-8 shadow-lg backdrop-blur-lg'>
              <span className='text-lg animate-bounce'>🎯</span>
              <span className='font-semibold'>应用场景</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6'>
              <span className='bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] bg-clip-text text-transparent'>
                {t('home.useCases.title')}
              </span>
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed'>
              {t('home.useCases.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
            {(t('home.useCases.cases') as unknown as any[]).map((useCase: any, index: number) => (
              <div
                key={index}
                className='group relative cursor-pointer transform-gpu'
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                }}
              >
                {/* Card Container */}
                <div className='relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-3xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/30 hover:-translate-y-8 text-center overflow-hidden'>
                  {/* Outer Glow Ring */}
                  <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl scale-110 animate-pulse'></div>

                  {/* Animated Background */}
                  <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/8 via-transparent to-[var(--accent-secondary)]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>

                  {/* Floating Particles */}
                  <div className='absolute inset-0 overflow-hidden'>
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className='absolute w-1 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full animate-float'
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Icon Section with Enhanced Effects */}
                  <div className='relative mb-8'>
                    {/* Multiple Glow Layers */}
                    <div className='absolute inset-0 w-24 h-24 bg-gradient-to-r from-[var(--accent-primary)]/40 to-[var(--accent-secondary)]/40 rounded-3xl blur-2xl scale-0 group-hover:scale-125 transition-transform duration-700 mx-auto'></div>
                    <div className='absolute inset-0 w-20 h-20 bg-gradient-to-r from-[var(--accent-primary)]/30 to-[var(--accent-secondary)]/30 rounded-2xl blur-lg scale-0 group-hover:scale-110 transition-transform duration-500 mx-auto'></div>

                    {/* Main Icon Container */}
                    <div className='relative w-20 h-20 bg-gradient-to-br from-[var(--accent-primary)]/25 via-[var(--accent-secondary)]/25 to-[var(--accent-primary)]/25 rounded-2xl flex items-center justify-center text-5xl mx-auto group-hover:scale-110 group-hover:rotate-12 group-hover:-translate-y-2 transition-all duration-700 shadow-2xl group-hover:shadow-[var(--accent-primary)]/50'>
                      <span className='group-hover:animate-bounce group-hover:drop-shadow-lg'>
                        {useCase.icon}
                      </span>
                    </div>

                    {/* Enhanced Sparkle Effects */}
                    <div className='absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping shadow-lg'></div>
                    <div
                      className='absolute bottom-0 left-0 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping shadow-lg'
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                    <div
                      className='absolute top-1/2 left-0 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-ping'
                      style={{ animationDelay: '1s' }}
                    ></div>
                    <div
                      className='absolute top-0 left-1/2 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-800 animate-ping'
                      style={{ animationDelay: '1.5s' }}
                    ></div>
                  </div>

                  {/* Content with Enhanced Typography */}
                  <div className='relative z-10'>
                    <h3 className='text-xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-[var(--accent-secondary)] transition-all duration-700 group-hover:drop-shadow-lg'>
                      {useCase.title}
                    </h3>
                    <p className='text-[var(--text-secondary)] text-sm leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-700 group-hover:drop-shadow-md'>
                      {useCase.description}
                    </p>
                  </div>

                  {/* Enhanced Bottom Progress Bar */}
                  <div className='absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full shadow-lg'></div>

                  {/* Corner Accents with Enhanced Effects */}
                  <div className='absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg'></div>
                  <div className='absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse shadow-lg'></div>
                  <div className='absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-ping'></div>
                  <div className='absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-800 animate-ping'></div>
                </div>

                {/* Enhanced Hover Overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/8 via-transparent to-[var(--accent-secondary)]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl'></div>

                {/* Shimmer Effect */}
                <div className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                </div>
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
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-10px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(-20px) rotate(180deg) scale(1);
          }
          75% {
            transform: translateY(-10px) rotate(270deg) scale(1.1);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9) rotateX(20deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 50px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
          }
        }

        @keyframes rotate3d {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(5deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(0deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(-5deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotate(5deg);
            opacity: 0.8;
          }
          70% {
            transform: scale(0.9) rotate(-2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .animate-rotate3d {
          animation: rotate3d 8s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
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

        /* 3D Perspective Effects */
        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-12 {
          transform: rotateY(12deg);
        }

        .rotate-x-5 {
          transform: rotateX(5deg);
        }

        /* Enhanced hover effects */
        .feature-card {
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.8s ease-out;
        }

        .feature-card:hover::before {
          left: 100%;
        }

        /* Glass morphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Neon glow effect */
        .neon-glow {
          box-shadow: 
            0 0 5px rgba(255, 255, 255, 0.5),
            0 0 10px rgba(255, 255, 255, 0.3),
            0 0 15px rgba(255, 255, 255, 0.2);
        }

        /* Holographic effect */
        .holographic {
          background: linear-gradient(45deg, 
            rgba(255, 0, 150, 0.1), 
            rgba(0, 255, 255, 0.1), 
            rgba(255, 255, 0, 0.1), 
            rgba(255, 0, 150, 0.1)
          );
          background-size: 400% 400%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
