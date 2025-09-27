import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

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
      } else {
        console.log('👋 User logged out, clearing profile...')
        setUserProfile(null)
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

      // 使用 Promise.race 来设置超时，防止某些浏览器卡住
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise(
        (_, reject) => setTimeout(() => reject(new Error('Sign out timeout')), 15000) // 增加到15秒
      )

      const { error } = (await Promise.race([signOutPromise, timeoutPromise])) as any

      if (error) {
        console.error('❌ Supabase signOut error:', error)
        throw error
      }

      console.log('✅ Supabase signOut successful')

      // 清除本地存储的认证信息
      try {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
        console.log('🧹 Local storage cleared')
      } catch (e) {
        console.warn('⚠️ Failed to clear local storage:', e)
      }
    } catch (error) {
      console.error('Error in signOut function:', error)

      // 即使 Supabase signOut 失败，也尝试清除本地状态
      try {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
        // 注意：不要手动设置状态，让onAuthStateChange处理
        // 这样可以确保状态管理的一致性
      } catch (e) {
        console.warn('Failed to clear local storage after error:', e)
      }

      // 如果是超时错误，不抛出异常，而是继续执行
      if (error.message === 'Sign out timeout') {
        console.warn('Sign out timed out, but local state has been cleared')
        return
      }

      throw error
    }
  }

  const isAdmin =
    userProfile?.subscription_tier === 'admin' ||
    user?.email?.includes('@och.ai') ||
    user?.email === 'admin@och.ai'

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
