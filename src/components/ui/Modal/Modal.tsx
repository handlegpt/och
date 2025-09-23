import React, { useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}) => {
  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-20'>
      {/* 背景遮罩 */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* 模态框内容 */}
      <div
        className={cn(
          'relative w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-xl transform transition-all',
          sizes[size],
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        {title && (
          <div className='flex items-center justify-between p-6 border-b border-[var(--border-primary)]'>
            <h2 className='text-xl font-semibold text-[var(--text-primary)]'>{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className='p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  )
}

export { Modal }
