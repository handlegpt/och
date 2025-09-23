import React, { useEffect } from 'react'
import {
  useUser,
  useUsageLimit,
  useGeneration,
  useTheme,
  useLanguage,
  useUI,
} from '../stores/appStore'

// 测试 appStore 的组件
export const TestAppStore: React.FC = () => {
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading } = useUser()
  const { usageLimit, setUsageLimit, updateUsage } = useUsageLimit()
  const {
    generation,
    setGenerating,
    setProgress,
    setCurrentStep,
    setResult,
    setError,
    resetGeneration,
  } = useGeneration()
  const { theme, setTheme, toggleTheme } = useTheme()
  const { language, setLanguage, setBrowserDetected } = useLanguage()
  const { ui, setSidebarOpen, setModalOpen, setUIError } = useUI()

  // 测试状态更新
  useEffect(() => {
    console.log('TestAppStore: Testing store updates')

    // 模拟用户登录
    const mockUser = {
      id: 'test-123',
      email: 'test@example.com',
      display_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: new Date().toISOString(),
    }

    setUser(mockUser)
    setAuthenticated(true)
    setLoading(false)

    // 模拟使用限制更新
    setUsageLimit({
      dailyLimit: 10,
      usedToday: 3,
      remainingToday: 7,
      canGenerate: true,
      tier: 'premium',
    })

    // 模拟生成状态
    setGenerating(true)
    setProgress(50)
    setCurrentStep('Processing image...')

    // 模拟主题切换
    setTheme({ mode: 'light', primary: '#3b82f6', secondary: '#1e40af' })

    // 模拟语言设置
    setLanguage('en')
    setBrowserDetected(true)

    // 模拟 UI 状态
    setSidebarOpen(true)
    setModalOpen(true, 'test-modal')

    // 模拟延迟更新
    setTimeout(() => {
      setProgress(100)
      setResult('Generated successfully!')
      setGenerating(false)
    }, 2000)
  }, [
    setUser,
    setAuthenticated,
    setLoading,
    setUsageLimit,
    setGenerating,
    setProgress,
    setCurrentStep,
    setTheme,
    setLanguage,
    setBrowserDetected,
    setSidebarOpen,
    setModalOpen,
  ])

  const handleToggleTheme = () => {
    toggleTheme()
  }

  const handleUpdateUsage = () => {
    updateUsage(usageLimit.usedToday + 1)
  }

  const handleResetGeneration = () => {
    resetGeneration()
  }

  const handleSetError = () => {
    setError('Test error message')
  }

  const handleSetUIError = () => {
    setUIError('UI error message')
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>AppStore 测试</h2>
      <p className='mb-4'>测试 Zustand 状态管理功能</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* 用户状态 */}
        <div className='p-4 border rounded'>
          <h3 className='font-semibold mb-2'>用户状态</h3>
          <p>认证: {isAuthenticated ? '是' : '否'}</p>
          <p>加载中: {isLoading ? '是' : '否'}</p>
          {user && (
            <div>
              <p>用户: {user.display_name}</p>
              <p>邮箱: {user.email}</p>
            </div>
          )}
        </div>

        {/* 使用限制 */}
        <div className='p-4 border rounded'>
          <h3 className='font-semibold mb-2'>使用限制</h3>
          <p>每日限制: {usageLimit.dailyLimit}</p>
          <p>今日已用: {usageLimit.usedToday}</p>
          <p>剩余: {usageLimit.remainingToday}</p>
          <p>可生成: {usageLimit.canGenerate ? '是' : '否'}</p>
          <p>套餐: {usageLimit.tier}</p>
          <button
            onClick={handleUpdateUsage}
            className='mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'
          >
            增加使用量
          </button>
        </div>

        {/* 生成状态 */}
        <div className='p-4 border rounded'>
          <h3 className='font-semibold mb-2'>生成状态</h3>
          <p>生成中: {generation.isGenerating ? '是' : '否'}</p>
          <p>进度: {generation.progress}%</p>
          <p>当前步骤: {generation.currentStep}</p>
          {generation.result && <p>结果: {generation.result}</p>}
          {generation.error && <p className='text-red-500'>错误: {generation.error}</p>}
          <div className='mt-2 space-x-2'>
            <button
              onClick={handleResetGeneration}
              className='px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600'
            >
              重置
            </button>
            <button
              onClick={handleSetError}
              className='px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'
            >
              设置错误
            </button>
          </div>
        </div>

        {/* 主题状态 */}
        <div className='p-4 border rounded'>
          <h3 className='font-semibold mb-2'>主题状态</h3>
          <p>模式: {theme.mode}</p>
          <p>主色: {theme.primary}</p>
          <p>次色: {theme.secondary}</p>
          <button
            onClick={handleToggleTheme}
            className='mt-2 px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600'
          >
            切换主题
          </button>
        </div>

        {/* 语言状态 */}
        <div className='p-4 border rounded'>
          <h3 className='font-semibold mb-2'>语言状态</h3>
          <p>当前语言: {language.current}</p>
          <p>浏览器检测: {language.browserDetected ? '是' : '否'}</p>
          <div className='mt-2 space-x-2'>
            <button
              onClick={() => setLanguage('zh')}
              className='px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600'
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className='px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'
            >
              英文
            </button>
          </div>
        </div>

        {/* UI 状态 */}
        <div className='p-4 border rounded'>
          <h3 className='font-semibold mb-2'>UI 状态</h3>
          <p>侧边栏: {ui.sidebarOpen ? '打开' : '关闭'}</p>
          <p>模态框: {ui.modalOpen ? '打开' : '关闭'}</p>
          <p>当前模态框: {ui.currentModal || '无'}</p>
          {ui.error && <p className='text-red-500'>UI 错误: {ui.error}</p>}
          <div className='mt-2 space-x-2'>
            <button
              onClick={() => setSidebarOpen(!ui.sidebarOpen)}
              className='px-2 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600'
            >
              切换侧边栏
            </button>
            <button
              onClick={handleSetUIError}
              className='px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'
            >
              设置错误
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
