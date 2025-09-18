import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  lines = 1
}) => {
  const baseClasses = 'bg-[var(--bg-secondary)]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    rounded: 'rounded-xl'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: ''
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// 预定义的骨架屏组件
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader variant="circular" width={40} height={40} />
      <div className="flex-1">
        <SkeletonLoader variant="text" width="60%" height={16} />
        <SkeletonLoader variant="text" width="40%" height={12} className="mt-2" />
      </div>
    </div>
    <SkeletonLoader variant="text" lines={3} />
  </div>
);

export const SkeletonImageGrid: React.FC<{ count?: number; className?: string }> = ({ 
  count = 6, 
  className = '' 
}) => (
  <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="space-y-2">
        <SkeletonLoader variant="rounded" width="100%" height={120} />
        <SkeletonLoader variant="text" width="80%" height={14} />
        <SkeletonLoader variant="text" width="60%" height={12} />
      </div>
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {/* 表头 */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader key={index} variant="text" width="100%" height={16} />
      ))}
    </div>
    {/* 表格行 */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader key={colIndex} variant="text" width="100%" height={14} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonProfile: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* 头像和基本信息 */}
    <div className="flex items-center space-x-4">
      <SkeletonLoader variant="circular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" width="40%" height={20} />
        <SkeletonLoader variant="text" width="60%" height={16} />
        <SkeletonLoader variant="text" width="30%" height={14} />
      </div>
    </div>
    
    {/* 统计信息 */}
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="text-center space-y-2">
          <SkeletonLoader variant="text" width="100%" height={24} />
          <SkeletonLoader variant="text" width="80%" height={14} />
        </div>
      ))}
    </div>
  </div>
);

// 添加波浪动画样式
const waveStyle = `
  @keyframes wave {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-wave {
    position: relative;
    overflow: hidden;
  }
  
  .animate-wave::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: wave 1.5s infinite;
  }
`;

// 注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = waveStyle;
  document.head.appendChild(styleElement);
}
