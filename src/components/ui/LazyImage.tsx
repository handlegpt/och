import React, { useState, useRef, useEffect, useCallback } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  errorPlaceholder?: string
  threshold?: number
  rootMargin?: string
  onLoad?: () => void
  onError?: () => void
  loading?: 'lazy' | 'eager'
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  errorPlaceholder,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  loading = 'lazy',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 默认占位符
  const defaultPlaceholder =
    placeholder ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'

  const defaultErrorPlaceholder =
    errorPlaceholder ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVlMmUyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2RjMjYyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg=='

  // 创建 Intersection Observer
  const createObserver = useCallback(() => {
    if (loading === 'eager') {
      setIsInView(true)
      return
    }

    if (!imgRef.current) return

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerRef.current.observe(imgRef.current)
  }, [loading, threshold, rootMargin])

  // 加载图片
  const loadImage = useCallback(() => {
    if (!isInView || isLoaded || hasError) return

    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
      onLoad?.()
    }
    img.onerror = () => {
      setHasError(true)
      onError?.()
    }
    img.src = src
  }, [src, isInView, isLoaded, hasError, onLoad, onError])

  // 清理 observer
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    createObserver()
    return cleanup
  }, [loading, threshold, rootMargin])

  useEffect(() => {
    loadImage()
  }, [src, isInView, isLoaded, hasError])

  // 获取当前显示的图片源
  const getCurrentSrc = () => {
    if (hasError) return defaultErrorPlaceholder
    if (isLoaded) return imageSrc
    if (isInView) return defaultPlaceholder
    return defaultPlaceholder
  }

  return (
    <img
      ref={imgRef}
      src={getCurrentSrc()}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-70'
      } ${className}`}
      loading={loading}
    />
  )
}

// 懒加载图片网格组件
interface LazyImageGridProps {
  images: Array<{
    src: string
    alt: string
    id: string
  }>
  className?: string
  itemClassName?: string
  columns?: number
  gap?: number
}

export const LazyImageGrid: React.FC<LazyImageGridProps> = ({
  images,
  className = '',
  itemClassName = '',
  columns = 3,
  gap = 4,
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap * 0.25}rem`,
  }

  return (
    <div className={className} style={gridStyle}>
      {images.map(image => (
        <div key={image.id} className={itemClassName}>
          <LazyImage
            src={image.src}
            alt={image.alt}
            className='w-full h-full object-cover rounded-lg'
            threshold={0.1}
            rootMargin='100px'
          />
        </div>
      ))}
    </div>
  )
}

// 懒加载视频组件
interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
  threshold?: number
  rootMargin?: string
  onLoad?: () => void
  onError?: () => void
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
}) => {
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const createObserver = useCallback(() => {
    if (!videoRef.current) return

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerRef.current.observe(videoRef.current)
  }, [threshold, rootMargin])

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    createObserver()
    return cleanup
  }, [threshold, rootMargin])

  const handleLoadedData = useCallback(() => {
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className='text-gray-500'>视频加载失败</span>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted
      playsInline
      onLoadedData={handleLoadedData}
      onError={handleError}
      style={{ display: isInView ? 'block' : 'none' }}
    >
      {isInView && <source src={src} type='video/mp4' />}
    </video>
  )
}
