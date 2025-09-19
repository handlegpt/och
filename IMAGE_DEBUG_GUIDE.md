# 图片加载问题诊断指南

## 问题描述
图片在本地开发环境能正常显示，但在服务器上无法显示。

## 诊断步骤

### 1. 使用调试页面
访问 `https://your-domain.com/debug-images.html` 来测试图片加载情况。

### 2. 直接访问图片URL
在浏览器中直接访问以下URL：
- `https://your-domain.com/images/demo-figurine.jpg`
- `https://your-domain.com/images/demo-anime.jpg`
- `https://your-domain.com/images/demo-plushie.jpg`

### 3. 检查网络请求
打开浏览器开发者工具（F12），查看Network标签页：
- 查看图片请求的状态码
- 检查是否有CORS错误
- 查看响应头信息

## 可能的原因和解决方案

### 1. 服务器静态文件配置问题
**症状**: 图片返回404错误
**解决方案**:
- 确保服务器正确配置了静态文件服务
- 检查`/images/`路径映射
- 验证`public`目录被正确复制到部署环境

### 2. 路径问题
**症状**: 图片路径不正确
**解决方案**:
- 检查图片路径是否以`/`开头（绝对路径）
- 确保路径大小写正确
- 验证文件名拼写

### 3. 缓存问题
**症状**: 图片有时能加载，有时不能
**解决方案**:
- 清除浏览器缓存
- 检查CDN缓存设置
- 添加版本参数：`/images/demo-figurine.jpg?v=1`

### 4. 文件权限问题
**症状**: 图片返回403错误
**解决方案**:
- 检查文件权限设置
- 确保Web服务器有读取权限

### 5. 文件大小问题
**症状**: 大文件加载失败
**解决方案**:
- 检查服务器文件大小限制
- 优化图片大小和格式

## 测试命令

### 本地测试
```bash
# 构建项目
npm run build

# 启动预览服务器
npm run preview

# 测试图片访问
curl -I http://localhost:4173/images/demo-figurine.jpg
```

### 服务器测试
```bash
# 检查文件是否存在
ls -la /path/to/dist/images/

# 测试HTTP请求
curl -I https://your-domain.com/images/demo-figurine.jpg

# 检查文件权限
stat /path/to/dist/images/demo-figurine.jpg
```

## 临时解决方案

如果图片仍然无法加载，可以考虑以下临时方案：

### 1. 使用CDN
将图片上传到CDN服务（如Cloudinary、AWS S3等），然后更新图片URL。

### 2. 内联Base64
将小图片转换为Base64格式直接嵌入代码中。

### 3. 使用占位符
暂时使用占位符图片，直到问题解决。

## 预防措施

1. **构建验证**: 在部署前验证`dist`目录包含所有必要文件
2. **自动化测试**: 添加图片加载的自动化测试
3. **监控**: 设置图片加载失败的监控和告警
4. **文档**: 记录部署流程和配置要求

## 联系支持

如果问题仍然存在，请提供以下信息：
- 服务器环境信息
- 错误日志
- 网络请求详情
- 调试页面结果
