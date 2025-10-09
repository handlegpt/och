// 自定义服务器 - 修复 SPA 路由问题
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const PORT = process.env.PORT || 4173
const DIST_DIR = path.join(__dirname, 'dist')

// MIME 类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
}

// 安全头
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// 创建服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url)
  const pathname = parsedUrl.pathname

  // 健康检查端点
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('healthy')
    return
  }

  // 添加安全头
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  // 处理认证回调路由 - 关键修复
  if (pathname === '/auth/callback') {
    console.log('🔐 Handling auth callback:', pathname)
    serveIndexHtml(res)
    return
  }

  // 构建文件路径
  let filePath = path.join(DIST_DIR, pathname)

  // 检查文件是否存在
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 文件不存在，尝试作为目录处理
      if (pathname.endsWith('/')) {
        filePath = path.join(filePath, 'index.html')
      } else {
        filePath = path.join(DIST_DIR, 'index.html')
      }

      // 再次检查
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          // 最终回退到 index.html (SPA 路由)
          console.log('🔄 SPA fallback for:', pathname)
          serveIndexHtml(res)
        } else {
          serveFile(res, filePath)
        }
      })
    } else {
      serveFile(res, filePath)
    }
  })
})

// 服务 index.html 文件
function serveIndexHtml(res) {
  const indexPath = path.join(DIST_DIR, 'index.html')

  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
      return
    }

    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    })
    res.end(data)
  })
}

// 服务静态文件
function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('File Not Found')
      return
    }

    // 为静态资源设置缓存头
    const cacheControl =
      ext === '.html'
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=31536000, immutable'

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
    })
    res.end(data)
  })
}

// 启动服务器
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  console.log(`📁 Serving files from: ${DIST_DIR}`)
  console.log(`🔐 Auth callback route: /auth/callback`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})
