import React, { useState, useEffect, useCallback } from 'react'

// 复杂的测试组件，模拟真实应用中的复杂逻辑
export const TestComplex: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({ type: 'all', sort: 'date' })
  const [page, setPage] = useState(1)

  // 模拟数据获取
  const fetchData = useCallback(async () => {
    console.log('TestComplex: Fetching data')
    setLoading(true)
    setError(null)

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟数据
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
        type: i % 2 === 0 ? 'image' : 'video',
        date: new Date(Date.now() - i * 86400000).toISOString(),
        status: i % 3 === 0 ? 'pending' : 'completed',
      }))

      setData(mockData)
    } catch (err) {
      setError('Failed to fetch data')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, page]) // 依赖 filters 和 page

  // 模拟过滤数据
  const filteredData = data.filter(item => {
    if (filters.type === 'all') return true
    return item.type === filters.type
  })

  // 模拟排序数据
  const sortedData = [...filteredData].sort((a, b) => {
    if (filters.sort === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return a.title.localeCompare(b.title)
  })

  // 初始数据加载
  useEffect(() => {
    fetchData()
  }, [fetchData]) // 依赖 fetchData

  // 模拟状态更新
  const updateItemStatus = useCallback((id: number, status: string) => {
    setData(prevData => prevData.map(item => (item.id === id ? { ...item, status } : item)))
  }, [])

  // 模拟分页
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  // 模拟过滤器变化
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  if (loading) {
    return <div className='p-4'>Loading complex data...</div>
  }

  if (error) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>Error: {error}</p>
        <button
          onClick={fetchData}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h2>Complex Component Test</h2>
      <p>This component tests complex state management and data fetching.</p>

      {/* 过滤器 */}
      <div className='mb-4 space-x-2'>
        <select
          value={filters.type}
          onChange={e => handleFilterChange({ type: e.target.value })}
          className='px-3 py-1 border rounded'
        >
          <option value='all'>All Types</option>
          <option value='image'>Images</option>
          <option value='video'>Videos</option>
        </select>

        <select
          value={filters.sort}
          onChange={e => handleFilterChange({ sort: e.target.value })}
          className='px-3 py-1 border rounded'
        >
          <option value='date'>Sort by Date</option>
          <option value='name'>Sort by Name</option>
        </select>
      </div>

      {/* 数据列表 */}
      <div className='space-y-2'>
        {sortedData.map(item => (
          <div key={item.id} className='p-3 border rounded flex justify-between items-center'>
            <div>
              <h3 className='font-medium'>{item.title}</h3>
              <p className='text-sm text-gray-500'>
                {item.type} • {new Date(item.date).toLocaleDateString()} • {item.status}
              </p>
            </div>
            <div className='space-x-2'>
              <button
                onClick={() => updateItemStatus(item.id, 'completed')}
                className='px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600'
              >
                Complete
              </button>
              <button
                onClick={() => updateItemStatus(item.id, 'pending')}
                className='px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600'
              >
                Pending
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className='mt-4 flex justify-center space-x-2'>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className='px-3 py-1 border rounded disabled:opacity-50'
        >
          Previous
        </button>
        <span className='px-3 py-1'>Page {page}</span>
        <button onClick={() => handlePageChange(page + 1)} className='px-3 py-1 border rounded'>
          Next
        </button>
      </div>
    </div>
  )
}
