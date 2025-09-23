import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './appStore'
import { createMockUser, createMockUsageLimit } from '../test/utils'

describe('AppStore', () => {
  beforeEach(() => {
    // 重置 store 状态
    useAppStore.getState().reset()
  })

  describe('User state', () => {
    it('initializes with null user', () => {
      const state = useAppStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('sets user correctly', () => {
      const mockUser = createMockUser()
      useAppStore.getState().setUser(mockUser)

      const state = useAppStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
    })

    it('sets authenticated state independently', () => {
      useAppStore.getState().setAuthenticated(true)
      expect(useAppStore.getState().isAuthenticated).toBe(true)

      useAppStore.getState().setAuthenticated(false)
      expect(useAppStore.getState().isAuthenticated).toBe(false)
    })

    it('sets loading state', () => {
      useAppStore.getState().setLoading(true)
      expect(useAppStore.getState().isLoading).toBe(true)

      useAppStore.getState().setLoading(false)
      expect(useAppStore.getState().isLoading).toBe(false)
    })
  })

  describe('Usage limit state', () => {
    it('initializes with default usage limit', () => {
      const state = useAppStore.getState()
      expect(state.usageLimit).toEqual({
        dailyLimit: 5,
        usedToday: 0,
        remainingToday: 5,
        canGenerate: true,
        tier: 'free',
      })
    })

    it('sets usage limit correctly', () => {
      const mockLimit = createMockUsageLimit({ dailyLimit: 10, usedToday: 3 })
      useAppStore.getState().setUsageLimit(mockLimit)

      expect(useAppStore.getState().usageLimit).toEqual(mockLimit)
    })

    it('updates usage correctly', () => {
      const { updateUsage } = useAppStore.getState()
      updateUsage(3)

      const state = useAppStore.getState()
      expect(state.usageLimit.usedToday).toBe(3)
      expect(state.usageLimit.remainingToday).toBe(2)
      expect(state.usageLimit.canGenerate).toBe(true)
    })

    it('prevents generation when limit exceeded', () => {
      const { updateUsage } = useAppStore.getState()
      updateUsage(5) // 达到限制

      const state = useAppStore.getState()
      expect(state.usageLimit.canGenerate).toBe(false)
    })
  })

  describe('Generation state', () => {
    it('initializes with default generation state', () => {
      const state = useAppStore.getState()
      expect(state.generation).toEqual({
        isGenerating: false,
        progress: 0,
        currentStep: '',
        result: undefined,
        error: undefined,
      })
    })

    it('sets generating state', () => {
      useAppStore.getState().setGenerating(true)
      expect(useAppStore.getState().generation.isGenerating).toBe(true)
    })

    it('updates progress', () => {
      useAppStore.getState().setProgress(50)
      expect(useAppStore.getState().generation.progress).toBe(50)
    })

    it('sets current step', () => {
      useAppStore.getState().setCurrentStep('Processing image...')
      expect(useAppStore.getState().generation.currentStep).toBe('Processing image...')
    })

    it('sets result and stops generating', () => {
      const { setResult } = useAppStore.getState()
      setResult('generated-image.jpg')

      const state = useAppStore.getState()
      expect(state.generation.result).toBe('generated-image.jpg')
      expect(state.generation.isGenerating).toBe(false)
    })

    it('sets error and stops generating', () => {
      const { setError } = useAppStore.getState()
      setError('Generation failed')

      const state = useAppStore.getState()
      expect(state.generation.error).toBe('Generation failed')
      expect(state.generation.isGenerating).toBe(false)
    })

    it('resets generation state', () => {
      // 先设置一些状态
      useAppStore.getState().setGenerating(true)
      useAppStore.getState().setProgress(50)
      useAppStore.getState().setCurrentStep('Processing...')

      // 重置
      useAppStore.getState().resetGeneration()

      const state = useAppStore.getState()
      expect(state.generation).toEqual({
        isGenerating: false,
        progress: 0,
        currentStep: '',
        result: undefined,
        error: undefined,
      })
    })
  })

  describe('Theme state', () => {
    it('initializes with dark theme', () => {
      const state = useAppStore.getState()
      expect(state.theme.mode).toBe('dark')
    })

    it('sets theme correctly', () => {
      useAppStore.getState().setTheme({ mode: 'light' })
      expect(useAppStore.getState().theme.mode).toBe('light')
    })

    it('toggles theme', () => {
      const { toggleTheme } = useAppStore.getState()

      // 从 dark 切换到 light
      toggleTheme()
      expect(useAppStore.getState().theme.mode).toBe('light')

      // 从 light 切换到 dark
      toggleTheme()
      expect(useAppStore.getState().theme.mode).toBe('dark')
    })
  })

  describe('Language state', () => {
    it('initializes with Chinese', () => {
      const state = useAppStore.getState()
      expect(state.language.current).toBe('zh')
      expect(state.language.browserDetected).toBe(false)
    })

    it('sets language correctly', () => {
      useAppStore.getState().setLanguage('en')
      expect(useAppStore.getState().language.current).toBe('en')
    })

    it('sets browser detected flag', () => {
      useAppStore.getState().setBrowserDetected(true)
      expect(useAppStore.getState().language.browserDetected).toBe(true)
    })
  })

  describe('UI state', () => {
    it('initializes with default UI state', () => {
      const state = useAppStore.getState()
      expect(state.ui).toEqual({
        sidebarOpen: false,
        modalOpen: false,
        currentModal: undefined,
        loading: false,
        error: undefined,
      })
    })

    it('sets sidebar open state', () => {
      useAppStore.getState().setSidebarOpen(true)
      expect(useAppStore.getState().ui.sidebarOpen).toBe(true)
    })

    it('sets modal open state', () => {
      useAppStore.getState().setModalOpen(true, 'auth')
      const state = useAppStore.getState()
      expect(state.ui.modalOpen).toBe(true)
      expect(state.ui.currentModal).toBe('auth')
    })

    it('sets UI error', () => {
      useAppStore.getState().setUIError('Something went wrong')
      expect(useAppStore.getState().ui.error).toBe('Something went wrong')
    })
  })

  describe('Reset functionality', () => {
    it('resets all state to initial values', () => {
      // 设置一些状态
      useAppStore.getState().setUser(createMockUser())
      useAppStore.getState().setAuthenticated(true)
      useAppStore.getState().setGenerating(true)
      useAppStore.getState().setTheme({ mode: 'light' })
      useAppStore.getState().setLanguage('en')

      // 重置
      useAppStore.getState().reset()

      const state = useAppStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.generation.isGenerating).toBe(false)
      expect(state.theme.mode).toBe('dark')
      expect(state.language.current).toBe('zh')
    })
  })
})
