import React, { useEffect, useState } from 'react'
import { useTestStore } from '../stores/testStore'

// 测试组件，使用 Zustand 状态管理和 useEffect
export const TestComponent: React.FC = () => {
  const { count, increment, decrement } = useTestStore()
  const [localCount, setLocalCount] = useState(0)

  // 测试 useEffect - 只运行一次
  useEffect(() => {
    console.log('TestComponent mounted')
    setLocalCount(100)
  }, [])

  // 测试 useEffect - 依赖 count
  useEffect(() => {
    console.log('Count changed:', count)
  }, [count])

  return (
    <div className='p-4'>
      <h1>Test Component with State & Effects</h1>
      <p>This component uses Zustand and useEffect.</p>
      <div className='mt-4 space-y-4'>
        <div>
          <p>Zustand Count: {count}</p>
          <p>Local Count: {localCount}</p>
        </div>
        <div className='space-x-2'>
          <button
            onClick={increment}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Increment
          </button>
          <button
            onClick={decrement}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  )
}
