import React, { createContext, useContext } from 'react'

interface SimpleAuthContextType {
  user: any
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  userProfile: any
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(SimpleAuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 简化的认证提供者，不包含复杂逻辑
export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authValue: SimpleAuthContextType = {
    user: null,
    session: null,
    loading: false,
    signIn: async () => {
      console.log('Sign in not available in simple mode')
    },
    signUp: async () => {
      console.log('Sign up not available in simple mode')
    },
    signInWithGoogle: async () => {
      console.log('Google sign in not available in simple mode')
    },
    signInWithEmail: async () => {
      console.log('Email sign in not available in simple mode')
    },
    signInWithMagicLink: async () => {
      console.log('Magic link sign in not available in simple mode')
    },
    signOut: async () => {
      console.log('Sign out not available in simple mode')
    },
    isAdmin: false,
    userProfile: null,
  }

  return <SimpleAuthContext.Provider value={authValue}>{children}</SimpleAuthContext.Provider>
}
