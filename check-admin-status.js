// 管理员权限检查脚本
// 在浏览器控制台中运行此脚本来检查当前用户的管理员状态

console.log('🔍 检查管理员权限状态...')

// 检查当前用户信息
if (typeof window.supabase !== 'undefined') {
  window.supabase.auth.getUser().then(({ data: { user }, error }) => {
    if (error) {
      console.error('❌ 获取用户信息失败:', error)
      return
    }

    if (!user) {
      console.log('ℹ️ 用户未登录')
      return
    }

    console.log('👤 当前用户信息:')
    console.log('- 用户ID:', user.id)
    console.log('- 邮箱:', user.email)
    console.log('- 创建时间:', user.created_at)

    // 检查用户配置
    window.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data: profile, error: profileError }) => {
        if (profileError) {
          console.error('❌ 获取用户配置失败:', profileError)
          return
        }

        console.log('📋 用户配置信息:')
        console.log('- 用户名:', profile.username)
        console.log('- 显示名称:', profile.display_name)
        console.log('- 订阅等级:', profile.subscription_tier)
        console.log('- 是否管理员:', profile.is_admin)

        // 检查管理员权限
        const isAdmin =
          profile.is_admin === true ||
          profile.subscription_tier === 'admin' ||
          user.email?.includes('@och.ai') ||
          user.email === 'admin@och.ai' ||
          user.email === 'your-email@example.com'

        console.log('🔐 管理员权限检查:')
        console.log('- 计算结果:', isAdmin)
        console.log('- is_admin 字段:', profile.is_admin)
        console.log('- subscription_tier:', profile.subscription_tier)
        console.log('- 邮箱检查:', user.email?.includes('@och.ai'))

        if (isAdmin) {
          console.log('✅ 您有管理员权限！')
          console.log('🌐 可以访问: https://och.ai/admingame')
        } else {
          console.log('❌ 您没有管理员权限')
          console.log('💡 需要设置 is_admin = true 或 subscription_tier = "admin"')
        }
      })
  })
} else {
  console.error('❌ Supabase 客户端未找到')
}

console.log('📝 如需设置管理员权限，请在 Supabase Dashboard 中运行 fix-admin-permissions.sql 脚本')
