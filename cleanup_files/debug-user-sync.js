// 用户状态同步调试脚本
// 在浏览器控制台中运行此脚本来检查用户状态同步问题

console.log('🔍 开始用户状态同步调试...')

// 检查当前页面状态
console.log('📄 当前页面信息:')
console.log('- URL:', window.location.href)
console.log('- 页面标题:', document.title)

// 检查 localStorage 中的用户数据
console.log('\n💾 LocalStorage 检查:')
const authKeys = Object.keys(localStorage).filter(
  key => key.includes('supabase') || key.includes('auth') || key.includes('user')
)
authKeys.forEach(key => {
  try {
    const value = localStorage.getItem(key)
    console.log(`- ${key}:`, value ? JSON.parse(value) : 'null')
  } catch {
    console.log(`- ${key}:`, localStorage.getItem(key))
  }
})

// 检查 sessionStorage
console.log('\n🗂️ SessionStorage 检查:')
const sessionKeys = Object.keys(sessionStorage).filter(
  key => key.includes('supabase') || key.includes('auth') || key.includes('user')
)
sessionKeys.forEach(key => {
  try {
    const value = sessionStorage.getItem(key)
    console.log(`- ${key}:`, value ? JSON.parse(value) : 'null')
  } catch {
    console.log(`- ${key}:`, sessionStorage.getItem(key))
  }
})

// 检查页面中的用户信息显示
console.log('\n👤 页面用户信息检查:')
const userElements = document.querySelectorAll('[data-testid*="user"], .user-info, .user-profile')
userElements.forEach((el, index) => {
  console.log(`- 用户元素 ${index + 1}:`, el.textContent?.trim())
})

// 检查是否有 React DevTools
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('\n⚛️ React DevTools 可用')
} else {
  console.log('\n⚛️ React DevTools 不可用')
}

// 检查全局变量
console.log('\n🌐 全局变量检查:')
console.log('- window.supabase:', typeof window.supabase)
console.log(
  '- window.__REACT_DEVTOOLS_GLOBAL_HOOK__:',
  typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__
)

// 模拟用户状态检查
console.log('\n🧪 模拟状态检查:')
console.log('请手动检查以下内容:')
console.log('1. 在正常页面查看用户显示名称')
console.log('2. 切换到 /admingame 页面')
console.log('3. 对比两个页面的用户信息是否一致')
console.log('4. 检查浏览器控制台中的认证日志')

// 提供清理建议
console.log('\n🧹 如果发现状态不一致，可以尝试:')
console.log('1. 清除浏览器缓存和 localStorage')
console.log('2. 重新登录')
console.log('3. 检查网络连接')
console.log('4. 查看 Supabase 控制台中的认证日志')

console.log('\n✅ 调试脚本执行完成')
