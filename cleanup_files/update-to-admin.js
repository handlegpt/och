// 更新现有用户为管理员
// 在浏览器控制台中运行此脚本

console.log('🔧 开始更新现有用户为管理员...')

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

      // 2. 更新用户配置为管理员
      console.log('\n🔧 更新用户配置为管理员...')

      return window.supabase
        .from('user_profiles')
        .update({
          subscription_tier: 'admin',
          is_admin: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single()
    })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ 更新用户配置失败:', error)

        // 如果更新失败，可能是记录不存在，尝试创建
        if (error.code === 'PGRST116') {
          console.log('\n🆕 用户配置不存在，尝试创建管理员配置...')
          return window.supabase.auth.getUser().then(({ data: { user } }) => {
            const email = user.email || ''
            const baseUsername = email.split('@')[0] || 'user'

            return window.supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                username: baseUsername,
                display_name: baseUsername,
                subscription_tier: 'admin',
                is_admin: true,
              })
              .select()
              .single()
          })
        }
        return
      }

      console.log('✅ 用户配置更新成功:')
      console.log('- ID:', data.id)
      console.log('- 用户名:', data.username)
      console.log('- 显示名称:', data.display_name)
      console.log('- 订阅等级:', data.subscription_tier)
      console.log('- 管理员:', data.is_admin)
      console.log('- 更新时间:', data.updated_at)

      // 3. 验证管理员权限
      console.log('\n🔐 验证管理员权限...')
      const isAdmin = data.is_admin === true || data.subscription_tier === 'admin'
      console.log('- 计算结果:', isAdmin)

      if (isAdmin) {
        console.log('🎉 用户已成功更新为管理员！')
        console.log('💡 提示：')
        console.log('  - 显示名称:', data.display_name)
        console.log('  - 订阅等级:', data.subscription_tier)
        console.log('  - 管理员权限:', data.is_admin)
        console.log('  - 请刷新页面查看效果')
      } else {
        console.log('⚠️ 管理员权限设置可能有问题')
      }

      return data
    })
    .then(data => {
      if (!data) return

      // 4. 提供测试建议
      console.log('\n🧪 测试建议:')
      console.log('1. 刷新当前页面')
      console.log('2. 检查右上角用户信息显示')
      console.log('3. 访问 /admingame 页面测试权限')
      console.log('4. 如果仍有问题，运行 diagnose-admin-issue.js 诊断')
    })
    .catch(error => {
      console.error('❌ 更新用户配置异常:', error)
    })
}

console.log('\n📋 使用说明:')
console.log('1. 此脚本会更新现有用户配置为管理员')
console.log('2. 如果用户配置不存在，会自动创建')
console.log('3. 更新成功后请刷新页面测试')
console.log('4. 如果问题持续，可以运行诊断脚本进一步分析')
