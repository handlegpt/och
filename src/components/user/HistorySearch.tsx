import React, { useState, useCallback, useMemo } from 'react'
// import { useTranslation } from '../../../i18n/context' // Commented out as not currently used

interface SearchFilters {
  query: string
  transformationType: string
  dateRange: {
    start: string
    end: string
  }
  status: string
}

interface HistorySearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
  totalResults?: number
  isLoading?: boolean
}

export const HistorySearch: React.FC<HistorySearchProps> = ({
  onSearch,
  onClear,
  totalResults = 0,
  isLoading = false,
}) => {
  // const { t } = useTranslation() // Commented out as not currently used
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    transformationType: 'all',
    dateRange: {
      start: '',
      end: '',
    },
    status: 'all',
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const transformationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'pose', label: 'Pose Transform' },
    { value: 'style', label: 'Style Transform' },
    { value: 'background', label: 'Background Transform' },
    { value: 'face', label: 'Face Transform' },
    { value: 'custom', label: 'Custom' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' },
  ]

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleSearch = useCallback(() => {
    onSearch(filters)
  }, [filters, onSearch])

  const handleClear = useCallback(() => {
    setFilters({
      query: '',
      transformationType: 'all',
      dateRange: {
        start: '',
        end: '',
      },
      status: 'all',
    })
    onClear()
  }, [onClear])

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query !== '' ||
      filters.transformationType !== 'all' ||
      filters.dateRange.start !== '' ||
      filters.dateRange.end !== '' ||
      filters.status !== 'all'
    )
  }, [filters])

  return (
    <div className='bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-primary)] mb-4'>
      {/* 搜索栏 */}
      <div className='flex gap-3 mb-4'>
        <div className='flex-1 relative'>
          <input
            type='text'
            value={filters.query}
            onChange={e => handleFilterChange('query', e.target.value)}
            placeholder='Search by prompt, title, or description...'
            className='w-full px-4 py-2 pl-10 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent'
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
          />
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)]'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? (
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
          ) : (
            'Search'
          )}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
            />
          </svg>
        </button>
      </div>

      {/* 高级筛选 */}
      {isExpanded && (
        <div className='space-y-4 border-t border-[var(--border-primary)] pt-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* 变换类型 */}
            <div>
              <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
                Transformation Type
              </label>
              <select
                value={filters.transformationType}
                onChange={e => handleFilterChange('transformationType', e.target.value)}
                className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
              >
                {transformationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 状态 */}
            <div>
              <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
                Status
              </label>
              <select
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
                className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 日期范围 */}
            <div>
              <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
                Date Range
              </label>
              <div className='flex gap-2'>
                <input
                  type='date'
                  value={filters.dateRange.start}
                  onChange={e =>
                    handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })
                  }
                  className='flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm'
                  placeholder='Start date'
                />
                <input
                  type='date'
                  value={filters.dateRange.end}
                  onChange={e =>
                    handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })
                  }
                  className='flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm'
                  placeholder='End date'
                />
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className='flex justify-between items-center'>
            <div className='flex gap-2'>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Apply Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors'
                >
                  Clear All
                </button>
              )}
            </div>

            {totalResults > 0 && (
              <div className='text-sm text-[var(--text-secondary)]'>
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        </div>
      )}

      {/* 快速筛选标签 */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2 mt-4'>
          {filters.query && (
            <span className='px-3 py-1 bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)] rounded-full text-sm'>
              Query: "{filters.query}"
            </span>
          )}
          {filters.transformationType !== 'all' && (
            <span className='px-3 py-1 bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)] rounded-full text-sm'>
              Type: {transformationTypes.find(t => t.value === filters.transformationType)?.label}
            </span>
          )}
          {filters.status !== 'all' && (
            <span className='px-3 py-1 bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)] rounded-full text-sm'>
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
            </span>
          )}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <span className='px-3 py-1 bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)] rounded-full text-sm'>
              Date: {filters.dateRange.start || 'Start'} - {filters.dateRange.end || 'End'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
