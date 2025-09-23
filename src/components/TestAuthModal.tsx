import React, { useState } from 'react'

// 简化的 AuthModal 测试组件
export const TestAuthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      // 模拟 Google 登录
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Google 登录成功！')
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(null)
      }, 2000)
    } catch {
      setError('Google 登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // 模拟 Magic Link 发送
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Magic Link 已发送到您的邮箱！')
    } catch {
      setError('发送失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const ModalContent = () => {
    if (!isOpen) return null

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-xl border p-6 w-full max-w-md'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>登录 Och AI</h2>
            <button onClick={() => setIsOpen(false)} className='text-gray-500 hover:text-gray-700'>
              ✕
            </button>
          </div>

          <div className='space-y-4'>
            {/* Google 登录 */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className='w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
            >
              {loading ? '登录中...' : '使用 Google 登录'}
            </button>

            <div className='text-center text-gray-500'>或</div>

            {/* Magic Link 登录 */}
            <form onSubmit={handleEmailLogin} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>邮箱地址</label>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='your@email.com'
                  disabled={loading}
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50'
              >
                {loading ? '发送中...' : '发送 Magic Link'}
              </button>
            </form>

            {/* 状态消息 */}
            {error && <div className='p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
            {success && <div className='p-3 bg-green-100 text-green-700 rounded'>{success}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>AuthModal 测试</h2>
      <p className='mb-4'>测试认证模态框功能</p>

      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        打开登录模态框
      </button>

      <ModalContent />
    </div>
  )
}
