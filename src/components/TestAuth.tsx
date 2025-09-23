import React, { useState, useEffect } from 'react'

// 简化的认证测试组件
export const TestAuth: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 模拟认证状态检查
  useEffect(() => {
    console.log('TestAuth: Checking auth status')

    // 模拟异步认证检查
    const checkAuth = async () => {
      try {
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 模拟检查本地存储
        const storedUser = localStorage.getItem('test-user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, []) // 空依赖数组

  const handleLogin = () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    setUser(mockUser)
    localStorage.setItem('test-user', JSON.stringify(mockUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('test-user')
  }

  if (loading) {
    return <div className='p-4'>Loading authentication...</div>
  }

  return (
    <div className='p-4'>
      <h2>Test Authentication</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <button
            onClick={handleLogin}
            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
          >
            Login
          </button>
        </div>
      )}
    </div>
  )
}
