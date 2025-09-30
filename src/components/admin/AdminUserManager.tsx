import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

interface User {
  id: string
  email: string
  subscription_tier: string
  created_at: string
  last_active_at?: string
}

export const AdminUserManager: React.FC = () => {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, subscription_tier, created_at, last_active_at')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const setUserAsAdmin = async (userId: string, email: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'admin' })
        .eq('id', userId)

      if (error) throw error

      setMessage(`✅ ${email} 已设置为管理员`)
      fetchUsers() // 刷新用户列表
    } catch (error) {
      console.error('Error setting admin:', error)
      setMessage(`❌ 设置失败: ${error.message}`)
    }
  }

  const removeAdmin = async (userId: string, email: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', userId)

      if (error) throw error

      setMessage(`✅ ${email} 已移除管理员权限`)
      fetchUsers() // 刷新用户列表
    } catch (error) {
      console.error('Error removing admin:', error)
      setMessage(`❌ 操作失败: ${error.message}`)
    }
  }

  const addAdminByEmail = async () => {
    if (!newAdminEmail.trim()) {
      setMessage('❌ 请输入邮箱地址')
      return
    }

    if (!supabase) return

    try {
      // 查找用户
      const { data: user, error: findError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('email', newAdminEmail.trim())
        .single()

      if (findError) {
        setMessage(`❌ 用户 ${newAdminEmail} 不存在`)
        return
      }

      // 设置为管理员
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'admin' })
        .eq('id', user.id)

      if (updateError) throw updateError

      setMessage(`✅ ${newAdminEmail} 已设置为管理员`)
      setNewAdminEmail('')
      fetchUsers() // 刷新用户列表
    } catch (error) {
      console.error('Error adding admin:', error)
      setMessage(`❌ 设置失败: ${error.message}`)
    }
  }

  if (!isAdmin) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-bold text-red-500 mb-4'>访问被拒绝</h2>
        <p className='text-gray-600'>您没有管理员权限访问此页面。</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='text-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4'></div>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h3 className='text-lg font-semibold mb-4'>添加管理员</h3>
        <div className='flex gap-2'>
          <input
            type='email'
            value={newAdminEmail}
            onChange={e => setNewAdminEmail(e.target.value)}
            placeholder='输入用户邮箱'
            className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={addAdminByEmail}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
          >
            设为管理员
          </button>
        </div>
        {message && (
          <div
            className={`mt-2 p-2 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message}
          </div>
        )}
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold'>用户管理</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  邮箱
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  权限等级
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  注册时间
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  操作
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {users.map(user => (
                <tr key={user.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {user.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.subscription_tier === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.subscription_tier === 'pro'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.subscription_tier === 'admin'
                        ? '管理员'
                        : user.subscription_tier === 'pro'
                          ? '专业版'
                          : '免费版'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    {user.subscription_tier === 'admin' ? (
                      <button
                        onClick={() => removeAdmin(user.id, user.email)}
                        className='text-red-600 hover:text-red-900'
                      >
                        移除管理员
                      </button>
                    ) : (
                      <button
                        onClick={() => setUserAsAdmin(user.id, user.email)}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        设为管理员
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
