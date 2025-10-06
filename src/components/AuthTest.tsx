import React from 'react'
import { useAuth } from '../hooks/useAuth'

const AuthTest: React.FC = () => {
  const { user, userProfile, isAdmin, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔐 认证状态测试</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>用户信息:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(
            {
              userId: user?.id,
              email: user?.email,
              isAuthenticated: !!user,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>用户档案:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(
            {
              subscription_tier: userProfile?.subscription_tier,
              is_admin: userProfile?.is_admin,
              username: userProfile?.username,
              display_name: userProfile?.display_name,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>权限状态:</h3>
        <div
          style={{
            padding: '10px',
            borderRadius: '4px',
            background: isAdmin ? '#d4edda' : '#f8d7da',
            color: isAdmin ? '#155724' : '#721c24',
          }}
        >
          {isAdmin ? '✅ 管理员权限' : '❌ 非管理员'}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>调试信息:</h3>
        <ul>
          <li>userProfile?.is_admin: {String(userProfile?.is_admin)}</li>
          <li>userProfile?.subscription_tier: {userProfile?.subscription_tier}</li>
          <li>user?.email: {user?.email}</li>
          <li>isAdmin 计算: {String(isAdmin)}</li>
        </ul>
      </div>
    </div>
  )
}

export default AuthTest
