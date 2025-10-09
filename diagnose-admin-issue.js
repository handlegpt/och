// 诊断现有管理员用户问题
// 在浏览器控制台中运行此脚本

console.log('🔍 开始诊断现有管理员用户问题...')

// 检查 Supabase 客户端
if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase 客户端未找到')
  console.log('请确保在正确的页面上运行此脚本')
} else {
  console.log('✅ Supabase 客户端已找到')

  // 1. 检查当前用户
  window.supabase.auth
    .getUser()
    .then(({ data: { user }, error }) => {
      if (error) {
        console.error('❌ 获取当前用户失败:', error)
        return
      }

      if (!user) {
        console.log('ℹ️ 用户未登录')
        return
      }

      console.log('👤 当前用户信息:')
      console.log('- ID:', user.id)
      console.log('- 邮箱:', user.email)
      console.log('- 创建时间:', user.created_at)
      console.log('- 邮箱确认时间:', user.email_confirmed_at)

      // 2. 检查用户配置
      console.log('\n🔍 检查用户配置...')
      return window.supabase.from('user_profiles').select('*').eq('id', user.id).single()
    })
    .then(({ data: profile, error: profileError }) => {
      if (profileError) {
        console.error('❌ 获取用户配置失败:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
        })

        // 分析错误类型
        if (profileError.code === 'PGRST116') {
          console.log('🔍 分析：用户配置不存在')
        } else if (profileError.code === '42501') {
          console.log('🔍 分析：权限不足，可能是 RLS 策略问题')
        } else {
          console.log('🔍 分析：其他数据库错误')
        }
        return null
      }

      console.log('✅ 用户配置获取成功:')
      console.log('- ID:', profile.id)
      console.log('- 用户名:', profile.username)
      console.log('- 显示名称:', profile.display_name)
      console.log('- 订阅等级:', profile.subscription_tier)
      console.log('- 管理员:', profile.is_admin)
      console.log('- 创建时间:', profile.created_at)
      console.log('- 更新时间:', profile.updated_at)

      // 3. 检查管理员权限逻辑
      console.log('\n🔐 管理员权限分析:')
      const isAdminByFlag = profile.is_admin === true
      const isAdminByTier = profile.subscription_tier === 'admin'
      const isAdmin = isAdminByFlag || isAdminByTier

      console.log('- is_admin 字段:', profile.is_admin, '(类型:', typeof profile.is_admin, ')')
      console.log('- subscription_tier:', profile.subscription_tier)
      console.log('- is_admin === true:', isAdminByFlag)
      console.log('- subscription_tier === "admin":', isAdminByTier)
      console.log('- 最终计算结果:', isAdmin)

      if (!isAdmin) {
        console.log('❌ 问题发现：用户不是管理员')
        console.log('💡 建议：需要更新用户配置为管理员')
      } else {
        console.log('✅ 用户配置显示为管理员，但前端可能没有正确识别')
        console.log('💡 建议：检查前端权限判断逻辑')
      }

      return profile
    })
    .then(profile => {
      // 4. 检查所有用户配置（如果有权限）
      console.log('\n👥 检查所有用户配置...')
      return window.supabase
        .from('user_profiles')
        .select('id, username, display_name, subscription_tier, is_admin')
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data: allProfiles, error: allError }) => {
          if (allError) {
            console.error('❌ 获取所有用户配置失败:', allError)
            return profile
          }

          console.log('📋 最近10个用户配置:')
          allProfiles.forEach((p, index) => {
            const isAdmin = p.is_admin === true || p.subscription_tier === 'admin'
            console.log(
              `${index + 1}. ${p.username} (${p.display_name}) - ${p.subscription_tier} - 管理员: ${isAdmin}`
            )
          })

          return profile
        })
    })
    .then(profile => {
      // 5. 提供修复建议
      console.log('\n💡 修复建议:')

      if (!profile) {
        console.log('1. 用户配置不存在，需要创建')
        console.log('2. 运行 create-admin-profile.js 脚本')
      } else if (!(profile.is_admin === true || profile.subscription_tier === 'admin')) {
        console.log('1. 用户配置存在但不是管理员')
        console.log('2. 运行 update-to-admin.js 脚本')
      } else {
        console.log('1. 用户配置正确，问题可能在前端')
        console.log('2. 检查 useAuth hook 中的权限判断逻辑')
        console.log('3. 尝试刷新页面或清除浏览器缓存')
      }

      console.log('\n🔄 下一步操作:')
      console.log('- 如果问题持续，可以创建新的管理员用户')
      console.log('- 运行 create-new-admin.js 脚本')
    })
    .catch(error => {
      console.error('❌ 诊断过程异常:', error)
    })
}

console.log('\n📋 诊断说明:')
console.log('1. 此脚本会全面检查当前用户状态')
console.log('2. 分析管理员权限判断逻辑')
console.log('3. 提供具体的修复建议')
console.log('4. 如果问题复杂，建议创建新的管理员用户')
