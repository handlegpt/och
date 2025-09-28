// 测试成本控制功能
// 在浏览器控制台中运行此脚本

async function testCostControl() {
  try {
    console.log('🧪 Testing cost control system...')

    // 测试插入成本记录
    const { data, error } = await window.supabase
      .from('api_cost_records')
      .insert({
        user_id: '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e', // 替换为实际用户ID
        operation_type: 'IMAGE_EDIT',
        estimated_cost: 0.05,
        actual_cost: 0.05,
        tokens_used: 100,
      })
      .select()

    if (error) {
      console.error('❌ Error inserting cost record:', error)
      return
    }

    console.log('✅ Successfully inserted cost record:', data)

    // 测试查询成本记录
    const { data: records, error: queryError } = await window.supabase
      .from('api_cost_records')
      .select('*')
      .eq('user_id', '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e')
      .order('created_at', { ascending: false })
      .limit(5)

    if (queryError) {
      console.error('❌ Error querying cost records:', queryError)
      return
    }

    console.log('✅ Successfully queried cost records:', records)
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// 运行测试
testCostControl()
