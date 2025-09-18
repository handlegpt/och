import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserInfo } from '../UserInfo'

// Mock fetch for integration tests
const mockFetch = vi.fn()
global.fetch = mockFetch

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

describe('UserInfo Integration Tests', () => {
  it('handles user authentication state correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com'
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

  it('shows admin button for admin users', () => {
    const mockUser = {
      id: '1',
      email: 'admin@example.com'
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      signOut: vi.fn(),
      isAdmin: true,
      userProfile: {
        display_name: 'Admin User',
        subscription_tier: 'admin'
      },
      signInWithGoogle: vi.fn()
    })

    render(<UserInfo />)

    expect(screen.getByText('app.admin')).toBeInTheDocument()
  })
})