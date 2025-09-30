import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { setSentryUser, clearSentryUser, captureUserAction } from '../lib/sentry'

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not initialized')
      setLoading(false)
      return
    }

    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email || 'no user')

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        console.log('👤 User logged in, fetching profile...')
        await fetchUserProfile(session.user.id)

        // 设置Sentry用户上下文
        setSentryUser(session.user)
        captureUserAction('user_login', {
          userId: session.user.id,
          email: session.user.email,
        })
      } else {
        console.log('👋 User logged out, clearing profile...')
        setUserProfile(null)

        // 清除Sentry用户上下文
        clearSentryUser()
        captureUserAction('user_logout')
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, username?: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email?.split('@')[0],
        },
      },
    })

    if (error) throw error

    // 用户配置会在触发器自动创建
    // 不返回 data，保持接口一致性
  }

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase client not initialized')

    // 根据环境确定重定向URL
    const getRedirectUrl = () => {
      const origin = window.location.origin
      // 如果是生产环境，使用och.ai域名
      if (origin.includes('och.ai')) {
        return 'https://och.ai/auth/callback'
      }
      // 开发环境使用当前域名
      return `${origin}/auth/callback`
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'openid email profile',
      },
    })
    if (error) throw error
  }

  const signInWithMagicLink = async (email: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized')
      throw new Error('Supabase client not initialized')
    }

    try {
      console.log('🚪 Starting sign out process...')
      console.log('Current user before signOut:', user?.email)
      console.log('Current session before signOut:', session?.access_token ? 'exists' : 'none')

      // 首先清除本地存储，确保用户立即看到登出效果
      try {
        localStorage.removeItem('supabase.auth.token')
        // 清除所有可能的Supabase认证token
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.includes('-auth-token')) {
            localStorage.removeItem(key)
          }
        })
        sessionStorage.clear()
        console.log('🧹 Local storage cleared immediately')
      } catch (e) {
        console.warn('⚠️ Failed to clear local storage:', e)
      }

      // 使用更短的超时时间，并添加重试机制
      const signOutWithRetry = async (retries = 2) => {
        for (let i = 0; i < retries; i++) {
          try {
            console.log(`🔄 Attempting signOut (attempt ${i + 1}/${retries})`)

            const signOutPromise = supabase.auth.signOut()
            const timeoutPromise = new Promise(
              (_, reject) => setTimeout(() => reject(new Error('Sign out timeout')), 8000) // 减少到8秒
            )

            const { error } = (await Promise.race([signOutPromise, timeoutPromise])) as any

            if (error) {
              console.warn(`⚠️ SignOut attempt ${i + 1} failed:`, error.message)
              if (i === retries - 1) throw error
              // 等待1秒后重试
              await new Promise(resolve => setTimeout(resolve, 1000))
            } else {
              console.log('✅ Supabase signOut successful')
              return
            }
          } catch (error) {
            if (i === retries - 1) throw error
            console.warn(`⚠️ SignOut attempt ${i + 1} failed:`, error.message)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

      await signOutWithRetry()
    } catch (error) {
      console.error('Error in signOut function:', error)

      // 确保本地状态被清除，即使Supabase调用失败
      try {
        localStorage.removeItem('supabase.auth.token')
        // 清除所有可能的Supabase认证token
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.includes('-auth-token')) {
            localStorage.removeItem(key)
          }
        })
        sessionStorage.clear()
        console.log('🧹 Local storage cleared after error')
      } catch (e) {
        console.warn('Failed to clear local storage after error:', e)
      }

      // 如果是超时错误，不抛出异常，因为本地状态已经清除
      if (error.message === 'Sign out timeout') {
        console.warn('⚠️ Sign out timed out, but local state has been cleared')
        console.log('✅ Sign out successful (local cleanup completed)')
        return
      }

      // 对于其他错误，也尝试继续执行，因为本地状态已经清除
      console.warn('⚠️ Supabase signOut failed, but local state has been cleared')
      console.log('✅ Sign out successful (local cleanup completed)')
    }
  }

  const isAdmin =
    userProfile?.subscription_tier === 'admin' ||
    user?.email?.includes('@och.ai') ||
    user?.email === 'admin@och.ai' ||
    user?.email === 'your-email@example.com' // 添加你的邮箱

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithEmail,
    signInWithMagicLink,
    signOut,
    isAdmin,
    userProfile,
  }
}

// Re-export useAuth from AuthProvider
export { useAuthContext as useAuth } from '../components/auth/AuthProvider'
