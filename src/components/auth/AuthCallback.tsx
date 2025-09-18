import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        console.error('Supabase client not initialized')
        navigate('/')
        return
      }

      try {
        // 处理 URL 中的认证参数
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          // 显示错误信息给用户
          setTimeout(() => navigate('/'), 3000)
          return
        }

        if (data.session) {
          console.log('Authentication successful:', data.session.user.email)
          // 认证成功，立即重定向到首页
          navigate('/')
        } else {
          // 没有会话，可能是链接已过期或无效
          console.log('No active session found')
          setTimeout(() => navigate('/'), 2000)
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        setTimeout(() => navigate('/'), 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4'></div>
        <p className='text-[var(--text-primary)] mb-2'>正在处理登录...</p>
        <p className='text-[var(--text-secondary)] text-sm'>请稍候，我们正在验证您的身份</p>
      </div>
    </div>
  )
}
