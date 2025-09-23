import React, { Suspense, lazy, ComponentType } from 'react'

// 加载中组件
const LoadingSpinner = () => (
  <div className='flex items-center justify-center p-8'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
  </div>
)

// 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, never>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyWrapper Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <div className='text-red-500 mb-4'>
            <svg
              className='w-12 h-12 mx-auto'
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
          </div>
          <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>组件加载失败</h3>
          <p className='text-[var(--text-secondary)] mb-4'>
            抱歉，该组件暂时无法加载。请刷新页面重试。
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// 懒加载包装器
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <LoadingSpinner />,
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

// 懒加载组件工厂
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc)

  return React.forwardRef<any, P>((props, ref) => {
    // 确保 props 不为 undefined
    const safeProps = props || ({} as P)

    return (
      <LazyWrapper fallback={fallback}>
        <LazyComponent {...safeProps} ref={ref} />
      </LazyWrapper>
    )
  })
}

// 预定义的懒加载组件
export const LazyHomePage = createLazyComponent(() => import('../components/HomePage'))
export const LazyProfilePage = createLazyComponent(() => import('../pages/ProfilePage'))
export const LazySocialPage = createLazyComponent(() => import('../pages/SocialPage'))
export const LazyPricingPage = createLazyComponent(() => import('../pages/PricingPage'))
export const LazyAuthModal = createLazyComponent(() => import('./auth/AuthModal'))
export const LazyUnifiedDashboard = createLazyComponent(() => import('./user/UnifiedDashboard'))
export const LazyGalleryWall = createLazyComponent(() => import('./social/GalleryWall'))
export const LazyUserCollections = createLazyComponent(() => import('./social/UserCollections'))
