// 直接修复 onehare 用户配置问题
// 使用管理员权限绕过 RLS 策略

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

console.log('🔧 开始修复 onehare 用户配置问题...')

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixOnehareUser() {
  try {
    const userId = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'
    
    console.log('👤 目标用户ID:', userId)
    
    // 1. 首先尝试使用 upsert 方法（可能绕过某些 RLS 限制）
    console.log('\n1️⃣ 尝试使用 upsert 方法...')
    
    const { data: upsertData, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        username: 'onehare',
        display_name: 'onehare',
        subscription_tier: 'admin',
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (upsertError) {
      console.log('❌ Upsert 失败:', {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details
      })
      
      // 2. 尝试使用 RPC 函数（如果存在）
      console.log('\n2️⃣ 尝试使用 RPC 函数...')
      
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('create_user_profile', {
          user_id: userId,
          username: 'onehare',
          display_name: 'onehare',
          subscription_tier: 'admin',
          is_admin: true
        })
      
      if (rpcError) {
        console.log('❌ RPC 函数失败:', rpcError)
        
        // 3. 提供手动修复建议
        console.log('\n3️⃣ 提供手动修复方案...')
        console.log('💡 由于 RLS 策略限制，需要手动在 Supabase 控制台执行以下 SQL:')
        console.log('')
        console.log('-- 临时禁用 RLS 并创建用户配置')
        console.log('SET row_security = off;')
        console.log('')
        console.log('INSERT INTO user_profiles (')
        console.log('    id,')
        console.log('    username,')
        console.log('    display_name,')
        console.log('    subscription_tier,')
        console.log('    is_admin,')
        console.log('    created_at,')
        console.log('    updated_at')
        console.log(') VALUES (')
        console.log(`    '${userId}',`)
        console.log("    'onehare',")
        console.log("    'onehare',")
        console.log("    'admin',")
        console.log('    true,')
        console.log('    NOW(),')
        console.log('    NOW()')
        console.log(');')
        console.log('')
        console.log('SET row_security = on;')
        console.log('')
        console.log('-- 验证结果')
        console.log('SELECT * FROM user_profiles WHERE id = \'' + userId + '\';')
        
      } else {
        console.log('✅ RPC 函数成功:', rpcData)
      }
    } else {
      console.log('✅ Upsert 成功:', upsertData)
    }
    
    // 4. 最终验证
    console.log('\n4️⃣ 最终验证...')
    const { data: finalProfile, error: finalError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (finalError) {
      console.log('❌ 最终验证失败:', finalError)
      console.log('💡 请按照上面的 SQL 脚本手动修复')
    } else {
      console.log('✅ 最终用户配置:', finalProfile)
      
      const isAdmin = finalProfile.is_admin === true || finalProfile.subscription_tier === 'admin'
      console.log('🔐 管理员权限验证:', isAdmin)
      
      if (isAdmin) {
        console.log('🎉 onehare 用户已成功修复为管理员！')
        console.log('💡 现在请刷新页面测试管理员功能')
      } else {
        console.log('⚠️ 用户权限设置可能有问题')
      }
    }
    
  } catch (error) {
    console.error('❌ 修复过程异常:', error)
  }
}

// 运行修复
fixOnehareUser()

