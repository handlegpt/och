import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from './i18n/context';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { UserInfo } from './src/components/UserInfo';
import { useAuth } from './src/hooks/useAuth';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { useGenerationState } from './src/hooks/useGenerationState';

// Lazy load heavy components
const GenerationWorkflow = lazy(() => import('./src/components/GenerationWorkflow').then(m => ({ default: m.GenerationWorkflow })));
const LoginPromptModal = lazy(() => import('./src/components/LoginPromptModal').then(m => ({ default: m.LoginPromptModal })));
const MagicLinkModal = lazy(() => import('./src/components/MagicLinkModal').then(m => ({ default: m.MagicLinkModal })));

const App: React.FC = () => {
  const { t } = useTranslation();
  const { user, signInWithGoogle, signInWithMagicLink } = useAuth();
  const [state, actions] = useGenerationState();
  
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);

  const handleGenerate = useCallback(() => {
    // 检查用户是否已登录
    if (!user) {
      // 显示登录提醒模态框
      setShowLoginPrompt(true);
      return;
    }
    
    // 生成逻辑现在在 GenerationWorkflow 中处理
    // 这里只需要处理登录检查
  }, [user]);

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
        <header className="bg-[var(--bg-card-alpha)] backdrop-blur-lg sticky top-0 z-20 p-4 border-b border-[var(--border-primary)]">
          <div className="container mx-auto flex justify-between items-center">
            <h1 
              className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] cursor-pointer" 
              onClick={actions.resetApp}
            >
              {t('app.title')}
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <UserInfo />
            </div>
          </div>
        </header>

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
    </ErrorBoundary>
  );
};

// Add fade-in animation for view transitions
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  @keyframes fadeInFast {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in-fast {
    animation: fadeInFast 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default App;
