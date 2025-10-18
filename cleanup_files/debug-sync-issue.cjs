// 调试数据同步问题
// 检查为什么前端显示的数据与数据库不一致

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

console.log('🔍 调试数据同步问题...')

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function debugSyncIssue() {
  try {
    const userId = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'
    
    console.log('👤 目标用户ID:', userId)
    
    // 1. 直接查询数据库中的用户配置
    console.log('\n1️⃣ 直接查询数据库...')
    
    const { data: dbProfile, error: dbError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (dbError) {
      console.log('❌ 数据库查询失败:', dbError)
      return
    }
    
    console.log('✅ 数据库中的用户配置:')
    console.log('- ID:', dbProfile.id)
    console.log('- 用户名:', dbProfile.username)
    console.log('- 显示名称:', dbProfile.display_name)
    console.log('- 订阅等级:', dbProfile.subscription_tier)
    console.log('- 管理员:', dbProfile.is_admin)
    console.log('- 创建时间:', dbProfile.created_at)
    console.log('- 更新时间:', dbProfile.updated_at)
    
    // 2. 检查管理员权限计算
    console.log('\n2️⃣ 检查管理员权限计算...')
    
    const isAdminByFlag = dbProfile.is_admin === true
    const isAdminByTier = dbProfile.subscription_tier === 'admin'
    const isAdmin = isAdminByFlag || isAdminByTier
    
    console.log('- is_admin 字段:', dbProfile.is_admin, '(类型:', typeof dbProfile.is_admin, ')')
    console.log('- subscription_tier:', dbProfile.subscription_tier)
    console.log('- is_admin === true:', isAdminByFlag)
    console.log('- subscription_tier === "admin":', isAdminByTier)
    console.log('- 最终 isAdmin 结果:', isAdmin)
    
    if (isAdmin) {
      console.log('✅ 数据库显示用户是管理员')
    } else {
      console.log('❌ 数据库显示用户不是管理员')
    }
    
    // 3. 检查前端可能的问题
    console.log('\n3️⃣ 分析前端问题...')
    
    console.log('💡 可能的问题:')
    console.log('1. 前端缓存问题 - 浏览器缓存了旧数据')
    console.log('2. 状态更新问题 - React 状态没有正确更新')
    console.log('3. 权限判断逻辑问题 - 前端逻辑有误')
    console.log('4. 数据格式问题 - 数据类型不匹配')
    
    // 4. 提供解决方案
    console.log('\n4️⃣ 解决方案:')
    
    if (isAdmin) {
      console.log('✅ 数据库配置正确，问题在前端')
      console.log('🔧 建议的解决步骤:')
      console.log('1. 清除浏览器缓存和 localStorage')
      console.log('2. 硬刷新页面 (Ctrl+F5 或 Cmd+Shift+R)')
      console.log('3. 检查浏览器控制台是否有错误')
      console.log('4. 尝试在隐私模式下访问')
      console.log('5. 检查网络连接和 Supabase 状态')
    } else {
      console.log('❌ 数据库配置有问题')
      console.log('🔧 需要修复数据库配置')
    }
    
    // 5. 提供强制刷新建议
    console.log('\n5️⃣ 强制刷新建议:')
    console.log('在浏览器控制台执行以下代码:')
    console.log('')
    console.log('// 清除所有缓存')
    console.log('localStorage.clear();')
    console.log('sessionStorage.clear();')
    console.log('')
    console.log('// 强制刷新页面')
    console.log('window.location.reload(true);')
    
  } catch (error) {
    console.error('❌ 调试过程异常:', error)
  }
}

// 运行调试
debugSyncIssue()

