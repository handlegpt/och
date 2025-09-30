/**
 * 安全审计工具
 * 检查应用中的安全漏洞和配置问题
 */

// 检查环境变量安全性
export function auditEnvironmentVariables() {
  const issues: string[] = []

  // 检查是否暴露了敏感环境变量
  const sensitiveVars = [
    'GEMINI_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
  ]

  sensitiveVars.forEach(varName => {
    if (import.meta.env[varName]) {
      issues.push(`⚠️ 敏感环境变量 ${varName} 暴露在客户端`)
    }
  })

  return issues
}

// 检查CSP配置
export function auditCSPConfiguration() {
  const issues: string[] = []

  // 检查是否有不安全的CSP配置
  const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  if (csp) {
    const content = csp.getAttribute('content') || ''

    if (content.includes("'unsafe-inline'")) {
      issues.push('⚠️ CSP包含unsafe-inline，存在XSS风险')
    }

    if (content.includes("'unsafe-eval'")) {
      issues.push('⚠️ CSP包含unsafe-eval，存在代码注入风险')
    }
  } else {
    issues.push('❌ 缺少Content Security Policy')
  }

  return issues
}

// 检查认证安全性
export function auditAuthentication() {
  const issues: string[] = []

  // 检查是否有硬编码的认证信息
  // const hardcodedEmails = [
  //   'admin@och.ai',
  //   'your-email@example.com'
  // ]

  // 检查localStorage中的敏感信息
  try {
    const keys = Object.keys(localStorage)
    const sensitiveKeys = keys.filter(
      key => key.includes('token') || key.includes('secret') || key.includes('key')
    )

    if (sensitiveKeys.length > 0) {
      issues.push(`⚠️ localStorage中发现敏感信息: ${sensitiveKeys.join(', ')}`)
    }
  } catch {
    issues.push('⚠️ 无法检查localStorage安全性')
  }

  return issues
}

// 检查输入验证
export function auditInputValidation() {
  const issues: string[] = []

  // 检查是否有未验证的用户输入
  const inputs = document.querySelectorAll('input, textarea')
  inputs.forEach(input => {
    const element = input as HTMLInputElement
    if (!element.hasAttribute('maxlength') && element.type === 'text') {
      issues.push(`⚠️ 输入框 ${element.name || element.id} 缺少长度限制`)
    }
  })

  return issues
}

// 执行完整安全审计
export function performSecurityAudit() {
  const allIssues: string[] = []

  allIssues.push(...auditEnvironmentVariables())
  allIssues.push(...auditCSPConfiguration())
  allIssues.push(...auditAuthentication())
  allIssues.push(...auditInputValidation())

  return {
    totalIssues: allIssues.length,
    issues: allIssues,
    severity: allIssues.length > 5 ? 'HIGH' : allIssues.length > 2 ? 'MEDIUM' : 'LOW',
  }
}

// 安全建议
export const securityRecommendations = [
  {
    category: '认证与授权',
    recommendations: [
      '实施多因素认证 (MFA)',
      '添加会话超时机制',
      '实施账户锁定策略',
      '添加登录尝试限制',
    ],
  },
  {
    category: '数据保护',
    recommendations: [
      '加密敏感数据存储',
      '实施数据备份策略',
      '添加数据删除功能',
      '实施数据访问审计',
    ],
  },
  {
    category: '网络安全',
    recommendations: ['实施HTTPS重定向', '添加安全头部', '配置CORS策略', '实施速率限制'],
  },
  {
    category: '输入验证',
    recommendations: ['实施输入清理', '添加文件类型验证', '实施大小限制', '添加恶意内容检测'],
  },
]
