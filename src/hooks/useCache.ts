import { useState, useEffect, useCallback } from 'react'

export interface CacheOptions {
  ttl?: number // 缓存时间（毫秒）
  staleWhileRevalidate?: boolean // 是否在后台重新验证
  retryCount?: number // 重试次数
  retryDelay?: number // 重试延迟
}

export interface CacheResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  clear: () => void
}

const CACHE_PREFIX = 'och-ai-cache-'
const DEFAULT_TTL = 5 * 60 * 1000 // 5分钟

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): CacheResult<T> {
  const {
    ttl = DEFAULT_TTL,
    staleWhileRevalidate = true,
    retryCount = 3,
    retryDelay = 1000,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const cacheKey = `${CACHE_PREFIX}${key}`

  // 从缓存获取数据
  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const { data: cachedData, timestamp } = JSON.parse(cached)
      const now = Date.now()

      // 检查是否过期
      if (now - timestamp > ttl) {
        localStorage.removeItem(cacheKey)
        return null
      }

      return cachedData
    } catch (error) {
      console.error('Cache read error:', error)
      return null
    }
  }, [cacheKey, ttl])

  // 保存数据到缓存
  const setCachedData = useCallback(
    (newData: T) => {
      try {
        const cacheData = {
          data: newData,
          timestamp: Date.now(),
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      } catch (error) {
        console.error('Cache write error:', error)
      }
    },
    [cacheKey]
  )

  // 清除缓存
  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey)
    setData(null)
  }, [cacheKey])

  // 获取数据（带重试）
  const fetchData = useCallback(
    async (retryAttempt = 0): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        setData(result)
        setCachedData(result)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')

        if (retryAttempt < retryCount) {
          // 重试
          setTimeout(
            () => {
              fetchData(retryAttempt + 1)
            },
            retryDelay * Math.pow(2, retryAttempt)
          ) // 指数退避
        } else {
          setError(error)
        }
      } finally {
        setLoading(false)
      }
    },
    [fetcher, retryCount, retryDelay, setCachedData]
  )

  // 初始化数据
  useEffect(() => {
    const cachedData = getCachedData()

    if (cachedData) {
      setData(cachedData)

      // 如果启用后台重新验证，在后台更新数据
      if (staleWhileRevalidate) {
        fetchData()
      }
    } else {
      // 没有缓存数据，直接获取
      fetchData()
    }
  }, [key, ttl, staleWhileRevalidate, retryCount, retryDelay])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clear: clearCache,
  }
}

// 预定义的缓存 hooks
export function useUserProfile(userId: string) {
  return useCache(
    `user-profile-${userId}`,
    async () => {
      // 这里应该调用实际的 API
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user profile')
      return response.json()
    },
    { ttl: 10 * 60 * 1000 } // 10分钟缓存
  )
}

export function useGalleryItems(page: number = 1, limit: number = 20) {
  return useCache(
    `gallery-items-${page}-${limit}`,
    async () => {
      // 这里应该调用实际的 API
      const response = await fetch(`/api/gallery?page=${page}&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch gallery items')
      return response.json()
    },
    { ttl: 5 * 60 * 1000 } // 5分钟缓存
  )
}

export function useUserStats(userId: string) {
  return useCache(
    `user-stats-${userId}`,
    async () => {
      // 这里应该调用实际的 API
      const response = await fetch(`/api/users/${userId}/stats`)
      if (!response.ok) throw new Error('Failed to fetch user stats')
      return response.json()
    },
    { ttl: 2 * 60 * 1000 } // 2分钟缓存
  )
}
