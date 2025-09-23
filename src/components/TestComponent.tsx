import React from 'react'

// 最简单的组件，没有任何状态或副作用
export const TestComponent: React.FC = () => {
  return (
    <div className='p-4'>
      <h1>Test Component</h1>
      <p>This is a simple component with no state or effects.</p>
    </div>
  )
}
