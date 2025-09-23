import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 类型定义
export interface User {
  id: string
  email: string
  display_name?: string
  avatar_url?: string
  created_at: string
}

export interface UsageLimit {
  dailyLimit: number
  usedToday: number
  remainingToday: number
  canGenerate: boolean
  tier: string
}

export interface GenerationState {
  isGenerating: boolean
  progress: number
  currentStep: string
  result?: string
  error?: string
}

export interface ThemeState {
  mode: 'light' | 'dark'
  primary: string
  secondary: string
}

export interface LanguageState {
  current: 'zh' | 'en'
  browserDetected: boolean
}

export interface UIState {
  sidebarOpen: boolean
  modalOpen: boolean
  currentModal?: string
  loading: boolean
  error?: string
}

// 应用状态接口
interface AppState {
  // 用户状态
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // 使用限制
  usageLimit: UsageLimit

  // 生成状态
  generation: GenerationState

  // 主题状态
  theme: ThemeState

  // 语言状态
  language: LanguageState

  // UI状态
  ui: UIState

  // Actions - 用户相关
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void

  // Actions - 使用限制
  setUsageLimit: (limit: UsageLimit) => void
  updateUsage: (used: number) => void

  // Actions - 生成状态
  setGenerating: (generating: boolean) => void
  setProgress: (progress: number) => void
  setCurrentStep: (step: string) => void
  setResult: (result: string) => void
  setError: (error: string) => void
  resetGeneration: () => void

  // Actions - 主题
  setTheme: (theme: Partial<ThemeState>) => void
  toggleTheme: () => void

  // Actions - 语言
  setLanguage: (lang: 'zh' | 'en') => void
  setBrowserDetected: (detected: boolean) => void

  // Actions - UI
  setSidebarOpen: (open: boolean) => void
  setModalOpen: (open: boolean, modal?: string) => void
  setUIError: (error?: string) => void

  // 重置所有状态
  reset: () => void
}

// 初始状态
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  usageLimit: {
    dailyLimit: 5,
    usedToday: 0,
    remainingToday: 5,
    canGenerate: true,
    tier: 'free',
  },
  generation: {
    isGenerating: false,
    progress: 0,
    currentStep: '',
    result: undefined,
    error: undefined,
  },
  theme: {
    mode: 'dark',
    primary: 'var(--accent-primary)',
    secondary: 'var(--accent-secondary)',
  },
  language: {
    current: 'zh',
    browserDetected: false,
  },
  ui: {
    sidebarOpen: false,
    modalOpen: false,
    currentModal: undefined,
    loading: false,
    error: undefined,
  },
}

// 创建 store
export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      ...initialState,

      // 用户相关 actions
      setUser: user => set({ user, isAuthenticated: !!user }),
      setAuthenticated: authenticated => set({ isAuthenticated: authenticated }),
      setLoading: loading => set({ isLoading: loading }),

      // 使用限制 actions
      setUsageLimit: limit => set({ usageLimit: limit }),
      updateUsage: used =>
        set(_state => ({
          usageLimit: {
            ..._state.usageLimit,
            usedToday: used,
            remainingToday: Math.max(0, _state.usageLimit.dailyLimit - used),
            canGenerate: used < _state.usageLimit.dailyLimit,
          },
        })),

      // 生成状态 actions
      setGenerating: generating =>
        set(_state => ({
          generation: { ..._state.generation, isGenerating: generating },
        })),
      setProgress: progress =>
        set(_state => ({
          generation: { ..._state.generation, progress },
        })),
      setCurrentStep: step =>
        set(_state => ({
          generation: { ..._state.generation, currentStep: step },
        })),
      setResult: result =>
        set(_state => ({
          generation: { ..._state.generation, result, isGenerating: false },
        })),
      setError: error =>
        set(_state => ({
          generation: { ..._state.generation, error, isGenerating: false },
        })),
      resetGeneration: () =>
        set(_state => ({
          generation: {
            isGenerating: false,
            progress: 0,
            currentStep: '',
            result: undefined,
            error: undefined,
          },
        })),

      // 主题 actions
      setTheme: theme =>
        set(_state => ({
          theme: { ..._state.theme, ...theme },
        })),
      toggleTheme: () =>
        set(_state => ({
          theme: {
            ..._state.theme,
            mode: _state.theme.mode === 'light' ? 'dark' : 'light',
          },
        })),

      // 语言 actions
      setLanguage: lang =>
        set(_state => ({
          language: { ..._state.language, current: lang },
        })),
      setBrowserDetected: detected =>
        set(_state => ({
          language: { ..._state.language, browserDetected: detected },
        })),

      // UI actions
      setSidebarOpen: open =>
        set(_state => ({
          ui: { ..._state.ui, sidebarOpen: open },
        })),
      setModalOpen: (open, modal) =>
        set(_state => ({
          ui: { ..._state.ui, modalOpen: open, currentModal: modal },
        })),
      setUIError: error =>
        set(_state => ({
          ui: { ..._state.ui, error },
        })),

      // 重置
      reset: () => set(initialState),
    }),
    {
      name: 'och-ai-store',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        language: state.language,
        usageLimit: state.usageLimit,
      }),
    }
  )
)

// 选择器 hooks
export const useUser = () =>
  useAppStore(_state => ({
    user: _state.user,
    isAuthenticated: _state.isAuthenticated,
    isLoading: _state.isLoading,
    setUser: _state.setUser,
    setAuthenticated: _state.setAuthenticated,
    setLoading: _state.setLoading,
  }))

export const useUsageLimit = () =>
  useAppStore(state => ({
    usageLimit: state.usageLimit,
    setUsageLimit: state.setUsageLimit,
    updateUsage: state.updateUsage,
  }))

export const useGeneration = () =>
  useAppStore(state => ({
    generation: state.generation,
    setGenerating: state.setGenerating,
    setProgress: state.setProgress,
    setCurrentStep: state.setCurrentStep,
    setResult: state.setResult,
    setError: state.setError,
    resetGeneration: state.resetGeneration,
  }))

export const useTheme = () =>
  useAppStore(state => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }))

export const useLanguage = () =>
  useAppStore(state => ({
    language: state.language,
    setLanguage: state.setLanguage,
    setBrowserDetected: state.setBrowserDetected,
  }))

export const useUI = () =>
  useAppStore(state => ({
    ui: state.ui,
    setSidebarOpen: state.setSidebarOpen,
    setModalOpen: state.setModalOpen,
    setUIError: state.setUIError,
  }))
