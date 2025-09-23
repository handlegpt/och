import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import { AuthModal } from './AuthModal'
// import { createMockSupabaseClient } from '../../test/utils'

// Mock useAuth hook
const mockUseAuth = {
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
}

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

describe('AuthModal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('登录 Och AI')).toBeInTheDocument()
    expect(screen.getByText('使用 Google 登录')).toBeInTheDocument()
    expect(screen.getByText('Magic Link 登录')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  })

  it('handles Google login successfully', async () => {
    mockUseAuth.signInWithGoogle.mockResolvedValue(undefined)

    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const googleButton = screen.getByText('使用 Google 登录')
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(mockUseAuth.signInWithGoogle).toHaveBeenCalledTimes(1)
    })
  })

  it('handles Google login failure', async () => {
    const errorMessage = 'Google login failed'
    mockUseAuth.signInWithGoogle.mockRejectedValue(new Error(errorMessage))

    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const googleButton = screen.getByText('使用 Google 登录')
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('handles Magic Link login successfully', async () => {
    mockUseAuth.signInWithEmail.mockResolvedValue(undefined)

    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const emailInput = screen.getByPlaceholderText('your@email.com')
    const submitButton = screen.getByText('发送 Magic Link')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUseAuth.signInWithEmail).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('shows validation error for empty email', async () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const submitButton = screen.getByText('发送 Magic Link')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const emailInput = screen.getByPlaceholderText('your@email.com')
    const submitButton = screen.getByText('发送 Magic Link')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })
  })

  it('shows loading state during authentication', async () => {
    // Mock a delayed response
    mockUseAuth.signInWithGoogle.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const googleButton = screen.getByText('使用 Google 登录')
    fireEvent.click(googleButton)

    // 应该显示加载状态
    expect(screen.getByText('使用 Google 登录')).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByText('使用 Google 登录')).not.toBeDisabled()
    })
  })

  it('closes modal on successful authentication', async () => {
    const onClose = vi.fn()
    mockUseAuth.signInWithGoogle.mockResolvedValue(undefined)

    render(<AuthModal isOpen={true} onClose={onClose} />)

    const googleButton = screen.getByText('使用 Google 登录')
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('handles network errors gracefully', async () => {
    const networkError = new Error('Network error')
    mockUseAuth.signInWithEmail.mockRejectedValue(networkError)

    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const emailInput = screen.getByPlaceholderText('your@email.com')
    const submitButton = screen.getByText('发送 Magic Link')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('prevents multiple simultaneous requests', async () => {
    let resolvePromise: () => void
    const promise = new Promise<void>(resolve => {
      resolvePromise = resolve
    })

    mockUseAuth.signInWithGoogle.mockReturnValue(promise)

    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const googleButton = screen.getByText('使用 Google 登录')

    // 点击多次
    fireEvent.click(googleButton)
    fireEvent.click(googleButton)
    fireEvent.click(googleButton)

    // 应该只调用一次
    expect(mockUseAuth.signInWithGoogle).toHaveBeenCalledTimes(1)

    // 清理
    if (resolvePromise) resolvePromise()
  })
})
