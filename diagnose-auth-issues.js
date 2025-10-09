// 认证问题诊断脚本
// 在浏览器控制台中运行此脚本来诊断认证问题

console.log('🔍 开始认证问题诊断...')

// 检查环境变量
console.log('\n📋 环境检查:')
console.log('当前域名:', window.location.origin)
console.log('当前路径:', window.location.pathname)
console.log('是否 HTTPS:', window.location.protocol === 'https:')

// 检查 Supabase 客户端
if (typeof window.supabase !== 'undefined') {
  console.log('\n✅ Supabase 客户端已加载')

  // 检查当前会话
  window.supabase.auth.getSession().then(({ data, error }) => {
    console.log('\n🔐 当前会话状态:')
    if (error) {
      console.error('❌ 会话错误:', error)
    } else if (data.session) {
      console.log('✅ 用户已登录:', data.session.user.email)
    } else {
      console.log('ℹ️ 用户未登录')
    }
  })
} else {
  console.log('\n❌ Supabase 客户端未找到')
}

// 检查认证回调参数
console.log('\n🔗 URL 参数检查:')
const urlParams = new URLSearchParams(window.location.search)
const hashParams = new URLSearchParams(window.location.hash.substring(1))

console.log('查询参数:', Object.fromEntries(urlParams))
console.log('Hash 参数:', Object.fromEntries(hashParams))

// 检查是否有认证相关的参数
const authParams = ['access_token', 'refresh_token', 'token_hash', 'type']
const foundAuthParams = [...urlParams.keys(), ...hashParams.keys()].filter(param =>
  authParams.includes(param)
)

if (foundAuthParams.length > 0) {
  console.log('✅ 发现认证参数:', foundAuthParams)
} else {
  console.log('ℹ️ 未发现认证参数')
}

// 测试认证回调处理
if (window.location.pathname === '/auth/callback') {
  console.log('\n🎯 认证回调页面检测:')
  console.log('✅ 当前在认证回调页面')

  // 检查是否有错误
  const errorParam = urlParams.get('error') || hashParams.get('error')
  if (errorParam) {
    console.error('❌ 认证错误:', errorParam)
    const errorDescription =
      urlParams.get('error_description') || hashParams.get('error_description')
    if (errorDescription) {
      console.error('错误描述:', errorDescription)
    }
  } else {
    console.log('✅ 未发现认证错误')
  }
}

// 检查网络连接
console.log('\n🌐 网络连接检查:')
fetch('/health')
  .then(response => {
    if (response.ok) {
      console.log('✅ 服务器健康检查通过')
    } else {
      console.log('⚠️ 服务器健康检查失败:', response.status)
    }
  })
  .catch(error => {
    console.error('❌ 无法连接到服务器:', error)
  })

// 检查 CORS 问题
console.log('\n🔒 CORS 检查:')
fetch('https://och.ai/auth/callback', { method: 'HEAD' })
  .then(response => {
    console.log('✅ 认证回调端点可访问:', response.status)
  })
  .catch(error => {
    console.error('❌ 认证回调端点访问失败:', error)
  })

console.log('\n📝 诊断完成！请查看上述信息并参考故障排除指南。')
