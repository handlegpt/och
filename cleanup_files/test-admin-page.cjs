// 测试 AdminDashboard 页面的权限检查
// 模拟前端权限判断逻辑

const { createClient } = require('@supabase/supabase-js')

// 从 .env 文件读取配置
const fs = require('fs')
const path = require('path')

// 读取 .env 文件
const envPath = path.join(__dirname, '.env')
const envContent = fs.readFileSync(envPath, 'utf8')

// 解析环境变量
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY

console.log('🧪 测试 AdminDashboard 页面权限检查...')

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function testAdminPage() {
  try {
    const userId = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'
    
    console.log('👤 目标用户ID:', userId)
    
    // 1. 模拟前端的用户配置获取
    console.log('\n1️⃣ 模拟前端用户配置获取...')
    
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (profileError) {
      console.log('❌ 用户配置获取失败:', profileError)
      console.log('💡 这就是为什么 AdminDashboard 显示"访问被拒绝"的原因！')
      return
    }
    
    console.log('✅ 用户配置获取成功:', userProfile)
    
    // 2. 模拟前端的 isAdmin 计算逻辑
    console.log('\n2️⃣ 模拟前端 isAdmin 计算...')
    
    const isAdminByFlag = userProfile.is_admin === true
    const isAdminByTier = userProfile.subscription_tier === 'admin'
    const isAdmin = isAdminByFlag || isAdminByTier
    
    console.log('- userProfile.is_admin:', userProfile.is_admin, '(类型:', typeof userProfile.is_admin, ')')
    console.log('- userProfile.subscription_tier:', userProfile.subscription_tier)
    console.log('- isAdminByFlag (is_admin === true):', isAdminByFlag)
    console.log('- isAdminByTier (subscription_tier === "admin"):', isAdminByTier)
    console.log('- 最终 isAdmin 结果:', isAdmin)
    
    // 3. 模拟 AdminDashboard 的权限检查
    console.log('\n3️⃣ 模拟 AdminDashboard 权限检查...')
    
    if (!isAdmin) {
      console.log('❌ AdminDashboard 会显示"访问被拒绝"')
      console.log('💡 原因：isAdmin 计算结果为 false')
      console.log('🔍 详细分析：')
      
      if (!isAdminByFlag) {
        console.log('  - is_admin 字段检查失败:', userProfile.is_admin, '!== true')
      }
      if (!isAdminByTier) {
        console.log('  - subscription_tier 检查失败:', userProfile.subscription_tier, '!== "admin"')
      }
    } else {
      console.log('✅ AdminDashboard 应该允许访问')
      console.log('💡 如果页面仍显示"访问被拒绝"，可能是：')
      console.log('  1. 前端缓存问题')
      console.log('  2. 组件状态更新问题')
      console.log('  3. 其他组件逻辑问题')
    }
    
    // 4. 提供调试建议
    console.log('\n4️⃣ 调试建议:')
    
    if (isAdmin) {
      console.log('✅ 数据库配置正确，问题在前端')
      console.log('🔧 建议的调试步骤:')
      console.log('1. 在浏览器控制台检查 useAuth hook 的状态')
      console.log('2. 检查 AdminDashboard 组件的 props')
      console.log('3. 查看 React DevTools 中的组件状态')
      console.log('4. 检查是否有其他组件覆盖了权限检查')
    } else {
      console.log('❌ 数据库配置有问题')
      console.log('🔧 需要修复数据库配置')
    }
    
    // 5. 提供浏览器控制台调试代码
    console.log('\n5️⃣ 浏览器控制台调试代码:')
    console.log('在浏览器控制台执行以下代码来调试:')
    console.log('')
    console.log('// 检查 useAuth hook 状态')
    console.log('console.log("useAuth state:", {')
    console.log('  user: window.React?.useContext?.()?.user,')
    console.log('  userProfile: window.React?.useContext?.()?.userProfile,')
    console.log('  isAdmin: window.React?.useContext?.()?.isAdmin')
    console.log('});')
    console.log('')
    console.log('// 或者直接检查全局状态')
    console.log('console.log("Global auth state:", window.__AUTH_STATE__);')
    
  } catch (error) {
    console.error('❌ 测试过程异常:', error)
  }
}

// 运行测试
testAdminPage()

