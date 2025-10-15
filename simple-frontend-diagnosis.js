// 简化的前端诊断脚本 - 不依赖 window.supabase
// 在浏览器控制台执行此脚本

console.log('🔍 开始简化前端诊断...')

// 1. 检查环境变量
console.log('1️⃣ 检查环境变量')
console.log('当前页面URL:', window.location.href)
console.log('用户代理:', navigator.userAgent)

// 2. 检查本地存储
console.log('2️⃣ 检查本地存储')
console.log('localStorage keys:', Object.keys(localStorage))
console.log('sessionStorage keys:', Object.keys(sessionStorage))

// 3. 检查是否有 Supabase 相关的存储
console.log('3️⃣ 检查 Supabase 存储')
const supabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'))
console.log('Supabase localStorage keys:', supabaseKeys)

if (supabaseKeys.length > 0) {
  supabaseKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key)
      console.log(`${key}:`, value ? '有数据' : '无数据')
    } catch {
      console.log(`${key}: 读取失败`)
    }
  })
}

// 4. 检查网络请求
console.log('4️⃣ 检查网络请求')
console.log('检查是否有失败的 API 请求...')

// 5. 检查页面状态
console.log('5️⃣ 检查页面状态')
console.log('页面标题:', document.title)
console.log('当前路径:', window.location.pathname)

// 6. 检查是否有错误信息
console.log('6️⃣ 检查控制台错误')
console.log('请查看控制台是否有红色错误信息')

// 7. 检查用户状态显示
console.log('7️⃣ 检查用户状态显示')
const userElements = document.querySelectorAll(
  '[class*="user"], [class*="admin"], [class*="profile"]'
)
console.log('找到的用户相关元素:', userElements.length)

// 8. 检查认证相关元素
console.log('8️⃣ 检查认证相关元素')
const authElements = document.querySelectorAll(
  '[class*="auth"], [class*="login"], [class*="logout"]'
)
console.log('找到的认证相关元素:', authElements.length)

// 9. 检查页面内容
console.log('9️⃣ 检查页面内容')
const pageContent = document.body.innerText
if (pageContent.includes('访问被拒绝')) {
  console.log('❌ 页面显示"访问被拒绝"')
} else if (pageContent.includes('管理员')) {
  console.log('✅ 页面显示管理员相关内容')
} else {
  console.log('ℹ️ 页面内容正常')
}

// 10. 检查是否有加载状态
console.log('10️⃣ 检查加载状态')
const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]')
console.log('找到的加载元素:', loadingElements.length)

console.log('🔍 诊断完成！请查看上述信息。')
