import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useCache } from './useCache'

describe('useCache', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('fetches data on first load', async () => {
    const mockFetcher = vi.fn().mockResolvedValue({ data: 'test' })

    const { result } = renderHook(() => useCache('test-key', mockFetcher))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual({ data: 'test' })
    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('returns cached data when available', async () => {
    // 预设缓存数据
    const cachedData = { data: 'cached' }
    const cacheData = {
      data: cachedData,
      timestamp: Date.now(),
    }
    localStorage.setItem('och-ai-cache-test-key', JSON.stringify(cacheData))

    const mockFetcher = vi.fn().mockResolvedValue({ data: 'fresh' })

    const { result } = renderHook(() => useCache('test-key', mockFetcher))

    expect(result.current.data).toEqual(cachedData)
    expect(result.current.loading).toBe(false)
    expect(mockFetcher).not.toHaveBeenCalled()
  })

  it('refetches when cache is expired', async () => {
    // 预设过期缓存
    const expiredData = {
      data: { data: 'expired' },
      timestamp: Date.now() - 10 * 60 * 1000, // 10分钟前
    }
    localStorage.setItem('och-ai-cache-test-key', JSON.stringify(expiredData))

    const mockFetcher = vi.fn().mockResolvedValue({ data: 'fresh' })

    const { result } = renderHook(
      () => useCache('test-key', mockFetcher, { ttl: 5 * 60 * 1000 }) // 5分钟TTL
    )

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'fresh' })
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('handles fetch errors', async () => {
    const mockError = new Error('Fetch failed')
    const mockFetcher = vi.fn().mockRejectedValue(mockError)

    const { result } = renderHook(() => useCache('test-key', mockFetcher))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(mockError)
    expect(result.current.data).toBeNull()
  })

  it('retries on failure', async () => {
    const mockFetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('First attempt'))
      .mockRejectedValueOnce(new Error('Second attempt'))
      .mockResolvedValue({ data: 'success' })

    const { result } = renderHook(() =>
      useCache('test-key', mockFetcher, { retryCount: 2, retryDelay: 10 })
    )

    await waitFor(
      () => {
        expect(result.current.data).toEqual({ data: 'success' })
      },
      { timeout: 1000 }
    )

    expect(mockFetcher).toHaveBeenCalledTimes(3)
  })

  it('stops retrying after max attempts', async () => {
    const mockError = new Error('Persistent error')
    const mockFetcher = vi.fn().mockRejectedValue(mockError)

    const { result } = renderHook(() =>
      useCache('test-key', mockFetcher, { retryCount: 2, retryDelay: 10 })
    )

    await waitFor(
      () => {
        expect(result.current.error).toEqual(mockError)
      },
      { timeout: 1000 }
    )

    expect(mockFetcher).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
  })

  it('refetches data when refetch is called', async () => {
    const mockFetcher = vi.fn().mockResolvedValue({ data: 'initial' })

    const { result } = renderHook(() => useCache('test-key', mockFetcher))

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'initial' })
    })

    // 更新 fetcher 返回值
    mockFetcher.mockResolvedValue({ data: 'refetched' })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data).toEqual({ data: 'refetched' })
    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('clears cache when clear is called', async () => {
    const mockFetcher = vi.fn().mockResolvedValue({ data: 'test' })

    const { result } = renderHook(() => useCache('test-key', mockFetcher))

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'test' })
    })

    act(() => {
      result.current.clear()
    })

    expect(result.current.data).toBeNull()
    expect(localStorage.getItem('och-ai-cache-test-key')).toBeNull()
  })

  it('uses stale-while-revalidate strategy', async () => {
    // 预设缓存数据
    const cachedData = { data: 'cached' }
    const cacheData = {
      data: cachedData,
      timestamp: Date.now() - 2 * 60 * 1000, // 2分钟前
    }
    localStorage.setItem('och-ai-cache-test-key', JSON.stringify(cacheData))

    const mockFetcher = vi.fn().mockResolvedValue({ data: 'fresh' })

    const { result } = renderHook(() =>
      useCache('test-key', mockFetcher, {
        ttl: 5 * 60 * 1000, // 5分钟TTL
        staleWhileRevalidate: true,
      })
    )

    // 应该立即返回缓存数据
    expect(result.current.data).toEqual(cachedData)

    // 等待后台重新验证
    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'fresh' })
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('handles localStorage errors gracefully', async () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem
    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const mockFetcher = vi.fn().mockResolvedValue({ data: 'test' })

    const { result } = renderHook(() => useCache('test-key', mockFetcher))

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'test' })
    })

    // 应该仍然正常工作，只是不能缓存
    expect(result.current.data).toEqual({ data: 'test' })

    // 恢复 localStorage
    localStorage.setItem = originalSetItem
  })
})
