import React, { useState, useEffect } from 'react'

// 简化的 HomePage 测试组件
export const TestHomePage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // 模拟功能选择
  const features = [
    { key: 'enhance', name: '高清增强', description: '提升图片清晰度' },
    { key: 'style', name: '风格转换', description: '改变图片风格' },
    { key: 'remove', name: '背景移除', description: '智能移除背景' },
    { key: 'upscale', name: '图片放大', description: '无损放大图片' },
  ]

  // 模拟 URL 参数处理
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const feature = urlParams.get('feature')
    if (feature) {
      setSelectedFeature(feature)
    }
  }, [])

  // 模拟功能选择处理
  const handleFeatureSelect = (featureKey: string) => {
    setSelectedFeature(featureKey)
    setLoading(true)

    // 模拟异步处理
    setTimeout(() => {
      setLoading(false)
      setShowModal(true)
    }, 1000)
  }

  // 模拟模态框关闭
  const handleModalClose = () => {
    setShowModal(false)
    setSelectedFeature(null)
  }

  if (loading) {
    return (
      <div className='p-8 text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
        <p>正在加载功能...</p>
      </div>
    )
  }

  if (showModal) {
    return (
      <div className='p-8'>
        <h2 className='text-2xl font-bold mb-4'>功能测试模态框</h2>
        <p className='mb-4'>您选择了功能: {selectedFeature}</p>
        <button
          onClick={handleModalClose}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          关闭
        </button>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-8'>HomePage 功能测试</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {features.map(feature => (
          <div
            key={feature.key}
            className='p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => handleFeatureSelect(feature.key)}
          >
            <h3 className='text-xl font-semibold mb-2'>{feature.name}</h3>
            <p className='text-gray-600'>{feature.description}</p>
            <div className='mt-4'>
              <button className='w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                开始使用
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFeature && (
        <div className='mt-8 p-4 bg-gray-100 rounded'>
          <p>当前选择的功能: {selectedFeature}</p>
        </div>
      )}
    </div>
  )
}
