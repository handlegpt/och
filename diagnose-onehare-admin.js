// 专门诊断 onehare 管理员用户问题
// 在浏览器控制台中运行此脚本

console.log('🔍 开始诊断 onehare 管理员用户问题...')

// 检查 Supabase 客户端
if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase 客户端未找到')
  console.log('请确保在正确的页面上运行此脚本')
} else {
  console.log('✅ Supabase 客户端已找到')

  // 1. 检查当前用户认证状态
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

      console.log('👤 当前认证用户信息:')
      console.log('- ID:', user.id)
      console.log('- 邮箱:', user.email)
      console.log('- 创建时间:', user.created_at)
      console.log('- 邮箱确认:', user.email_confirmed_at ? '已确认' : '未确认')

      // 2. 检查用户配置查询
      console.log('\n🔍 检查用户配置查询...')
      return window.supabase.from('user_profiles').select('*').eq('id', user.id).single()
    })
    .then(({ data: profile, error: profileError }) => {
      if (profileError) {
        console.error('❌ 用户配置查询失败:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
        })

        // 分析具体错误
        if (profileError.code === 'PGRST116') {
          console.log('🔍 问题分析：用户配置不存在')
          console.log('💡 原因：数据库中缺少 user_profiles 记录')
          console.log('🛠️ 解决方案：需要创建用户配置记录')
        } else if (profileError.code === '42501') {
          console.log('🔍 问题分析：权限不足')
          console.log('💡 原因：RLS 策略阻止了查询')
          console.log('🛠️ 解决方案：检查 RLS 策略配置')
        } else if (profileError.message.includes('JWT')) {
          console.log('🔍 问题分析：JWT 令牌问题')
          console.log('💡 原因：认证令牌无效或过期')
          console.log('🛠️ 解决方案：重新登录')
        } else {
          console.log('🔍 问题分析：其他数据库错误')
          console.log('💡 原因：', profileError.message)
        }
        return null
      }

      console.log('✅ 用户配置查询成功:')
      console.log('- ID:', profile.id)
      console.log('- 用户名:', profile.username)
      console.log('- 显示名称:', profile.display_name)
      console.log('- 订阅等级:', profile.subscription_tier)
      console.log('- 管理员标志:', profile.is_admin)
      console.log('- 创建时间:', profile.created_at)
      console.log('- 更新时间:', profile.updated_at)

      // 3. 分析管理员权限
      console.log('\n🔐 管理员权限分析:')
      const isAdminByFlag = profile.is_admin === true
      const isAdminByTier = profile.subscription_tier === 'admin'
      const isAdmin = isAdminByFlag || isAdminByTier

      console.log('- is_admin 字段值:', profile.is_admin)
      console.log('- is_admin 字段类型:', typeof profile.is_admin)
      console.log('- is_admin === true:', isAdminByFlag)
      console.log('- subscription_tier:', profile.subscription_tier)
      console.log('- subscription_tier === "admin":', isAdminByTier)
      console.log('- 最终 isAdmin 结果:', isAdmin)

      if (!isAdmin) {
        console.log('❌ 问题发现：用户配置不是管理员')
        console.log('💡 原因：is_admin 或 subscription_tier 设置不正确')
        console.log('🛠️ 解决方案：更新用户配置为管理员')
      } else {
        console.log('✅ 用户配置显示为管理员')
        console.log('💡 问题可能在前端权限判断逻辑')
      }

      return profile
    })
    .then(profile => {
      // 4. 检查前端权限判断逻辑
      console.log('\n⚛️ 检查前端权限判断逻辑...')

      if (profile) {
        // 模拟前端的权限判断逻辑
        const isAdmin = profile.is_admin === true || profile.subscription_tier === 'admin'
        console.log('前端权限判断结果:', isAdmin)

        if (isAdmin) {
          console.log('✅ 前端权限判断：用户是管理员')
          console.log('💡 如果页面仍显示"访问被拒绝"，可能的原因：')
          console.log('  1. 前端状态没有及时更新')
          console.log('  2. 组件重新渲染问题')
          console.log('  3. 缓存问题')
          console.log('🛠️ 建议：刷新页面或清除浏览器缓存')
        } else {
          console.log('❌ 前端权限判断：用户不是管理员')
          console.log('💡 需要修复用户配置数据')
        }
      } else {
        console.log('❌ 无法检查前端权限判断（用户配置不存在）')
      }

      // 5. 提供具体的修复建议
      console.log('\n🛠️ 修复建议:')

      if (!profile) {
        console.log('方案1：创建用户配置')
        console.log('  - 运行 update-to-admin.js 脚本')
        console.log('  - 或手动在 Supabase 控制台创建记录')

        console.log('\n方案2：检查 RLS 策略')
        console.log('  - 运行 check-rls-policies.sql 脚本')
        console.log('  - 确保 RLS 策略允许用户查询自己的配置')
      } else if (!(profile.is_admin === true || profile.subscription_tier === 'admin')) {
        console.log('方案1：更新现有用户配置')
        console.log('  - 运行 update-to-admin.js 脚本')
        console.log('  - 或手动更新数据库记录')

        console.log('\n方案2：检查数据一致性')
        console.log('  - 确认 is_admin 字段为 true')
        console.log('  - 确认 subscription_tier 为 "admin"')
      } else {
        console.log('方案1：前端问题排查')
        console.log('  - 刷新页面')
        console.log('  - 清除浏览器缓存')
        console.log('  - 检查 useAuth hook 逻辑')

        console.log('\n方案2：检查组件状态')
        console.log('  - 确认 AdminDashboard 组件正确获取用户状态')
        console.log('  - 检查权限判断逻辑')
      }
    })
    .catch(error => {
      console.error('❌ 诊断过程异常:', error)
    })
}

console.log('\n📋 诊断说明:')
console.log('1. 此脚本会全面分析 onehare 用户的问题')
console.log('2. 检查认证、数据库查询、权限判断等各个环节')
console.log('3. 提供针对性的修复建议')
console.log('4. 帮助理解问题的根本原因')
