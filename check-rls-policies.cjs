// 检查 RLS 策略
// 分析为什么用户无法创建自己的配置记录

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

console.log('🔍 检查 RLS 策略...')

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRLSPolicies() {
  try {
    // 1. 检查 user_profiles 表的 RLS 状态
    console.log('\n1️⃣ 检查 user_profiles 表的 RLS 状态...')
    
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('get_table_rls_status', { table_name: 'user_profiles' })
    
    if (rlsError) {
      console.log('❌ 无法查询 RLS 状态:', rlsError)
      console.log('💡 尝试其他方法检查 RLS...')
    } else {
      console.log('✅ RLS 状态:', rlsStatus)
    }
    
    // 2. 尝试查询 RLS 策略信息
    console.log('\n2️⃣ 尝试查询 RLS 策略...')
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: 'user_profiles' })
    
    if (policiesError) {
      console.log('❌ 无法查询 RLS 策略:', policiesError)
      console.log('💡 尝试直接测试权限...')
    } else {
      console.log('✅ RLS 策略:', policies)
    }
    
    // 3. 测试当前用户的权限
    console.log('\n3️⃣ 测试当前用户权限...')
    
    // 获取当前用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('❌ 无法获取当前用户:', userError)
      console.log('💡 需要先登录才能测试权限')
      return
    }
    
    console.log('👤 当前用户:', user.email)
    console.log('🆔 用户ID:', user.id)
    
    // 4. 测试 SELECT 权限
    console.log('\n4️⃣ 测试 SELECT 权限...')
    
    const { data: selectData, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (selectError) {
      console.log('❌ SELECT 权限测试失败:', {
        code: selectError.code,
        message: selectError.message,
        details: selectError.details
      })
    } else {
      console.log('✅ SELECT 权限正常:', selectData)
    }
    
    // 5. 测试 INSERT 权限
    console.log('\n5️⃣ 测试 INSERT 权限...')
    
    const testProfile = {
      id: user.id,
      username: 'test_user_' + Date.now(),
      display_name: 'Test User',
      subscription_tier: 'free',
      is_admin: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert(testProfile)
      .select()
      .single()
    
    if (insertError) {
      console.log('❌ INSERT 权限测试失败:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details
      })
      
      // 分析错误类型
      if (insertError.code === '42501') {
        console.log('🔍 分析：RLS 策略阻止了 INSERT 操作')
        console.log('💡 问题：用户无法创建自己的配置记录')
      } else if (insertError.code === '23505') {
        console.log('🔍 分析：记录已存在（这是好事）')
        console.log('✅ INSERT 权限正常，只是记录已存在')
      }
    } else {
      console.log('✅ INSERT 权限正常:', insertData)
    }
    
    // 6. 测试 UPDATE 权限
    console.log('\n6️⃣ 测试 UPDATE 权限...')
    
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()
    
    if (updateError) {
      console.log('❌ UPDATE 权限测试失败:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details
      })
    } else {
      console.log('✅ UPDATE 权限正常:', updateData)
    }
    
    // 7. 提供修复建议
    console.log('\n7️⃣ 修复建议...')
    
    if (selectError && selectError.code === 'PGRST116') {
      console.log('💡 问题：用户配置不存在')
      console.log('🔧 解决方案：需要创建用户配置记录')
    }
    
    if (insertError && insertError.code === '42501') {
      console.log('💡 问题：RLS 策略阻止用户创建配置')
      console.log('🔧 解决方案：')
      console.log('   1. 修改 RLS 策略允许用户创建自己的记录')
      console.log('   2. 或者使用管理员权限创建记录')
      console.log('')
      console.log('📝 建议的 RLS 策略:')
      console.log('   -- 允许用户查看自己的配置')
      console.log('   CREATE POLICY "Users can view own profile" ON user_profiles')
      console.log('   FOR SELECT USING (auth.uid() = id);')
      console.log('')
      console.log('   -- 允许用户创建自己的配置')
      console.log('   CREATE POLICY "Users can insert own profile" ON user_profiles')
      console.log('   FOR INSERT WITH CHECK (auth.uid() = id);')
      console.log('')
      console.log('   -- 允许用户更新自己的配置')
      console.log('   CREATE POLICY "Users can update own profile" ON user_profiles')
      console.log('   FOR UPDATE USING (auth.uid() = id);')
    }
    
  } catch (error) {
    console.error('❌ 检查过程异常:', error)
  }
}

// 运行检查
checkRLSPolicies()

