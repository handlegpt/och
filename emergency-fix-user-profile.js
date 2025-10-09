// 紧急修复用户配置问题
// 在浏览器控制台中运行此脚本

console.log('🚨 开始紧急修复用户配置问题...')

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

      const email = user.email || ''
      const baseUsername = email.split('@')[0] || 'user'
      const username = `${baseUsername}_admin_${Date.now()}`

      console.log('📝 使用唯一用户名:', username)

      // 2. 直接尝试创建用户配置（忽略现有记录）
      console.log('\n🔧 尝试直接创建用户配置...')

      // 先删除可能存在的记录
      return window.supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)
        .then(() => {
          console.log('🗑️ 已删除现有用户配置记录')

          // 插入新的用户配置
          return window.supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              username: username,
              display_name: baseUsername,
              subscription_tier: 'admin',
              is_admin: true,
            })
            .select()
            .single()
        })
        .catch(insertError => {
          console.error('❌ 创建用户配置失败:', insertError)

          // 如果还是失败，尝试使用 upsert
          console.log('\n🔄 尝试使用 upsert 方法...')
          return window.supabase
            .from('user_profiles')
            .upsert({
              id: user.id,
              username: `${baseUsername}_admin_${Date.now()}`,
              display_name: baseUsername,
              subscription_tier: 'admin',
              is_admin: true,
            })
            .select()
            .single()
        })
    })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ 最终创建用户配置失败:', error)
        return
      }

      console.log('✅ 用户配置创建成功:', data)

      // 验证配置
      return window.supabase.from('user_profiles').select('*').eq('id', data.id).single()
    })
    .then(({ data: profile, error: profileError }) => {
      if (profileError) {
        console.error('❌ 验证用户配置失败:', profileError)
        return
      }

      console.log('✅ 用户配置验证成功:')
      console.log('- ID:', profile.id)
      console.log('- 用户名:', profile.username)
      console.log('- 显示名称:', profile.display_name)
      console.log('- 订阅等级:', profile.subscription_tier)
      console.log('- 管理员:', profile.is_admin)

      // 检查管理员权限
      const isAdmin = profile.is_admin === true || profile.subscription_tier === 'admin'
      console.log('\n🔐 管理员权限检查:')
      console.log('- 计算结果:', isAdmin)

      if (isAdmin) {
        console.log('🎉 修复成功！请刷新页面查看效果')
      } else {
        console.log('⚠️ 管理员权限设置可能有问题')
      }
    })
    .catch(error => {
      console.error('❌ 操作异常:', error)
    })
}

console.log('\n📋 使用说明:')
console.log('1. 查看上面的日志输出')
console.log('2. 如果显示"修复成功"，请刷新页面')
console.log('3. 如果仍有问题，请检查 Supabase 控制台')
