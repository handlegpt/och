import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/context';
import { useAuth } from '../hooks/useAuth';
import { useGenerationState } from '../hooks/useGenerationState';
import { LoginPromptModal } from './LoginPromptModal';
import { MagicLinkModal } from './MagicLinkModal';

// Lazy load heavy components
const GenerationWorkflow = lazy(() => import('./GenerationWorkflow').then(m => ({ default: m.GenerationWorkflow })));

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithMagicLink } = useAuth();
  const [state, actions] = useGenerationState();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const handleLoginRequired = useCallback(() => {
    setShowLoginPrompt(true);
  }, []);

  const handleLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    if (signInWithGoogle) {
      signInWithGoogle();
    }
  }, [signInWithGoogle]);

  const handleMagicLinkLogin = useCallback(async (email: string) => {
    if (signInWithMagicLink) {
      await signInWithMagicLink(email);
    }
  }, [signInWithMagicLink]);

  const handleShowMagicLinkModal = useCallback(() => {
    setShowLoginPrompt(false);
    setShowMagicLinkModal(true);
  }, []);

  const handleStartCreating = useCallback(() => {
    setShowAllFeatures(true);
  }, []);

  const handleViewAllFeatures = useCallback(() => {
    setShowAllFeatures(true);
    // 不设置 selectedTransformation，这样会显示功能选择界面
  }, []);

  const handleFeatureClick = useCallback((feature: any) => {
    // 从 TRANSFORMATIONS 中找到对应的转换
    const transformation = state.transformations.find(t => t.key === feature.id);
    if (transformation) {
      actions.setSelectedTransformation(transformation);
      setShowAllFeatures(true);
    }
  }, [actions, state.transformations]);

  // 如果用户选择了功能，显示生成界面
  if (showAllFeatures && state.selectedTransformation) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <main>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)]">加载中...</p>
              </div>
            </div>
          }>
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
    );
  }

  // 如果用户点击了"查看所有功能"，显示功能选择界面
  if (showAllFeatures && !state.selectedTransformation) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <main>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)]">加载中...</p>
              </div>
            </div>
          }>
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
    );
  }

  // 主要功能预览
  const featuredTransformations = [
    {
      id: 'customPrompt',
      name: t('transformations.effects.customPrompt.title'),
      description: t('transformations.effects.customPrompt.description'),
      icon: '✨',
      category: 'creative'
    },
    {
      id: 'hdEnhance',
      name: t('transformations.effects.hdEnhance.title'),
      description: t('transformations.effects.hdEnhance.description'),
      icon: '🔍',
      category: 'enhancement'
    },
    {
      id: 'figurine',
      name: t('transformations.effects.figurine.title'),
      description: t('transformations.effects.figurine.description'),
      icon: '🎭',
      category: '3d'
    },
    {
      id: 'cosplay',
      name: t('transformations.effects.cosplay.title'),
      description: t('transformations.effects.cosplay.description'),
      icon: '🎭',
      category: 'style'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                {t('home.hero.title')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartCreating}
                className="px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {t('home.hero.cta')}
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-8 py-4 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold rounded-xl hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-200"
              >
                {t('home.hero.explore')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredTransformations.map((feature, index) => (
              <div
                key={feature.id}
                className="group bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 hover:shadow-lg hover:-translate-y-2 cursor-pointer"
                onClick={() => handleFeatureClick(feature)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleViewAllFeatures}
              className="px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors duration-200"
            >
              {t('home.features.viewAll')}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: '📸',
                title: t('home.howItWorks.step1.title'),
                description: t('home.howItWorks.step1.description')
              },
              {
                step: 2,
                icon: '🎨',
                title: t('home.howItWorks.step2.title'),
                description: t('home.howItWorks.step2.description')
              },
              {
                step: 3,
                icon: '✨',
                title: t('home.howItWorks.step3.title'),
                description: t('home.howItWorks.step3.description')
              }
            ].map((step, _index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <button
            onClick={handleStartCreating}
            className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
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
    </div>
  );
};
