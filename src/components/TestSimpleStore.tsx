import React, { useEffect } from 'react'
import { create } from 'zustand'

// 创建一个简单的 store 用于测试
interface SimpleState {
  count: number
  name: string
  increment: () => void
  setName: (name: string) => void
}

const useSimpleStore = create<SimpleState>(set => ({
  count: 0,
  name: 'Test',
  increment: () => set(state => ({ count: state.count + 1 })),
  setName: name => set({ name }),
}))

// 测试简单 store 的组件
export const TestSimpleStore: React.FC = () => {
  const { count, name, increment, setName } = useSimpleStore()

  // 测试状态更新 - 只运行一次
  useEffect(() => {
    console.log('TestSimpleStore: Testing simple store')

    // 模拟状态更新
    setName('Updated Name')
    increment()
    increment()

    // 模拟延迟更新
    setTimeout(() => {
      setName('Delayed Update')
      increment()
    }, 1000)
  }, []) // 空依赖数组

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Simple Store 测试</h2>
      <p className='mb-4'>测试简单的 Zustand store</p>

      <div className='space-y-2'>
        <p>计数: {count}</p>
        <p>名称: {name}</p>
        <button
          onClick={increment}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          增加计数
        </button>
        <button
          onClick={() => setName('Manual Update')}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          更新名称
        </button>
      </div>
    </div>
  )
}
