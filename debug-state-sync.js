// 调试状态同步问题
// 在浏览器控制台执行此脚本

console.log('🔍 调试状态同步问题...')

// 1. 检查 window.supabase 状态
console.log('1️⃣ 检查 Supabase 状态')
if (window.supabase) {
  window.supabase.auth
    .getUser()
    .then(({ data: { user }, error }) => {
      if (error) {
        console.error('❌ 获取用户失败:', error)
        return
      }

      if (!user) {
        console.log('❌ 用户未登录')
        return
      }

      console.log('✅ 当前用户:', user.email)
      console.log('🆔 用户ID:', user.id)

      // 2. 检查用户配置
      return window.supabase.from('user_profiles').select('*').eq('id', user.id).single()
    })
    .then(({ data: profile, error }) => {
      if (error) {
        console.error('❌ 获取用户配置失败:', error)
        return
      }

      console.log('✅ 用户配置:', profile)
      const isAdmin = profile.is_admin === true || profile.subscription_tier === 'admin'
      console.log('🔐 管理员权限:', isAdmin)

      // 3. 检查 React 组件状态
      console.log('3️⃣ 检查 React 组件状态')

      // 查找 AdminDashboard 组件
      const adminElements = document.querySelectorAll('[class*="admin"], [class*="Admin"]')
      console.log('找到的管理员相关元素:', adminElements.length)

      // 检查页面内容
      const pageContent = document.body.innerText
      if (pageContent.includes('访问被拒绝')) {
        console.log('❌ 页面显示"访问被拒绝"')

        // 检查当前状态显示
        const statusElements = document.querySelectorAll('*')
        statusElements.forEach(el => {
          if (el.innerText && el.innerText.includes('当前状态')) {
            console.log('找到状态显示元素:', el.innerText)
          }
        })
      } else {
        console.log('✅ 页面正常显示')
      }

      // 4. 检查 localStorage 中的状态
      console.log('4️⃣ 检查 localStorage 状态')
      const supabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'))
      console.log('Supabase localStorage keys:', supabaseKeys)

      // 5. 尝试手动刷新状态
      console.log('5️⃣ 尝试手动刷新状态')
      console.log('请点击页面上的"刷新状态"按钮')
    })
    .catch(err => {
      console.error('❌ 操作失败:', err)
    })
} else {
  console.log('❌ Supabase 客户端不可用')
}

console.log('🔍 调试完成！')
