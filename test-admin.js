// 管理员权限测试脚本
// 在浏览器控制台中运行

async function testAdminPermissions() {
  console.log('🔍 开始测试管理员权限...')

  try {
    // 检查 Supabase 客户端
    if (!window.supabase) {
      console.error('❌ Supabase 客户端未找到')
      return
    }

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await window.supabase.auth.getUser()

    if (userError) {
      console.error('❌ 获取用户失败:', userError)
      return
    }

    if (!user) {
      console.log('ℹ️ 用户未登录，请先登录')
      return
    }

    console.log('👤 当前用户信息:')
    console.log('- 用户ID:', user.id)
    console.log('- 邮箱:', user.email)

    // 获取用户配置
    const { data: profile, error: profileError } = await window.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('❌ 获取用户配置失败:', profileError)
      return
    }

    console.log('📋 用户配置:')
    console.log('- 用户名:', profile.username)
    console.log('- 显示名称:', profile.display_name)
    console.log('- 订阅等级:', profile.subscription_tier)
    console.log('- is_admin 字段:', profile.is_admin)

    // 计算管理员权限
    const isAdmin =
      profile.is_admin === true ||
      profile.subscription_tier === 'admin' ||
      user.email?.includes('@och.ai') ||
      user.email === 'admin@och.ai'

    console.log('🔐 管理员权限检查结果:')
    console.log('- 最终结果:', isAdmin ? '✅ 是管理员' : '❌ 不是管理员')
    console.log('- is_admin 字段:', profile.is_admin)
    console.log('- subscription_tier:', profile.subscription_tier)
    console.log('- 邮箱检查:', user.email?.includes('@och.ai'))

    // 测试访问管理员页面
    console.log('🌐 测试访问管理员页面...')
    try {
      const response = await fetch('/admingame')
      console.log('- 页面状态码:', response.status)
      if (response.status === 200) {
        console.log('✅ 可以访问管理员页面')
      } else {
        console.log('❌ 无法访问管理员页面')
      }
    } catch (error) {
      console.error('❌ 访问管理员页面失败:', error)
    }

    // 提供修复建议
    if (!isAdmin) {
      console.log('💡 修复建议:')
      console.log('1. 在 Supabase Dashboard 中运行以下 SQL:')
      console.log(
        `UPDATE user_profiles SET subscription_tier = 'admin', is_admin = true WHERE id = '${user.id}';`
      )
      console.log('2. 或者将您的邮箱添加到管理员邮箱列表中')
    }
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 运行测试
testAdminPermissions()
