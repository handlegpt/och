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

  return (
    <div className='min-h-screen bg-[var(--bg-primary)]'>
      {/* Hero Section - 重新设计 */}
      <section className='relative overflow-hidden min-h-screen flex items-center'>
        {/* Background Effects */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/5 to-transparent'></div>
          <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent rounded-full blur-xl animate-pulse'></div>
          <div
            className='absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-l from-[var(--accent-secondary)]/20 to-transparent rounded-full blur-xl animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className='relative container mx-auto px-4 py-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left Column - 主要内容 */}
            <div className='text-center lg:text-left'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-card-alpha)] backdrop-blur-lg border border-[var(--border-primary)] rounded-full text-sm text-[var(--text-secondary)] mb-6'>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                Powered by Nano Banana AI
              </div>

              {/* Main Title */}
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight'>
                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)]'>
                  Transform Every Photo Into Art
                </span>
              </h1>

              {/* 具体副标题 */}
              <p className='text-xl md:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed'>
                Upload your photo → AI transforms it into a painting, sketch, cartoon, or unique
                artwork in seconds.
              </p>

              {/* 前后对比展示 */}
              <div className='mb-8'>
                <div className='flex items-center justify-center lg:justify-start gap-4 mb-4'>
                  <div className='text-center'>
                    <div className='w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center text-gray-600 text-sm font-medium'>
                      Before
                    </div>
                    <p className='text-xs text-[var(--text-secondary)] mt-2'>Original Photo</p>
                  </div>
                  <div className='text-2xl text-[var(--accent-primary)]'>→</div>
                  <div className='text-center'>
                    <div className='w-24 h-24 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center text-white text-sm font-medium'>
                      After
                    </div>
                    <p className='text-xs text-[var(--text-secondary)] mt-2'>AI Artwork</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8'>
                <button
                  onClick={handleStartCreating}
                  className='group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-[var(--accent-primary)]/25 transform hover:scale-105 transition-all duration-300'
                >
                  <span className='flex items-center gap-2'>
                    <span>🚀</span>
                    Try Free Now
                  </span>
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className='group px-8 py-4 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-lg rounded-xl hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 backdrop-blur-lg bg-[var(--bg-card-alpha)]/50'
                >
                  <span className='flex items-center gap-2'>
                    <span>💎</span>
                    Go Pro
                  </span>
                </button>
              </div>

              {/* 免费额度提示 */}
              <div className='text-sm text-[var(--text-secondary)] mb-8'>
                ✨ 3 free generations • No credit card required • Powered by Nano Banana AI
              </div>
            </div>

            {/* Right Column - 演示图片 */}
            <div className='relative'>
              <div className='relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] shadow-2xl'>
                {/* 演示图片轮播 */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-4'>
                    <div className='aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm'>
                      Original
                    </div>
                    <div className='aspect-square bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 rounded-lg flex items-center justify-center text-[var(--accent-primary)] text-sm font-medium'>
                      → 3D Figurine
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div className='aspect-square bg-gradient-to-br from-[var(--accent-secondary)]/20 to-pink-500/20 rounded-lg flex items-center justify-center text-[var(--accent-secondary)] text-sm font-medium'>
                      → Anime Style
                    </div>
                    <div className='aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-purple-500 text-sm font-medium'>
                      → Plushie
                    </div>
                  </div>
                </div>

                {/* 技术标识 */}
                <div className='absolute -bottom-3 -right-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg'>
                  Powered by Nano Banana AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section - 参考 Nano Banana AI */}
      <section className='py-20 bg-white relative overflow-hidden'>
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-black mb-6'>
              Advanced och.ai Features
            </h2>
            <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
              Discover why och.ai utilizing advanced AI models leads the industry with revolutionary
              image editing capabilities and natural language processing.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: '○',
                title: 'Prompt-Based Local Edits',
                description:
                  'Make precise, context-aware updates with och.ai without breaking composition. Superior to traditional image editing tools.',
                color: 'text-yellow-500',
              },
              {
                icon: '▬',
                title: 'Multi-Image Fusion',
                description:
                  'Blend multiple images seamlessly with och.ai technology. Advanced multi-image context understanding for complex compositions.',
                color: 'text-yellow-500',
              },
              {
                icon: '▮',
                title: 'World Knowledge Integration',
                description:
                  "Leverage advanced AI's vast knowledge base for contextually accurate image generation. och.ai model understands real-world relationships and semantics.",
                color: 'text-yellow-500',
              },
              {
                icon: '👥',
                title: 'Character Identity Preservation',
                description:
                  'Maintain perfect facial identity and stylistic consistency across edits. Leading LMArena och.ai performance in character consistency.',
                color: 'text-yellow-500',
              },
              {
                icon: '🏔️',
                title: 'Scene-Aware Processing',
                description:
                  'Preserve lighting, depth, and composition while applying targeted edits. Superior scene integration compared to other AI models.',
                color: 'text-yellow-500',
              },
              {
                icon: '★',
                title: 'Professional Content Creation',
                description:
                  'Generate consistent AI-powered content for social media, marketing, and storytelling. Learn how to use och.ai for professional workflows.',
                color: 'text-yellow-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className='group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg text-center'
              >
                <div
                  className={`w-12 h-12 ${feature.color} text-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className='text-lg font-bold text-black mb-3'>{feature.title}</h3>
                <p className='text-gray-600 text-sm leading-relaxed'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用流程区域 - How it works */}
      <section className='py-20 relative overflow-hidden'>
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 rounded-full text-sm text-[var(--accent-secondary)] mb-6'>
              <span>⚡</span>
              How It Works
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6'>
              Simple 3-Step Process
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed'>
              Transform your photos into stunning artwork in just three easy steps
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
            {/* Connection Lines */}
            <div className='hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent transform -translate-y-1/2'></div>

            {[
              {
                step: 1,
                icon: '📸',
                title: 'Upload Your Photo',
                description: 'Choose any image - JPEG, PNG, or WebP formats up to 5MB',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: 2,
                icon: '🎨',
                title: 'Select Art Style',
                description:
                  'Pick from 50+ AI effects including 3D figurine, anime, plushie styles',
                color: 'from-[var(--accent-primary)] to-[var(--accent-secondary)]',
              },
              {
                step: 3,
                icon: '✨',
                title: 'Download & Share',
                description: 'Get your transformed artwork instantly and share on social media',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((step, index) => (
              <div key={step.step} className='relative group'>
                <div className='relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/30 text-center'>
                  {/* Step Number */}
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                    >
                      {step.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className='text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors duration-300'>
                    {step.title}
                  </h3>
                  <p className='text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-300'>
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < 2 && (
                  <div className='md:hidden flex justify-center mt-6 mb-6'>
                    <div className='w-8 h-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center text-white text-sm font-bold'>
                      ↓
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - 参考 Nano Banana AI */}
      <section className='py-20 bg-white relative overflow-hidden'>
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-black mb-6'>
              och.ai Gallery - Real Examples
            </h2>
            <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
              Explore stunning examples created with och.ai utilizing advanced AI technology. See
              how och.ai delivers superior results compared to other models.
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              {
                title: '3D Figurine Transformation',
                description:
                  'Transform any photo into a detailed 3D figurine with perfect character preservation',
                image: 'demo-figurine.png',
              },
              {
                title: 'Anime Style Conversion',
                description:
                  'Convert real photos into anime-style artwork with consistent character identity',
                image: 'demo-anime.png',
              },
              {
                title: 'Plushie Style Creation',
                description: 'Create adorable plushie versions of any character or person',
                image: 'demo-plushie.png',
              },
              {
                title: 'Artistic Enhancement',
                description:
                  'Enhance photos with artistic styles while maintaining original composition',
                image: 'demo-artistic.png',
              },
            ].map((example, index) => (
              <div
                key={index}
                className='group relative bg-white rounded-xl p-4 border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg'
              >
                <div className='aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300'>
                  <img
                    src={`/images/${example.image}`}
                    alt={example.title}
                    className='w-full h-full object-cover rounded-lg'
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div className='hidden w-full h-full items-center justify-center text-gray-500 text-sm'>
                    {example.title}
                  </div>
                </div>
                <h3 className='text-sm font-bold text-black mb-2'>{example.title}</h3>
                <p className='text-xs text-gray-600 leading-relaxed'>{example.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 价格/订阅区域 */}
      <section className='py-20 bg-[var(--bg-secondary)] relative overflow-hidden'>
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-sm text-[var(--accent-primary)] mb-6'>
              <span>💎</span>
              Transparent Pricing
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6'>
              Choose Your Plan
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed'>
              Start with 3 free generations, then choose the plan that fits your needs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            {/* Free Plan */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] text-center'>
              <div className='mb-4'>
                <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>Free</h3>
                <div className='text-4xl font-bold text-[var(--accent-primary)] mb-2'>$0</div>
                <p className='text-[var(--text-secondary)]'>Perfect for trying out</p>
              </div>
              <ul className='space-y-3 mb-6 text-left'>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>3 free generations
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Standard quality
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  No credit card required
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Powered by Nano Banana AI
                </li>
              </ul>
              <button
                onClick={handleStartCreating}
                className='w-full px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300'
              >
                Try Free Now
              </button>
            </div>

            {/* Pro Plan */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border-2 border-[var(--accent-primary)] text-center relative'>
              <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                <div className='bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs px-4 py-1 rounded-full font-medium'>
                  Most Popular
                </div>
              </div>
              <div className='mb-4'>
                <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>Pro</h3>
                <div className='text-4xl font-bold text-[var(--accent-primary)] mb-2'>$9.99</div>
                <p className='text-[var(--text-secondary)]'>per month</p>
              </div>
              <ul className='space-y-3 mb-6 text-left'>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  100 generations/month
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  HD quality output
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Priority processing
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  All art styles included
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className='w-full px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300'
              >
                Go Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] text-center'>
              <div className='mb-4'>
                <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>Enterprise</h3>
                <div className='text-4xl font-bold text-[var(--accent-primary)] mb-2'>$29.99</div>
                <p className='text-[var(--text-secondary)]'>per month</p>
              </div>
              <ul className='space-y-3 mb-6 text-left'>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Unlimited generations
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Ultra HD quality
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  API access
                </li>
                <li className='flex items-center gap-2 text-sm'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Priority support
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className='w-full px-6 py-3 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold rounded-xl hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300'
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 信任背书区域 */}
      <section className='py-20 relative overflow-hidden'>
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 rounded-full text-sm text-[var(--accent-secondary)] mb-6'>
              <span>🛡️</span>
              Trusted & Secure
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6'>
              Built on Advanced AI Technology
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed'>
              Powered by Nano Banana AI with Google's Gemini 2.5 Flash Image API for superior
              results
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            {/* 技术来源 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4'>
                🤖
              </div>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-3'>
                Powered by Nano Banana AI
              </h3>
              <p className='text-[var(--text-secondary)] text-sm leading-relaxed'>
                Advanced AI technology utilizing Google's Gemini 2.5 Flash Image API for superior
                character consistency and scene preservation
              </p>
            </div>

            {/* 隐私安全 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4'>
                🔒
              </div>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-3'>Privacy First</h3>
              <p className='text-[var(--text-secondary)] text-sm leading-relaxed'>
                Your photos are never stored, shared, or used for training. Complete privacy
                protection with automatic deletion after processing
              </p>
            </div>

            {/* 用户评价 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4'>
                ⭐
              </div>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-3'>User Reviews</h3>
              <p className='text-[var(--text-secondary)] text-sm leading-relaxed'>
                "Amazing results! The 3D figurine effect is incredible. Much better than other AI
                tools I've tried." - Sarah M.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 区域 */}
      <section className='py-20 bg-[var(--bg-secondary)] relative overflow-hidden'>
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-sm text-[var(--accent-primary)] mb-6'>
              <span>❓</span>
              Frequently Asked Questions
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6'>
              Everything You Need to Know
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed'>
              Get answers to common questions about och.ai and our AI image generation service
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {[
              {
                question: 'How does och.ai work?',
                answer:
                  'Simply upload your photo, choose an AI art style, and get your transformed image in seconds. Powered by Nano Banana AI technology.',
              },
              {
                question: 'Is my data safe?',
                answer:
                  'Yes! Your photos are never stored, shared, or used for training. Complete privacy protection with automatic deletion after processing.',
              },
              {
                question: 'Do you offer a free trial?',
                answer:
                  'Yes! New users get 3 free generations to try our service. No credit card required to get started.',
              },
              {
                question: 'Can I use generated images commercially?',
                answer:
                  'Absolutely! All generated images can be used for commercial projects, social media, marketing materials, and more.',
              },
              {
                question: 'What makes och.ai different?',
                answer:
                  'We use advanced Nano Banana AI technology with superior character consistency and scene preservation compared to other AI tools.',
              },
              {
                question: 'How can I get support?',
                answer:
                  'Contact us at support@och.ai for technical support and customer service. We typically respond within 24 hours.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300'
              >
                <h3 className='text-lg font-bold text-[var(--text-primary)] mb-3'>
                  {faq.question}
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最终CTA区域 */}
      <section className='py-20 bg-gradient-to-br from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/5 to-[var(--accent-primary)]/10 relative overflow-hidden'>
        <div className='container mx-auto px-4 text-center relative'>
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6'>
            Ready to Transform Your Photos?
          </h2>
          <p className='text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto'>
            Join thousands of creators using och.ai to create stunning AI artwork. Start with 3 free
            generations today!
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
            <button
              onClick={handleStartCreating}
              className='group relative px-10 py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-[var(--accent-primary)]/25 transform hover:scale-105 transition-all duration-300'
            >
              <span className='flex items-center gap-3'>
                <span>🚀</span>
                Try Free Now
              </span>
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className='group px-10 py-5 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-lg rounded-2xl hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 backdrop-blur-lg bg-[var(--bg-card-alpha)]/50'
            >
              <span className='flex items-center gap-3'>
                <span>💎</span>
                View Pricing
              </span>
            </button>
          </div>

          <div className='text-sm text-[var(--text-secondary)]'>
            ✨ No credit card required • 3 free generations • Powered by Nano Banana AI
          </div>
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
