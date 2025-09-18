import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'accent' | 'white'
  text?: string
  className?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  className = '',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const variantClasses = {
    primary: 'border-[var(--accent-primary)]',
    secondary: 'border-[var(--accent-secondary)]',
    accent: 'border-[var(--accent-primary)]',
    white: 'border-white',
  }

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          border-2 border-t-transparent rounded-full animate-spin
        `}
      />
      {text && <p className='mt-3 text-sm text-[var(--text-secondary)] animate-pulse'>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-[var(--bg-primary)] bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50'>
        {spinner}
      </div>
    )
  }

  return spinner
}

// 进度条加载器
interface ProgressLoaderProps {
  progress: number
  text?: string
  className?: string
  showPercentage?: boolean
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress,
  text,
  className = '',
  showPercentage = true,
}) => (
  <div className={`w-full ${className}`}>
    {text && (
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm text-[var(--text-primary)]'>{text}</span>
        {showPercentage && (
          <span className='text-sm text-[var(--text-secondary)]'>{Math.round(progress)}%</span>
        )}
      </div>
    )}
    <div className='w-full bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden'>
      <div
        className='h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-300 ease-out'
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
)

// 点状加载器
interface DotsLoaderProps {
  text?: string
  className?: string
  color?: 'primary' | 'secondary' | 'white'
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({
  text,
  className = '',
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-[var(--accent-primary)]',
    secondary: 'bg-[var(--accent-secondary)]',
    white: 'bg-white',
  }

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {text && <span className='text-sm text-[var(--text-secondary)] mr-2'>{text}</span>}
      <div className='flex space-x-1'>
        {[0, 1, 2].map(index => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 脉冲加载器
interface PulseLoaderProps {
  text?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({ text, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]
          rounded-full animate-pulse
        `}
      />
      {text && <p className='mt-3 text-sm text-[var(--text-secondary)] animate-pulse'>{text}</p>}
    </div>
  )
}

// 波浪加载器
interface WaveLoaderProps {
  text?: string
  className?: string
  color?: 'primary' | 'secondary'
}

export const WaveLoader: React.FC<WaveLoaderProps> = ({
  text,
  className = '',
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-[var(--accent-primary)]',
    secondary: 'bg-[var(--accent-secondary)]',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className='flex items-end space-x-1'>
        {[0, 1, 2, 3, 4].map(index => (
          <div
            key={index}
            className={`w-1 ${colorClasses[color]} rounded-full animate-wave`}
            style={{
              height: `${12 + index * 4}px`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
      {text && <p className='mt-3 text-sm text-[var(--text-secondary)] animate-pulse'>{text}</p>}
    </div>
  )
}

// 添加波浪动画样式
const waveAnimationStyle = `
  @keyframes wave {
    0%, 100% {
      transform: scaleY(0.4);
    }
    50% {
      transform: scaleY(1);
    }
  }
  
  .animate-wave {
    animation: wave 1s ease-in-out infinite;
  }
`

// 注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = waveAnimationStyle
  document.head.appendChild(styleElement)
}
