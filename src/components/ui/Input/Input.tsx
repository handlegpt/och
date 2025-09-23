import React from 'react'
import { cn } from '../../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, variant = 'default', ...props },
    ref
  ) => {
    const baseStyles =
      'w-full px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent'

    const variants = {
      default:
        'bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)]',
      filled:
        'bg-[var(--bg-secondary)] border-0 rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)]',
      outlined:
        'bg-transparent border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)]',
    }

    const inputClasses = cn(
      baseStyles,
      variants[variant],
      error && 'border-red-500 focus:ring-red-500',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    )

    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            {label}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-[var(--text-secondary)]'>{leftIcon}</span>
            </div>
          )}

          <input className={inputClasses} ref={ref} {...props} />

          {rightIcon && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              <span className='text-[var(--text-secondary)]'>{rightIcon}</span>
            </div>
          )}
        </div>

        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}

        {helperText && !error && (
          <p className='mt-1 text-sm text-[var(--text-secondary)]'>{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
