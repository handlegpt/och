import { useState, useEffect, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { setSentryUser, clearSentryUser, captureUserAction } from '../lib/sentry'
import { AnalyticsEvents } from '../components/Analytics'

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
      // 只在开发环境输出认证状态变化日志
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'no user')
      }

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // 只在开发环境输出登录日志
        if (process.env.NODE_ENV === 'development') {
          console.log('👤 User logged in, fetching profile...')
        }
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
  }, [fetchUserProfile])

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!supabase) {
      console.error('❌ Supabase 客户端未初始化')
      return
    }

    try {
      console.log('🔄 获取用户配置:', userId)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ 获取用户配置失败:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId: userId,
        })

        // 如果是用户配置不存在，尝试创建默认配置
        if (error.code === 'PGRST116') {
          console.log('🆕 用户配置不存在，尝试创建默认配置...')
          await createDefaultUserProfile(userId)
          return
        }

        // 如果是权限问题，尝试直接创建
        if (error.code === '42501' || error.message.includes('permission')) {
          console.log('🔒 权限问题，尝试直接创建用户配置...')
          await createDefaultUserProfile(userId)
          return
        }

        return
      }

      console.log('✅ 用户配置获取成功:', {
        id: data?.id,
        username: data?.username,
        display_name: data?.display_name,
        subscription_tier: data?.subscription_tier,
        is_admin: data?.is_admin,
      })

      setUserProfile(data)
    } catch (error) {
      console.error('❌ 获取用户配置异常:', error)
    }
  }, [])

  const createDefaultUserProfile = async (userId: string) => {
    if (!supabase) {
      console.error('❌ Supabase 客户端未初始化')
      return
    }

    try {
      console.log('🆕 创建默认用户配置:', userId)

      const { data: userData } = await supabase.auth.getUser()
      const email = userData?.user?.email || ''
      const baseUsername = email.split('@')[0] || 'user'

      // 生成唯一的用户名
      let username = baseUsername
      let counter = 1

      while (true) {
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('username', username)
          .single()

        if (!existingUser) {
          break // 用户名可用
        }

        username = `${baseUsername}${counter}`
        counter++

        if (counter > 100) {
          // 防止无限循环，使用 UUID 后缀
          username = `${baseUsername}_${userId.slice(-8)}`
          break
        }
      }

      console.log('📝 使用用户名:', username)

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          username: username,
          display_name: baseUsername, // 显示名称使用原始邮箱前缀
          subscription_tier: 'admin', // 设置为管理员
          is_admin: true, // 设置为管理员
        })
        .select()
        .single()

      if (error) {
        console.error('❌ 创建用户配置失败:', error)
        return
      }

      console.log('✅ 默认用户配置创建成功:', data)
      setUserProfile(data)
    } catch (error) {
      console.error('❌ 创建用户配置异常:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // 跟踪登录事件
    AnalyticsEvents.USER_LOGIN('email')
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

    // 跟踪注册事件
    AnalyticsEvents.USER_SIGNUP('email')

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

    // 跟踪Google登录事件
    AnalyticsEvents.USER_LOGIN('google')
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

    // 防止重复调用
    if ((window as any).signOutInProgress) {
      console.log('⚠️ 退出登录正在进行中，忽略重复调用')
      return
    }

    ;(window as any).signOutInProgress = true

    try {
      console.log('🚪 开始退出登录流程...')

      // 跟踪登出事件
      AnalyticsEvents.USER_LOGOUT()

      // 立即清除本地状态，让用户看到退出效果
      console.log('🧹 立即清除本地状态...')
      setUser(null)
      setSession(null)
      setUserProfile(null)

      // 清除本地存储
      try {
        localStorage.removeItem('supabase.auth.token')
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.includes('-auth-token')) {
            localStorage.removeItem(key)
          }
        })
        sessionStorage.clear()
        console.log('✅ 本地存储已清除')
      } catch (e) {
        console.warn('⚠️ 清除本地存储失败:', e)
      }

      // 异步调用 Supabase signOut（不阻塞用户界面）
      setTimeout(async () => {
        try {
          console.log('🔄 异步调用 Supabase signOut...')
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.warn('⚠️ Supabase signOut 失败:', error.message)
          } else {
            console.log('✅ Supabase signOut 成功')
          }
        } catch (error) {
          console.warn('⚠️ Supabase signOut 异常:', error.message)
        } finally {
          ;(window as any).signOutInProgress = false
        }
      }, 100)

      console.log('✅ 退出登录完成（本地状态已清除）')
    } catch (error) {
      console.error('❌ 退出登录过程中出现错误:', error)
      ;(window as any).signOutInProgress = false

      // 即使出错也要确保状态被清除
      setUser(null)
      setSession(null)
      setUserProfile(null)
    }
  }

  const isAdmin = userProfile?.is_admin === true || userProfile?.subscription_tier === 'admin'

  // 强制刷新用户配置
  const refreshUserProfile = async () => {
    if (user?.id) {
      console.log('🔄 强制刷新用户配置...')
      await fetchUserProfile(user.id)
    }
  }

  // 调试日志
  if (process.env.NODE_ENV === 'development' && user) {
    console.log('🔍 Admin permission check:', {
      userEmail: user.email,
      userProfile: userProfile,
      isAdmin: isAdmin,
      checks: {
        is_admin: userProfile?.is_admin === true,
        subscription_tier: userProfile?.subscription_tier === 'admin',
      },
    })
  }

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
    refreshUserProfile,
  }
}

// Re-export useAuth from AuthProvider
export { useAuthContext as useAuth } from '../components/auth/AuthProvider'
