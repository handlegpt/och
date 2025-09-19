import React, { useState, useCallback, lazy, Suspense } from 'react'
import { useTranslation } from '../../i18n/context'
import { useAuth } from '../hooks/useAuth'
import { useGenerationState } from '../hooks/useGenerationState'
import { LoginPromptModal } from '../components/LoginPromptModal'
import { MagicLinkModal } from '../components/MagicLinkModal'

// Lazy load heavy components
const GenerationWorkflow = lazy(() =>
  import('../components/GenerationWorkflow').then(m => ({ default: m.GenerationWorkflow }))
)

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation()
  const { user, signInWithGoogle, signInWithMagicLink } = useAuth()
  const [state, actions] = useGenerationState()

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false)

  const handleLoginRequired = useCallback(() => {
    setShowLoginPrompt(true)
  }, [])

  const handleLoginPrompt = useCallback(async () => {
    try {
      await signInWithGoogle()
      setShowLoginPrompt(false)
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }, [signInWithGoogle])

  const handleShowMagicLinkModal = useCallback(() => {
    setShowLoginPrompt(false)
    setShowMagicLinkModal(true)
  }, [])

  const handleMagicLinkLogin = useCallback(
    async (email: string) => {
      try {
        await signInWithMagicLink(email)
        setShowMagicLinkModal(false)
      } catch (error) {
        console.error('Magic link login failed:', error)
      }
    },
    [signInWithMagicLink]
  )

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pt-20 pb-20 md:pb-8'>
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
