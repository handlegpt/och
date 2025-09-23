import React from 'react'
import { TestComponent } from './components/TestComponent'
import { TestAuth } from './components/TestAuth'
import { TestI18n } from './components/TestI18n'
import { TestComplex } from './components/TestComplex'
import { TestHomePage } from './components/TestHomePage'
import { TestAuthModal } from './components/TestAuthModal'

// 最小化的 App 组件，测试基础功能
export const AppMinimal: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4'>
          <h1 className='text-3xl font-bold text-gray-900'>Och AI - Minimal Test</h1>
        </div>
      </header>
      <main className='max-w-7xl mx-auto py-6 px-4 space-y-8'>
        <TestComponent />
        <TestAuth />
        <TestI18n />
        <TestComplex />
        <TestHomePage />
        <TestAuthModal />
      </main>
    </div>
  )
}
