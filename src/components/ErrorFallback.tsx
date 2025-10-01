import React from 'react'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='text-center p-8 max-w-md mx-auto'>
        <div className='text-6xl mb-4'>😵</div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>出现错误</h2>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>抱歉，页面加载时出现了问题</p>
        <details className='text-left mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm'>
          <summary className='cursor-pointer font-semibold'>错误详情</summary>
          <pre className='mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto'>
            {error.message}
          </pre>
        </details>
        <div className='space-x-3'>
          <button
            onClick={resetError}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
          >
            重试
          </button>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  )
}
