// 修复 onehare 管理员用户问题
// 在浏览器控制台中运行此脚本

console.log('🔧 开始修复 onehare 管理员用户问题...')

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

      // 2. 尝试修复用户配置
      console.log('\n🔧 尝试修复用户配置...')

      const email = user.email || ''
      const baseUsername = email.split('@')[0] || 'user'

      // 先尝试更新现有记录
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
        .then(({ data, error }) => {
          if (error && error.code === 'PGRST116') {
            // 记录不存在，创建新记录
            console.log('📝 用户配置不存在，创建新记录...')
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
          } else if (error) {
            throw error
          } else {
            console.log('✅ 用户配置更新成功')
            return { data, error: null }
          }
        })
    })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ 修复用户配置失败:', error)
        return
      }

      console.log('✅ 用户配置修复成功:')
      console.log('- ID:', data.id)
      console.log('- 用户名:', data.username)
      console.log('- 显示名称:', data.display_name)
      console.log('- 订阅等级:', data.subscription_tier)
      console.log('- 管理员:', data.is_admin)

      // 3. 验证修复结果
      console.log('\n🔐 验证修复结果...')
      const isAdmin = data.is_admin === true || data.subscription_tier === 'admin'
      console.log('- 管理员权限验证:', isAdmin)

      if (isAdmin) {
        console.log('🎉 onehare 用户已成功修复为管理员！')
        console.log('💡 现在应该可以：')
        console.log('  - 在右上角看到管理员标识')
        console.log('  - 访问 /admingame 页面')
        console.log('  - 使用所有管理员功能')
      } else {
        console.log('⚠️ 修复可能不完整，请检查数据')
      }

      return data
    })
    .then(data => {
      if (!data) return

      // 4. 提供测试步骤
      console.log('\n🧪 测试步骤:')
      console.log('1. 刷新当前页面')
      console.log('2. 检查右上角用户信息（应该显示管理员）')
      console.log('3. 访问 /admingame 页面（应该能正常访问）')
      console.log('4. 如果仍有问题，运行 diagnose-onehare-admin.js 进一步诊断')

      // 5. 提供未来提升用户的建议
      console.log('\n💡 未来提升用户为管理员的建议:')
      console.log('1. 确保用户已登录并确认邮箱')
      console.log('2. 在 user_profiles 表中设置：')
      console.log('   - subscription_tier = "admin"')
      console.log('   - is_admin = true')
      console.log('3. 检查 RLS 策略允许用户查询自己的配置')
      console.log('4. 确保前端权限判断逻辑正确')
    })
    .catch(error => {
      console.error('❌ 修复过程异常:', error)
    })
}

console.log('\n📋 使用说明:')
console.log('1. 此脚本专门修复 onehare 用户的管理员权限')
console.log('2. 会尝试更新现有记录或创建新记录')
console.log('3. 修复成功后请刷新页面测试')
console.log('4. 如果问题持续，运行诊断脚本进一步分析')
