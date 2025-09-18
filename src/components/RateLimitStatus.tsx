import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { generationRateLimiter, uploadRateLimiter, userRateLimiter } from '../services/rateLimiter'

interface RateLimitInfo {
  type: string
  remaining: number
  resetTime: number
  maxRequests: number
}

export const RateLimitStatus: React.FC = () => {
  const { user } = useAuth()
  const [rateLimits, setRateLimits] = useState<RateLimitInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRateLimits = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const identifier = user.id

        const [generationRemaining, uploadRemaining, userRemaining] = await Promise.all([
          generationRateLimiter.getRemainingRequests(identifier),
          uploadRateLimiter.getRemainingRequests(identifier),
          userRateLimiter.getRemainingRequests(identifier),
        ])

        setRateLimits([
          {
            type: 'AI生成',
            remaining: generationRemaining,
            resetTime: Date.now() + 60 * 60 * 1000, // 1小时后重置
            maxRequests: 20,
          },
          {
            type: '文件上传',
            remaining: uploadRemaining,
            resetTime: Date.now() + 60 * 60 * 1000,
            maxRequests: 50,
          },
          {
            type: '用户请求',
            remaining: userRemaining,
            resetTime: Date.now() + 60 * 60 * 1000,
            maxRequests: 100,
          },
        ])
      } catch (error) {
        console.error('Error fetching rate limits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRateLimits()

    // 每分钟更新一次
    const interval = setInterval(fetchRateLimits, 60000)
    return () => clearInterval(interval)
  }, [user])

  if (loading) {
    return (
      <div className='flex items-center gap-2 text-sm text-[var(--text-tertiary)]'>
        <div className='w-4 h-4 border border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin'></div>
        加载限制信息...
      </div>
    )
  }

  if (!user || rateLimits.length === 0) {
    return null
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = timestamp - now

    if (diff <= 0) return '已重置'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    } else {
      return `${minutes}分钟`
    }
  }

  const getStatusColor = (remaining: number, maxRequests: number) => {
    const percentage = (remaining / maxRequests) * 100
    if (percentage > 50) return 'text-green-500'
    if (percentage > 20) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-lg border border-[var(--border-primary)] p-3'>
      <h4 className='text-sm font-semibold text-[var(--text-primary)] mb-2'>使用限制</h4>
      <div className='space-y-2'>
        {rateLimits.map(limit => (
          <div key={limit.type} className='flex items-center justify-between text-xs'>
            <span className='text-[var(--text-secondary)]'>{limit.type}</span>
            <div className='flex items-center gap-2'>
              <span className={`font-medium ${getStatusColor(limit.remaining, limit.maxRequests)}`}>
                {limit.remaining}/{limit.maxRequests}
              </span>
              <div className='w-16 h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden'>
                <div
                  className={`h-full transition-all duration-300 ${
                    limit.remaining > limit.maxRequests * 0.5
                      ? 'bg-green-500'
                      : limit.remaining > limit.maxRequests * 0.2
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.max(0, (limit.remaining / limit.maxRequests) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className='text-xs text-[var(--text-tertiary)] pt-1 border-t border-[var(--border-primary)]'>
          重置时间: {formatTime(rateLimits[0]?.resetTime || Date.now())}
        </div>
      </div>
    </div>
  )
}
