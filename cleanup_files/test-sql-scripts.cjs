// 测试 SQL 脚本
// 使用 Node.js 直接连接 Supabase 数据库

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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 无法从 .env 文件读取 Supabase 配置')
  process.exit(1)
}

console.log('🔗 连接到 Supabase...')
console.log('URL:', supabaseUrl)

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 测试函数
async function testSQLScripts() {
  try {
    console.log('\n🧪 开始测试 SQL 脚本...')
    
    // 1. 测试用户配置查询
    console.log('\n1️⃣ 测试用户配置查询...')
    const userId = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (profileError) {
      console.log('❌ 用户配置查询失败:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details
      })
      
      if (profileError.code === 'PGRST116') {
        console.log('💡 用户配置不存在，这是问题的根源！')
      }
    } else {
      console.log('✅ 用户配置查询成功:', profile)
    }
    
    // 2. 测试创建用户配置
    console.log('\n2️⃣ 测试创建用户配置...')
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username: 'onehare_test',
        display_name: 'onehare',
        subscription_tier: 'admin',
        is_admin: true
      })
      .select()
      .single()
    
    if (insertError) {
      console.log('❌ 创建用户配置失败:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details
      })
      
      if (insertError.code === '23505') {
        console.log('💡 用户配置已存在，尝试更新...')
        
        // 尝试更新
        const { data: updateData, error: updateError } = await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'admin',
            is_admin: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single()
        
        if (updateError) {
          console.log('❌ 更新用户配置失败:', updateError)
        } else {
          console.log('✅ 用户配置更新成功:', updateData)
        }
      }
    } else {
      console.log('✅ 用户配置创建成功:', insertData)
    }
    
    // 3. 验证最终结果
    console.log('\n3️⃣ 验证最终结果...')
    const { data: finalProfile, error: finalError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (finalError) {
      console.log('❌ 最终验证失败:', finalError)
    } else {
      console.log('✅ 最终用户配置:', finalProfile)
      
      const isAdmin = finalProfile.is_admin === true || finalProfile.subscription_tier === 'admin'
      console.log('🔐 管理员权限验证:', isAdmin)
      
      if (isAdmin) {
        console.log('🎉 用户已成功设置为管理员！')
      } else {
        console.log('⚠️ 用户权限设置可能有问题')
      }
    }
    
  } catch (error) {
    console.error('❌ 测试过程异常:', error)
  }
}

// 运行测试
testSQLScripts()
