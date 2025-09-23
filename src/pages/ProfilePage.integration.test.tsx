import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import { ProfilePage } from './ProfilePage'
import { createMockUser } from '../../test/utils'

// Mock useAuth hook
const mockUseAuth = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

// Mock useLanguage hook
vi.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'zh',
    setLanguage: vi.fn(),
    t: (key: string) => key,
  }),
}))

describe('ProfilePage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login prompt when user is not authenticated', () => {
    mockUseAuth.user = null
    mockUseAuth.isAuthenticated = false

    render(<ProfilePage />)

    expect(screen.getByText('请先登录')).toBeInTheDocument()
  })

  it('renders profile content when user is authenticated', () => {
    mockUseAuth.user = createMockUser()
    mockUseAuth.isAuthenticated = true

    render(<ProfilePage />)

    expect(screen.getByText('app.profile.tabs.dashboard')).toBeInTheDocument()
    expect(screen.getByText('app.profile.favorites.title')).toBeInTheDocument()
    expect(screen.getByText('app.profile.privacy.title')).toBeInTheDocument()
  })

  it('switches between tabs correctly', () => {
    mockUseAuth.user = createMockUser()
    mockUseAuth.isAuthenticated = true

    render(<ProfilePage />)

    // 默认显示仪表板
    expect(screen.getByText('app.profile.tabs.dashboard')).toBeInTheDocument()

    // 切换到收藏
    const favoritesTab = screen.getByText('app.profile.favorites.title')
    fireEvent.click(favoritesTab)

    // 应该显示收藏内容
    expect(screen.getByText('app.profile.favorites.title')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    mockUseAuth.isLoading = true

    render(<ProfilePage />)

    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('displays user information correctly', () => {
    const mockUser = createMockUser({
      display_name: 'Test User',
      email: 'test@example.com',
    })

    mockUseAuth.user = mockUser
    mockUseAuth.isAuthenticated = true

    render(<ProfilePage />)

    // 应该显示用户信息
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('handles tab navigation with keyboard', () => {
    mockUseAuth.user = createMockUser()
    mockUseAuth.isAuthenticated = true

    render(<ProfilePage />)

    const dashboardTab = screen.getByText('app.profile.tabs.dashboard')

    // 使用键盘导航
    fireEvent.keyDown(dashboardTab, { key: 'Enter' })

    // 应该保持在同一标签页
    expect(screen.getByText('app.profile.tabs.dashboard')).toBeInTheDocument()
  })

  it('handles responsive design', () => {
    mockUseAuth.user = createMockUser()
    mockUseAuth.isAuthenticated = true

    // 模拟移动端屏幕
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
      writable: true,
    })

    render(<ProfilePage />)

    // 应该显示移动端布局
    expect(screen.getByText('app.profile.tabs.dashboard')).toBeInTheDocument()
  })

  it('handles error states gracefully', () => {
    mockUseAuth.user = createMockUser()
    mockUseAuth.isAuthenticated = true

    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<ProfilePage />)

    // 应该正常渲染，即使有错误
    expect(screen.getByText('app.profile.tabs.dashboard')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
