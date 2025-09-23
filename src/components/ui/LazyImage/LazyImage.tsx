import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  fallback?: string
  threshold?: number
  rootMargin?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJhTwvdGV4dD48L3N2Zz4=',
  threshold = 0.1,
  rootMargin = '50px',
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer 用于检测元素是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  // 当元素进入视口时开始加载图片
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const img = new Image()
      img.onload = () => {
        setCurrentSrc(src)
        setIsLoaded(true)
        onLoad?.()
      }
      img.onerror = () => {
        setHasError(true)
        setCurrentSrc(fallback)
        onError?.()
      }
      img.src = src
    }
  }, [isInView, src, isLoaded, hasError, fallback])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-70'
        )}
        {...props}
      />

      {/* 加载指示器 */}
      {isInView && !isLoaded && !hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500'>
          <div className='text-center'>
            <svg
              className='w-8 h-8 mx-auto mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <p className='text-sm'>图片加载失败</p>
          </div>
        </div>
      )}
    </div>
  )
}

export { LazyImage }
