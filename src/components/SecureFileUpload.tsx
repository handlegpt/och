import React, { useState, useCallback, useRef } from 'react'
import {
  validateImageFile,
  validateBase64Image,
  uploadRateLimiter,
  type FileValidationResult,
} from '../utils/security'

interface SecureFileUploadProps {
  onFileSelect: (file: File, dataUrl: string) => void
  onClear?: () => void
  currentFileUrl?: string | null
  title: string
  description: string
  accept?: string
  maxSize?: number
  disabled?: boolean
  className?: string
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  onClear,
  currentFileUrl,
  title,
  description,
  accept = 'image/*',
  maxSize,
  disabled = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  const [validationError, setValidationError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileValidation = useCallback(
    (file: File): FileValidationResult => {
      // 基础文件验证
      const fileValidation = validateImageFile(file)
      if (!fileValidation.isValid) {
        return fileValidation
      }

      // 自定义大小限制
      if (maxSize && file.size > maxSize) {
        return {
          isValid: false,
          error: `文件过大。最大支持 ${maxSize / (1024 * 1024)}MB`,
        }
      }

      // 速率限制检查
      const userIdentifier = 'anonymous' // 在实际应用中应该使用用户ID
      if (!uploadRateLimiter.isAllowed(userIdentifier)) {
        return {
          isValid: false,
          error: '上传过于频繁，请稍后再试',
        }
      }

      return { isValid: true }
    },
    [maxSize]
  )

  const processFile = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setUploadError('')
      setValidationError('')

      try {
        // 文件验证
        const validation = handleFileValidation(file)
        if (!validation.isValid) {
          setValidationError(validation.error || '文件验证失败')
          return
        }

        // 读取文件
        const reader = new FileReader()

        reader.onload = e => {
          const dataUrl = e.target?.result as string

          // Base64验证
          const base64Validation = validateBase64Image(dataUrl)
          if (!base64Validation.isValid) {
            setValidationError(base64Validation.error || '图片数据验证失败')
            setIsUploading(false)
            return
          }

          // 成功处理
          onFileSelect(file, dataUrl)
          setIsUploading(false)
        }

        reader.onerror = () => {
          setUploadError('文件读取失败')
          setIsUploading(false)
        }

        reader.readAsDataURL(file)
      } catch (error) {
        console.error('File processing error:', error)
        setUploadError('文件处理失败')
        setIsUploading(false)
      }
    },
    [handleFileValidation, onFileSelect]
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const files = event.dataTransfer.files
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile, disabled]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleClear = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setUploadError('')
    setValidationError('')
    onClear?.()
  }, [onClear])

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const inputId = `secure-file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`
  const hasError = !!uploadError || !!validationError
  const displayError = uploadError || validationError

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className='text-sm font-semibold text-[var(--text-primary)]'>{title}</h3>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative w-full aspect-square 
          bg-[var(--bg-secondary)] 
          rounded-lg flex items-center justify-center 
          transition-colors duration-200 select-none cursor-pointer
          ${
            isDragging
              ? 'outline-dashed outline-2 outline-[var(--accent-primary)] bg-[rgba(249,115,22,0.1)]'
              : ''
          }
          ${currentFileUrl ? 'p-0' : 'p-4 border-2 border-dashed border-[var(--border-primary)]'}
          ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-[var(--accent-primary)] hover:bg-[rgba(249,115,22,0.05)]'
          }
        `}
      >
        {!currentFileUrl ? (
          <label
            htmlFor={inputId}
            className='flex flex-col items-center justify-center text-[var(--text-tertiary)] cursor-pointer w-full h-full text-center'
          >
            {isUploading ? (
              <div className='flex flex-col items-center gap-2'>
                <div className='w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin'></div>
                <p className='text-sm text-[var(--accent-primary)]'>处理中...</p>
              </div>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8 mb-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='1.5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.158 0h.008v.008h-.008V8.25z'
                  />
                </svg>
                <p className='mb-1 text-xs font-semibold text-[var(--text-secondary)]'>上传图片</p>
                <p className='text-xs'>{description}</p>
                <p className='text-xs text-[var(--text-tertiary)] mt-1'>支持 JPG, PNG, WebP 格式</p>
              </>
            )}
            <input
              ref={fileInputRef}
              id={inputId}
              type='file'
              className='hidden'
              onChange={handleFileChange}
              accept={accept}
              disabled={disabled}
            />
          </label>
        ) : (
          <div className='relative w-full h-full group'>
            <img
              src={currentFileUrl}
              alt='Uploaded'
              className='w-full h-full object-cover rounded-lg'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center'>
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleClear()
                }}
                className='opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200'
                title='删除图片'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div className='flex items-center gap-2 text-sm text-red-500'>
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          {displayError}
        </div>
      )}

      {!displayError && currentFileUrl && (
        <div className='flex items-center justify-between text-xs text-[var(--text-tertiary)]'>
          <span>图片已上传</span>
          <button
            onClick={handleClear}
            className='text-red-500 hover:text-red-600 transition-colors'
          >
            重新上传
          </button>
        </div>
      )}
    </div>
  )
}
