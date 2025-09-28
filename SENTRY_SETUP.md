# Sentry错误监控设置指南

## 🚀 快速开始

### 1. 创建Sentry项目

1. 访问 [Sentry.io](https://sentry.io)
2. 注册/登录账户
3. 创建新项目，选择 "React" 平台
4. 获取项目DSN

### 2. 配置环境变量

在 `.env` 文件中添加：

```bash
# Sentry错误监控配置
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 3. 验证配置

启动应用后，检查浏览器控制台是否显示：
```
✅ Sentry initialized successfully
```

## 📊 监控功能

### 自动错误捕获
- ✅ JavaScript错误
- ✅ 未处理的Promise拒绝
- ✅ 网络请求错误
- ✅ 组件渲染错误

### 性能监控
- ✅ 页面加载时间
- ✅ API响应时间
- ✅ 用户交互延迟
- ✅ 数据库查询性能

### 用户上下文
- ✅ 用户ID和邮箱
- ✅ 用户行为追踪
- ✅ 会话信息

### 业务指标
- ✅ API调用成本
- ✅ 用户使用模式
- ✅ 错误趋势分析

## 🔧 高级配置

### 自定义错误处理

```typescript
import { captureError, captureMessage } from '../lib/sentry'

// 捕获自定义错误
try {
  // 业务逻辑
} catch (error) {
  captureError(error, {
    context: 'user_action',
    userId: user.id,
    action: 'image_generation'
  })
}

// 记录自定义消息
captureMessage('User completed onboarding', 'info', {
  userId: user.id,
  step: 'profile_setup'
})
```

### 性能监控

```typescript
import { capturePerformance } from '../lib/sentry'

// 记录性能指标
const startTime = performance.now()
// ... 执行操作
const duration = performance.now() - startTime
capturePerformance('image_generation', duration, 'ms')
```

### 业务指标追踪

```typescript
import { captureBusinessMetric } from '../lib/sentry'

// 记录业务指标
captureBusinessMetric('user_conversion', 1, {
  source: 'organic',
  plan: 'premium'
})
```

## 📈 监控仪表板

### 访问监控数据

1. 登录Sentry控制台
2. 选择对应项目
3. 查看以下页面：
   - **Issues**: 错误报告
   - **Performance**: 性能监控
   - **Releases**: 版本发布
   - **Alerts**: 告警设置

### 关键指标

- **错误率**: < 1%
- **平均响应时间**: < 2秒
- **用户满意度**: > 95%
- **系统可用性**: > 99.9%

## 🚨 告警设置

### 错误告警
- 错误率超过5%
- 新错误类型出现
- 关键功能错误

### 性能告警
- 平均响应时间超过5秒
- 页面加载时间超过10秒
- 数据库查询超时

### 业务告警
- 用户注册量异常
- API调用量激增
- 成本超出预算

## 🔍 故障排查

### 常见问题

1. **Sentry未初始化**
   - 检查DSN配置
   - 确认环境变量正确
   - 查看控制台错误

2. **错误未上报**
   - 检查网络连接
   - 确认Sentry项目状态
   - 查看浏览器控制台

3. **性能数据缺失**
   - 确认browserTracingIntegration配置
   - 检查采样率设置
   - 验证用户行为

### 调试模式

在开发环境中启用详细日志：

```typescript
// 在sentry.ts中添加
debug: process.env.NODE_ENV === 'development'
```

## 📚 最佳实践

### 错误处理
- 使用try-catch包装关键操作
- 提供用户友好的错误消息
- 记录足够的上下文信息

### 性能优化
- 监控关键用户路径
- 识别性能瓶颈
- 优化慢查询和操作

### 数据隐私
- 不记录敏感用户数据
- 使用数据脱敏
- 遵守GDPR规范

## 🛠️ 维护指南

### 定期检查
- 每周查看错误报告
- 每月分析性能趋势
- 季度评估监控效果

### 优化建议
- 根据错误频率调整优先级
- 基于性能数据优化代码
- 持续改进监控策略

## 📞 支持

如有问题，请联系：
- 技术支持: support@och.ai
- 文档更新: docs@och.ai
- 紧急联系: +1-xxx-xxx-xxxx

---

**注意**: 请确保在生产环境中正确配置Sentry，以获得完整的监控覆盖。
