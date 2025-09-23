import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../../i18n/context'

// 自定义渲染函数，包含必要的 providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <LanguageProvider>{children}</LanguageProvider>
    </BrowserRouter>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// 测试数据工厂
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  display_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockUsageLimit = (overrides = {}) => ({
  dailyLimit: 5,
  usedToday: 0,
  remainingToday: 5,
  canGenerate: true,
  tier: 'free',
  ...overrides,
})

export const createMockGeneration = (overrides = {}) => ({
  isGenerating: false,
  progress: 0,
  currentStep: '',
  result: undefined,
  error: undefined,
  ...overrides,
})

// Mock Supabase 客户端
export const createMockSupabaseClient = () => ({
  auth: {
    signInWithOtp: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
        limit: vi.fn(),
        order: vi.fn(),
      })),
      limit: vi.fn(),
      order: vi.fn(),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
  rpc: vi.fn(),
})

// 等待异步操作
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟用户交互
export const mockUserEvent = {
  click: vi.fn(),
  type: vi.fn(),
  clear: vi.fn(),
  selectOptions: vi.fn(),
  upload: vi.fn(),
}

// 重新导出所有内容
export * from '@testing-library/react'
export { customRender as render }
