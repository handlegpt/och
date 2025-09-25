import React, { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  networkRequests: number
  errors: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  reportInterval?: number
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  onMetricsUpdate,
  reportInterval = 5000,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errors: 0,
  })

  const [isVisible, setIsVisible] = useState(false)

  // 获取性能指标
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0

    // 获取内存使用情况（如果支持）
    const memoryInfo = (performance as any).memory
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0 // MB

    // 获取网络请求数量
    const networkEntries = performance.getEntriesByType('resource')
    const networkRequests = networkEntries.length

    // 获取错误数量
    const errors = performance.getEntriesByType('error').length

    // 计算渲染时间
    const paintEntries = performance.getEntriesByType('paint')
    const renderTime =
      paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0

    return {
      loadTime,
      renderTime,
      memoryUsage,
      networkRequests,
      errors,
    }
  }, [])

  // 更新指标
  const updateMetrics = useCallback(() => {
    const newMetrics = getPerformanceMetrics()
    setMetrics(newMetrics)
    onMetricsUpdate?.(newMetrics)
  }, [getPerformanceMetrics, onMetricsUpdate])

  // 监听性能变化
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(updateMetrics, reportInterval)

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateMetrics()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, updateMetrics, reportInterval])

  // 键盘快捷键显示/隐藏监控器
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!enabled || !isVisible) {
    return null
  }

  return (
    <div className='fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='font-bold'>性能监控</h3>
        <button onClick={() => setIsVisible(false)} className='text-gray-400 hover:text-white'>
          ✕
        </button>
      </div>

      <div className='space-y-1'>
        <div>加载时间: {metrics.loadTime.toFixed(2)}ms</div>
        <div>渲染时间: {metrics.renderTime.toFixed(2)}ms</div>
        <div>内存使用: {metrics.memoryUsage.toFixed(2)}MB</div>
        <div>网络请求: {metrics.networkRequests}</div>
        <div>错误数量: {metrics.errors}</div>
      </div>

      <div className='mt-2 pt-2 border-t border-gray-600'>
        <div className='text-gray-400 text-xs'>按 Ctrl+Shift+P 切换显示</div>
      </div>
    </div>
  )
}

// 懒加载性能优化 Hook
export const useLazyLoadingOptimization = () => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const observerRef = useCallback((node: HTMLElement | null) => {
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    observer.observe(node)
  }, [])

  const handleLoad = useCallback(() => {
    setHasLoaded(true)
  }, [])

  return {
    observerRef,
    isIntersecting,
    hasLoaded,
    handleLoad,
  }
}

// 图片懒加载优化 Hook
export const useImageLazyLoading = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const loadImage = useCallback(() => {
    if (!src || imageSrc) return

    setIsLoading(true)
    setHasError(false)

    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    img.onerror = () => {
      setHasError(true)
      setIsLoading(false)
    }
    img.src = src
  }, [src, imageSrc])

  return {
    imageSrc,
    isLoading,
    hasError,
    loadImage,
  }
}

// 组件懒加载优化 Hook
export const useComponentLazyLoading = (importFunc: () => Promise<any>) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const loadComponent = useCallback(async () => {
    if (Component || isLoading) return

    setIsLoading(true)
    setHasError(false)

    try {
      const module = await importFunc()
      setComponent(() => module.default)
    } catch (error) {
      console.error('Failed to load component:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [Component, isLoading, importFunc])

  return {
    Component,
    isLoading,
    hasError,
    loadComponent,
  }
}
