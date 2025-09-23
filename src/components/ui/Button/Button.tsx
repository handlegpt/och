import React from 'react'
import { cn } from '../../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] focus:ring-[var(--accent-primary)]',
      secondary:
        'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--accent-primary)]',
      outline:
        'border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent-primary)]',
      ghost:
        'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent-primary)]',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg className='animate-spin -ml-1 mr-2 h-4 w-4' fill='none' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        )}

        {!loading && icon && iconPosition === 'left' && <span className='mr-2'>{icon}</span>}

        {children}

        {!loading && icon && iconPosition === 'right' && <span className='ml-2'>{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
