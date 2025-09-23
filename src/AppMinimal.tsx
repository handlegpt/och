import React from 'react'
import { TestComponent } from './components/TestComponent'

// 最小化的 App 组件，没有任何状态管理或路由
export const AppMinimal: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4'>
          <h1 className='text-3xl font-bold text-gray-900'>Och AI - Minimal Test</h1>
        </div>
      </header>
      <main className='max-w-7xl mx-auto py-6 px-4'>
        <TestComponent />
      </main>
    </div>
  )
}
