import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserInfo } from '../UserInfo'

// Mock the useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock the useTranslation hook
vi.mock('../../../i18n/context', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

describe('UserInfo Component', () => {
  it('renders login button when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      signOut: vi.fn(),
      isAdmin: false,
      userProfile: null,
      signInWithGoogle: vi.fn()
    })

    render(<UserInfo />)

    expect(screen.getByText('app.login')).toBeInTheDocument()
  })

  it('renders user info when user is authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User'
      }
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      signOut: vi.fn(),
      isAdmin: false,
      userProfile: {
        display_name: 'Test User',
        subscription_tier: 'free'
      },
      signInWithGoogle: vi.fn()
    })

    render(<UserInfo />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('free')).toBeInTheDocument()
  })
})