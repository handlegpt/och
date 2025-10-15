// 检查所有用户和管理员
// 查看数据库中的用户配置情况

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

console.log('🔍 检查所有用户和管理员...')

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllUsers() {
  try {
    // 1. 检查所有认证用户
    console.log('\n1️⃣ 检查所有认证用户...')
    
    // 注意：我们无法直接查询 auth.users 表，但可以检查 user_profiles
    console.log('💡 无法直接查询 auth.users 表（权限限制）')
    console.log('💡 但可以通过 user_profiles 表了解用户情况')
    
    // 2. 检查所有用户配置
    console.log('\n2️⃣ 检查所有用户配置...')
    
    const { data: allProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (profilesError) {
      console.log('❌ 查询用户配置失败:', profilesError)
      return
    }
    
    console.log(`📊 总共找到 ${allProfiles.length} 个用户配置:`)
    console.log('')
    
    allProfiles.forEach((profile, index) => {
      const isAdmin = profile.is_admin === true || profile.subscription_tier === 'admin'
      const adminStatus = isAdmin ? '👑 管理员' : '👤 普通用户'
      
      console.log(`${index + 1}. ${adminStatus}`)
      console.log(`   ID: ${profile.id}`)
      console.log(`   用户名: ${profile.username}`)
      console.log(`   显示名称: ${profile.display_name}`)
      console.log(`   订阅等级: ${profile.subscription_tier}`)
      console.log(`   管理员标志: ${profile.is_admin}`)
      console.log(`   创建时间: ${profile.created_at}`)
      console.log(`   更新时间: ${profile.updated_at}`)
      console.log('')
    })
    
    // 3. 统计管理员用户
    console.log('\n3️⃣ 管理员用户统计...')
    
    const adminUsers = allProfiles.filter(profile => 
      profile.is_admin === true || profile.subscription_tier === 'admin'
    )
    
    console.log(`👑 管理员用户数量: ${adminUsers.length}`)
    
    if (adminUsers.length > 0) {
      console.log('管理员用户列表:')
      adminUsers.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.username} (${admin.display_name})`)
        console.log(`      - 订阅等级: ${admin.subscription_tier}`)
        console.log(`      - 管理员标志: ${admin.is_admin}`)
      })
    } else {
      console.log('⚠️ 没有找到任何管理员用户！')
    }
    
    // 4. 检查特定用户
    console.log('\n4️⃣ 检查特定用户...')
    
    const targetUserId = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'
    const targetUser = allProfiles.find(profile => profile.id === targetUserId)
    
    if (targetUser) {
      console.log(`✅ 找到目标用户 (${targetUserId}):`)
      console.log(`   用户名: ${targetUser.username}`)
      console.log(`   显示名称: ${targetUser.display_name}`)
      console.log(`   订阅等级: ${targetUser.subscription_tier}`)
      console.log(`   管理员标志: ${targetUser.is_admin}`)
      
      const isAdmin = targetUser.is_admin === true || targetUser.subscription_tier === 'admin'
      console.log(`   管理员状态: ${isAdmin ? '是管理员' : '不是管理员'}`)
    } else {
      console.log(`❌ 没有找到目标用户 (${targetUserId})`)
      console.log('💡 这就是问题所在 - onehare 用户没有 user_profiles 记录！')
    }
    
    // 5. 提供修复建议
    console.log('\n5️⃣ 修复建议...')
    
    if (adminUsers.length === 0) {
      console.log('🚨 严重问题：系统中没有任何管理员用户！')
      console.log('💡 建议：')
      console.log('   1. 在 Supabase 控制台执行 SQL 脚本创建管理员')
      console.log('   2. 或者修改 RLS 策略允许创建用户配置')
    } else if (!targetUser) {
      console.log('💡 建议：为 onehare 用户创建 user_profiles 记录')
      console.log('   在 Supabase 控制台执行以下 SQL:')
      console.log('')
      console.log('   SET row_security = off;')
      console.log('   INSERT INTO user_profiles (')
      console.log('       id, username, display_name, subscription_tier, is_admin')
      console.log('   ) VALUES (')
      console.log(`       '${targetUserId}', 'onehare', 'onehare', 'admin', true`)
      console.log('   );')
      console.log('   SET row_security = on;')
    } else {
      console.log('✅ 用户配置正常，问题可能在其他地方')
    }
    
  } catch (error) {
    console.error('❌ 检查过程异常:', error)
  }
}

// 运行检查
checkAllUsers()

