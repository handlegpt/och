// 强制刷新用户配置
// 解决数据同步问题

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

console.log('🔄 强制刷新用户配置...')

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function forceRefreshProfile() {
  try {
    const userId = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'
    
    console.log('👤 目标用户ID:', userId)
    
    // 1. 尝试多次查询，看看是否是临时问题
    console.log('\n1️⃣ 尝试多次查询...')
    
    for (let i = 1; i <= 3; i++) {
      console.log(`\n尝试 ${i}/3...`)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.log(`❌ 尝试 ${i} 失败:`, {
          code: error.code,
          message: error.message
        })
        
        if (i === 3) {
          console.log('💡 所有查询都失败，可能是权限问题')
        }
      } else {
        console.log(`✅ 尝试 ${i} 成功:`, data)
        break
      }
      
      // 等待一秒再重试
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    // 2. 尝试使用不同的查询方式
    console.log('\n2️⃣ 尝试不同的查询方式...')
    
    // 尝试查询所有记录
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (allError) {
      console.log('❌ 查询所有记录失败:', allError)
    } else {
      console.log(`✅ 查询到 ${allProfiles.length} 个用户配置记录`)
      
      const targetProfile = allProfiles.find(p => p.id === userId)
      if (targetProfile) {
        console.log('✅ 找到目标用户配置:', targetProfile)
      } else {
        console.log('❌ 在结果中没有找到目标用户')
        console.log('所有用户ID:', allProfiles.map(p => p.id))
      }
    }
    
    // 3. 尝试强制更新记录
    console.log('\n3️⃣ 尝试强制更新记录...')
    
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        username: 'onehare',
        display_name: 'onehare',
        subscription_tier: 'admin',
        is_admin: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (updateError) {
      console.log('❌ 强制更新失败:', updateError)
    } else {
      console.log('✅ 强制更新成功:', updateData)
    }
    
    // 4. 最终验证
    console.log('\n4️⃣ 最终验证...')
    
    const { data: finalData, error: finalError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (finalError) {
      console.log('❌ 最终验证失败:', finalError)
      console.log('💡 建议：')
      console.log('1. 检查 Supabase 项目状态')
      console.log('2. 检查 RLS 策略是否正确')
      console.log('3. 尝试在 Supabase 控制台直接操作')
    } else {
      console.log('✅ 最终验证成功:', finalData)
      
      const isAdmin = finalData.is_admin === true || finalData.subscription_tier === 'admin'
      console.log('🔐 管理员权限:', isAdmin)
      
      if (isAdmin) {
        console.log('🎉 用户配置已正确设置！')
        console.log('💡 现在请：')
        console.log('1. 清除浏览器缓存')
        console.log('2. 硬刷新页面')
        console.log('3. 重新测试管理员功能')
      }
    }
    
  } catch (error) {
    console.error('❌ 强制刷新过程异常:', error)
  }
}

// 运行强制刷新
forceRefreshProfile()

