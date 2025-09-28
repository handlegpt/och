import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export const CostControlTest: React.FC = () => {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, message])
  }

  const testCostControl = async () => {
    if (!user) {
      addResult('❌ No user logged in')
      return
    }

    setIsRunning(true)
    setTestResults([])
    addResult('🧪 Testing cost control system...')
    addResult(`👤 Testing with user: ${user.id}`)

    try {
      // 测试插入成本记录
      addResult('📝 Testing INSERT operation...')
      const { data, error } = await supabase
        .from('api_cost_records')
        .insert({
          user_id: user.id,
          operation_type: 'IMAGE_EDIT',
          estimated_cost: 0.05,
          actual_cost: 0.05,
          tokens_used: 100,
        })
        .select()

      if (error) {
        addResult(`❌ Error inserting cost record: ${error.message}`)
        addResult(`Error details: ${JSON.stringify(error, null, 2)}`)
        return
      }

      addResult('✅ Successfully inserted cost record!')
      addResult(`Inserted data: ${JSON.stringify(data, null, 2)}`)

      // 测试查询成本记录
      addResult('🔍 Testing SELECT operation...')
      const { data: records, error: queryError } = await supabase
        .from('api_cost_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (queryError) {
        addResult(`❌ Error querying cost records: ${queryError.message}`)
        return
      }

      addResult('✅ Successfully queried cost records!')
      addResult(`Found ${records?.length || 0} records`)
      addResult(`Records: ${JSON.stringify(records, null, 2)}`)
    } catch (error) {
      addResult(`❌ Test failed: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  if (!user) {
    return (
      <div className='p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
        <p className='text-yellow-800 dark:text-yellow-200'>Please login to run the test</p>
      </div>
    )
  }

  return (
    <div className='p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)]'>
      <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
        🧪 Cost Control Test
      </h3>

      <button
        onClick={testCostControl}
        disabled={isRunning}
        className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isRunning ? 'Running Test...' : 'Run Test'}
      </button>

      {testResults.length > 0 && (
        <div className='mt-4 p-4 bg-[var(--bg-secondary)] rounded-lg'>
          <h4 className='font-medium text-[var(--text-primary)] mb-2'>Test Results:</h4>
          <div className='space-y-1 text-sm'>
            {testResults.map((result, index) => (
              <div key={index} className='font-mono text-[var(--text-secondary)]'>
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
