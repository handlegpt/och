/**
 * 安全工具函数
 * 提供输入验证、XSS防护、文件验证等功能
 */

// 文件类型验证
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_PROMPT_LENGTH = 1000
export const MAX_USERNAME_LENGTH = 50
export const MAX_DISPLAY_NAME_LENGTH = 100

// 危险字符和脚本模式
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
  /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi, // onclick, onload, etc.
]

// 文件验证
export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateImageFile(file: File): FileValidationResult {
  // 检查文件类型
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `不支持的文件类型。仅支持: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    }
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `文件过大。最大支持 ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  // 检查文件名
  if (!isValidFileName(file.name)) {
    return {
      isValid: false,
      error: '文件名包含非法字符',
    }
  }

  return { isValid: true }
}

// 文件名验证
export function isValidFileName(fileName: string): boolean {
  // 检查文件名长度
  if (fileName.length > 255) return false

  // 检查危险字符
  const dangerousChars = /[<>:"/\\|?*]/
  if (dangerousChars.test(fileName)) return false

  // 检查保留名称
  const reservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ]
  const nameWithoutExt = fileName?.split('.')[0]?.toUpperCase()
  if (reservedNames.includes(nameWithoutExt)) return false

  return true
}

// XSS防护 - 清理HTML内容
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return ''

  // 移除所有HTML标签
  let sanitized = input.replace(/<[^>]*>/g, '')

  // 移除危险模式
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })

  // 转义特殊字符
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  return sanitized
}

// 输入验证
export interface InputValidationResult {
  isValid: boolean
  error?: string
  sanitizedValue?: string
}

export function validatePrompt(prompt: string): InputValidationResult {
  if (typeof prompt !== 'string') {
    return { isValid: false, error: '提示词必须是文本' }
  }

  // 检查长度
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return {
      isValid: false,
      error: `提示词过长，最大支持 ${MAX_PROMPT_LENGTH} 个字符`,
    }
  }

  // 检查是否为空
  if (!prompt.trim()) {
    return { isValid: false, error: '提示词不能为空' }
  }

  // 检查危险内容
  if (containsDangerousContent(prompt)) {
    return { isValid: false, error: '提示词包含不当内容' }
  }

  // 清理并返回
  const sanitized = sanitizeHtml(prompt.trim())
  return { isValid: true, sanitizedValue: sanitized }
}

export function validateUsername(username: string): InputValidationResult {
  if (typeof username !== 'string') {
    return { isValid: false, error: '用户名必须是文本' }
  }

  const trimmed = username.trim()

  // 检查长度
  if (trimmed.length === 0) {
    return { isValid: false, error: '用户名不能为空' }
  }

  if (trimmed.length > MAX_USERNAME_LENGTH) {
    return {
      isValid: false,
      error: `用户名过长，最大支持 ${MAX_USERNAME_LENGTH} 个字符`,
    }
  }

  // 检查字符
  const validChars = /^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/
  if (!validChars.test(trimmed)) {
    return {
      isValid: false,
      error: '用户名只能包含字母、数字、下划线、中文字符和连字符',
    }
  }

  // 检查危险内容
  if (containsDangerousContent(trimmed)) {
    return { isValid: false, error: '用户名包含不当内容' }
  }

  return { isValid: true, sanitizedValue: trimmed }
}

export function validateDisplayName(displayName: string): InputValidationResult {
  if (typeof displayName !== 'string') {
    return { isValid: false, error: '显示名称必须是文本' }
  }

  const trimmed = displayName.trim()

  // 检查长度
  if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      isValid: false,
      error: `显示名称过长，最大支持 ${MAX_DISPLAY_NAME_LENGTH} 个字符`,
    }
  }

  // 检查危险内容
  if (containsDangerousContent(trimmed)) {
    return { isValid: false, error: '显示名称包含不当内容' }
  }

  const sanitized = sanitizeHtml(trimmed)
  return { isValid: true, sanitizedValue: sanitized }
}

// 检查是否包含危险内容
export function containsDangerousContent(input: string): boolean {
  if (typeof input !== 'string') return false

  // 检查危险模式
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(input))
}

// Base64验证
export function validateBase64Image(base64String: string): InputValidationResult {
  if (typeof base64String !== 'string') {
    return { isValid: false, error: '图片数据格式错误' }
  }

  // 检查Base64格式
  const base64Regex = /^data:image\/(jpeg|jpg|png|webp);base64,/
  if (!base64Regex.test(base64String)) {
    return { isValid: false, error: '不支持的图片格式' }
  }

  // 提取MIME类型
  const mimeType = base64String?.split(';')[0]?.split(':')[1]
  if (!mimeType || !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return { isValid: false, error: '不支持的图片类型' }
  }

  // 检查数据大小（Base64编码会增加约33%的大小）
  const base64Data = base64String?.split(',')[1]
  const estimatedSize = (base64Data.length * 3) / 4
  if (estimatedSize > MAX_FILE_SIZE) {
    return { isValid: false, error: '图片数据过大' }
  }

  return { isValid: true }
}

// URL验证
export function validateUrl(url: string): InputValidationResult {
  if (typeof url !== 'string') {
    return { isValid: false, error: 'URL格式错误' }
  }

  try {
    const urlObj = new URL(url)

    // 只允许HTTP和HTTPS协议
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: '只支持HTTP和HTTPS协议' }
    }

    // 检查危险内容
    if (containsDangerousContent(url)) {
      return { isValid: false, error: 'URL包含不当内容' }
    }

    return { isValid: true, sanitizedValue: url }
  } catch {
    return { isValid: false, error: 'URL格式无效' }
  }
}

// 速率限制检查
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []

    // 清理过期请求
    const validRequests = requests.filter(time => now - time < this.windowMs)

    if (validRequests.length >= this.maxRequests) {
      return false
    }

    // 添加当前请求
    validRequests.push(now)
    this.requests.set(identifier, validRequests)

    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    const validRequests = requests.filter(time => now - time < this.windowMs)

    return Math.max(0, this.maxRequests - validRequests.length)
  }
}

// 创建全局速率限制器
export const globalRateLimiter = new RateLimiter(100, 60000) // 每分钟100次请求
export const uploadRateLimiter = new RateLimiter(10, 60000) // 每分钟10次上传
export const generationRateLimiter = new RateLimiter(5, 60000) // 每分钟5次生成
