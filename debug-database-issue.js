// 数据库问题诊断脚本
// 在浏览器控制台中运行此脚本来诊断问题

console.log('🔍 开始数据库诊断...')

// 1. 检查 Supabase 连接
console.log('1. 检查 Supabase 连接状态:')
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '已配置' : '未配置')

// 2. 检查用户认证状态
console.log('\n2. 检查用户认证状态:')
if (window.supabase) {
  window.supabase.auth.getUser().then(({ data: { user }, error }) => {
    if (error) {
      console.error('❌ 用户认证错误:', error)
    } else if (user) {
      console.log('✅ 用户已认证:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      })
    } else {
      console.log('⚠️ 用户未认证')
    }
  })
} else {
  console.error('❌ Supabase 客户端未初始化')
}

// 3. 测试数据库连接
console.log('\n3. 测试数据库连接:')
if (window.supabase) {
  // 测试简单查询
  window.supabase
    .from('ai_generations')
    .select('count')
    .limit(1)
    .then(({ error }) => {
      if (error) {
        console.error('❌ 数据库查询错误:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })

        // 分析错误类型
        if (error.code === 'PGRST116') {
          console.log('💡 可能原因: 表不存在或没有权限')
        } else if (error.code === 'PGRST301') {
          console.log('💡 可能原因: RLS策略阻止访问')
        } else if (error.message.includes('relation')) {
          console.log('💡 可能原因: 表不存在')
        }
      } else {
        console.log('✅ 数据库连接正常')
      }
    })
}

// 4. 检查表结构
console.log('\n4. 检查表结构:')
if (window.supabase) {
  // 检查表是否存在
  window.supabase
    .rpc('get_table_info', { table_name: 'ai_generations' })
    .then(({ data, error }) => {
      if (error) {
        console.log('⚠️ 无法获取表信息:', error.message)
      } else {
        console.log('✅ 表结构信息:', data)
      }
    })
    .catch(() => {
      console.log('⚠️ 无法调用 get_table_info 函数')
    })
}

// 5. 测试用户特定的查询
console.log('\n5. 测试用户特定查询:')
if (window.supabase) {
  window.supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) {
      window.supabase
        .from('ai_generations')
        .select('id, transformation_type, created_at')
        .eq('user_id', user.id)
        .limit(1)
        .then(({ data, error }) => {
          if (error) {
            console.error('❌ 用户查询失败:', {
              code: error.code,
              message: error.message,
              details: error.details,
            })
          } else {
            console.log('✅ 用户查询成功:', data)
          }
        })
    }
  })
}

console.log('\n🔍 诊断完成。请查看上述输出以确定问题原因。')
