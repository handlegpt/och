// 调试特定用户配置问题
// 用户ID: 531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e
// 在浏览器控制台中运行

console.log('🔍 开始调试用户配置问题...')
console.log('用户ID: 531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e')

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

        // 如果是配置不存在，尝试创建
        if (profileError.code === 'PGRST116') {
          console.log('🆕 用户配置不存在，尝试创建...')
          return createUserProfile()
        }
        return
      }

      console.log('✅ 用户配置获取成功:')
      console.log('- ID:', profile.id)
      console.log('- 用户名:', profile.username)
      console.log('- 显示名称:', profile.display_name)
      console.log('- 订阅等级:', profile.subscription_tier)
      console.log('- 管理员:', profile.is_admin)
      console.log('- 创建时间:', profile.created_at)
      console.log('- 更新时间:', profile.updated_at)

      // 检查管理员权限
      const isAdmin = profile.is_admin === true || profile.subscription_tier === 'admin'
      console.log('\n🔐 管理员权限检查:')
      console.log('- 计算结果:', isAdmin)
      console.log('- is_admin 字段:', profile.is_admin)
      console.log('- subscription_tier:', profile.subscription_tier)
    })
    .catch(error => {
      console.error('❌ 操作异常:', error)
    })
}

// 创建用户配置的函数
async function createUserProfile() {
  try {
    const { data: userData } = await window.supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      console.error('❌ 无法获取用户信息')
      return
    }

    const email = user.email || ''
    const baseUsername = email.split('@')[0] || 'user'

    // 生成唯一的用户名
    let username = baseUsername
    let counter = 1

    console.log('🔍 检查用户名可用性...')

    while (true) {
      const { data: existingUser } = await window.supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (!existingUser) {
        break // 用户名可用
      }

      console.log(`⚠️ 用户名 "${username}" 已存在，尝试 "${baseUsername}${counter}"`)
      username = `${baseUsername}${counter}`
      counter++

      if (counter > 100) {
        // 防止无限循环，使用 UUID 后缀
        username = `${baseUsername}_${user.id.slice(-8)}`
        console.log(`⚠️ 使用 UUID 后缀: "${username}"`)
        break
      }
    }

    console.log('🆕 创建用户配置...')
    console.log('- 用户ID:', user.id)
    console.log('- 邮箱:', email)
    console.log('- 基础用户名:', baseUsername)
    console.log('- 最终用户名:', username)

    const { data, error } = await window.supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        username: username,
        display_name: baseUsername, // 显示名称使用原始邮箱前缀
        subscription_tier: 'admin', // 设置为管理员
        is_admin: true, // 设置为管理员
      })
      .select()
      .single()

    if (error) {
      console.error('❌ 创建用户配置失败:', error)
      return
    }

    console.log('✅ 用户配置创建成功:', data)

    // 刷新页面以应用新配置
    console.log('🔄 建议刷新页面以应用新配置')
  } catch (error) {
    console.error('❌ 创建用户配置异常:', error)
  }
}

console.log('\n📋 使用说明:')
console.log('1. 查看上面的日志输出')
console.log('2. 如果用户配置不存在，会自动尝试创建')
console.log('3. 如果创建成功，建议刷新页面')
console.log('4. 如果仍有问题，请检查 Supabase 控制台')
