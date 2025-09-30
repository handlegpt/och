import React, { useState, useEffect } from 'react'
import { performSecurityAudit, securityRecommendations } from '../utils/securityAudit'

interface SecurityAuditProps {
  onClose: () => void
}

export const SecurityAudit: React.FC<SecurityAuditProps> = ({ onClose }) => {
  const [auditResults, setAuditResults] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runAudit = async () => {
    setIsRunning(true)
    try {
      const results = performSecurityAudit()
      setAuditResults(results)
    } catch (error) {
      console.error('Security audit failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    runAudit()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-500'
      case 'MEDIUM':
        return 'text-yellow-500'
      case 'LOW':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>🔒 安全审计报告</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            ✕
          </button>
        </div>

        {isRunning ? (
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>正在执行安全审计...</p>
          </div>
        ) : auditResults ? (
          <div className='space-y-6'>
            {/* 审计摘要 */}
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
              <h3 className='text-lg font-semibold mb-2'>审计摘要</h3>
              <div className='grid grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {auditResults.totalIssues}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>发现问题</div>
                </div>
                <div className='text-center'>
                  <div className={`text-2xl font-bold ${getSeverityColor(auditResults.severity)}`}>
                    {auditResults.severity}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>风险等级</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-500'>
                    {securityRecommendations.length}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>改善建议</div>
                </div>
              </div>
            </div>

            {/* 发现的问题 */}
            {auditResults.issues.length > 0 && (
              <div>
                <h3 className='text-lg font-semibold mb-3'>发现的问题</h3>
                <div className='space-y-2'>
                  {auditResults.issues.map((issue: string, index: number) => (
                    <div
                      key={index}
                      className='flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'
                    >
                      <span className='text-red-500 mt-0.5'>⚠️</span>
                      <span className='text-sm text-red-700 dark:text-red-300'>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 安全建议 */}
            <div>
              <h3 className='text-lg font-semibold mb-3'>安全改善建议</h3>
              <div className='space-y-4'>
                {securityRecommendations.map((category, index) => (
                  <div
                    key={index}
                    className='border border-gray-200 dark:border-gray-600 rounded-lg p-4'
                  >
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      {category.category}
                    </h4>
                    <ul className='space-y-1'>
                      {category.recommendations.map((recommendation, recIndex) => (
                        <li
                          key={recIndex}
                          className='flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400'
                        >
                          <span className='text-green-500 mt-0.5'>✓</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <button
                onClick={runAudit}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
              >
                重新审计
              </button>
              <button
                onClick={onClose}
                className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
              >
                关闭
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
