/**
 * Sentry错误边界组件
 * 集成Sentry的错误捕获和报告
 */

import React from 'react'
import * as Sentry from '@sentry/react'
import { useTranslation } from '../../i18n/context'

interface SentryErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  showDialog?: boolean
}

// 默认错误页面组件
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  const { t } = useTranslation()

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6 text-center'>
        <div className='w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-red-600 dark:text-red-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h2 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
          {t('error.title')}
        </h2>

        <p className='text-[var(--text-secondary)] mb-6'>{t('error.message')}</p>

        {process.env.NODE_ENV === 'development' && (
          <details className='mb-6 text-left'>
            <summary className='cursor-pointer text-sm text-[var(--text-tertiary)] mb-2'>
              {t('error.errorDetails')}
            </summary>
            <div className='bg-[var(--bg-secondary)] p-3 rounded-lg text-xs font-mono text-[var(--text-secondary)] overflow-auto max-h-32'>
              <div className='mb-2'>
                <strong>{t('error.errorMessage')}</strong>
                <div className='text-red-400'>{error.message}</div>
              </div>
              {error.stack && (
                <div>
                  <strong>{t('error.stackTrace')}</strong>
                  <pre className='whitespace-pre-wrap text-xs'>{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className='flex gap-3 justify-center'>
          <button
            onClick={resetError}
            className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'
          >
            {t('error.retry')}
          </button>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors'
          >
            {t('error.reload')}
          </button>
        </div>

        <div className='mt-4 text-xs text-[var(--text-tertiary)]'>{t('error.contactSupport')}</div>
      </div>
    </div>
  )
}

// Sentry错误边界组件
export const SentryErrorBoundary: React.FC<SentryErrorBoundaryProps> = ({
  children,
  fallback: FallbackComponent = DefaultErrorFallback,
  showDialog = true,
}) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <FallbackComponent error={error} resetError={resetError} />
      )}
      showDialog={showDialog}
      beforeCapture={(scope, error, errorInfo) => {
        // 添加额外的上下文信息
        scope.setTag('errorBoundary', 'true')
        scope.setContext('errorInfo', {
          componentStack: errorInfo.componentStack,
          errorBoundary: errorInfo.errorBoundary,
        })

        // 记录用户行为
        scope.addBreadcrumb({
          message: 'Error Boundary triggered',
          category: 'error',
          level: 'error',
          data: {
            errorMessage: error.message,
            componentStack: errorInfo.componentStack,
          },
        })
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}

// 高阶组件：包装组件以添加Sentry错误边界
export const withSentryErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<SentryErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <SentryErrorBoundary {...options}>
      <Component {...props} />
    </SentryErrorBoundary>
  )

  WrappedComponent.displayName = `withSentryErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// 用于特定组件的错误边界
export const ComponentSentryErrorBoundary: React.FC<{
  children: React.ReactNode
  componentName?: string
}> = ({ children, componentName: _componentName = 'Component' }) => {
  const { t } = useTranslation()

  return (
    <SentryErrorBoundary
      fallback={({ error: _error, resetError }) => (
        <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <div className='flex items-center gap-2 text-red-600 dark:text-red-400 mb-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-medium'>{t('error.componentLoadFailed')}</span>
          </div>
          <p className='text-sm text-red-500 dark:text-red-300 mb-3'>
            {t('error.componentLoadFailedMessage')}
          </p>
          <button
            onClick={resetError}
            className='px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors'
          >
            {t('error.retry')}
          </button>
        </div>
      )}
    >
      {children}
    </SentryErrorBoundary>
  )
}

export default SentryErrorBoundary
