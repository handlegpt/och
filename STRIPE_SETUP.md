# Stripe 支付集成设置指南

本指南将帮助您设置 Stripe 支付系统，为 och.ai 应用添加订阅功能。

## 1. 创建 Stripe 账户

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 注册或登录您的 Stripe 账户
3. 完成账户验证和设置

## 2. 获取 API 密钥

### 测试环境
1. 在 Stripe Dashboard 中，切换到 "Test mode"
2. 进入 "Developers" > "API keys"
3. 复制 "Publishable key" 和 "Secret key"

### 生产环境
1. 切换到 "Live mode"
2. 获取生产环境的 API 密钥

## 3. 配置环境变量

在您的 `.env` 文件中添加以下配置：

```bash
# Stripe 支付配置
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 4. 创建产品和价格

### 在 Stripe Dashboard 中创建产品

1. 进入 "Products" 页面
2. 点击 "Add product"
3. 创建以下产品：

#### 标准版 (Standard)
- **产品名称**: Standard Plan
- **描述**: Perfect for individuals and small teams
- **价格**: 
  - 月付: ¥69/月
  - 年付: ¥690/年

#### 专业版 (Professional)
- **产品名称**: Professional Plan
- **描述**: For professionals and growing businesses
- **价格**:
  - 月付: ¥199/月
  - 年付: ¥1990/年

#### 企业版 (Enterprise)
- **产品名称**: Enterprise Plan
- **描述**: Custom solutions for large organizations
- **价格**:
  - 月付: ¥499/月
  - 年付: ¥4990/年

### 获取价格 ID

创建产品后，您需要获取每个价格的 ID，并更新 `src/lib/stripe.ts` 中的 `STRIPE_PRICES` 配置：

```typescript
export const STRIPE_PRICES = {
  standard: {
    monthly: 'price_standard_monthly_actual_id', // 替换为实际的价格 ID
    yearly: 'price_standard_yearly_actual_id',
  },
  professional: {
    monthly: 'price_professional_monthly_actual_id',
    yearly: 'price_professional_yearly_actual_id',
  },
  enterprise: {
    monthly: 'price_enterprise_monthly_actual_id',
    yearly: 'price_enterprise_yearly_actual_id',
  },
} as const
```

## 5. 设置 Webhook

### 创建 Webhook 端点

1. 在 Stripe Dashboard 中，进入 "Developers" > "Webhooks"
2. 点击 "Add endpoint"
3. 设置端点 URL: `https://your-domain.com/api/stripe/webhook`
4. 选择以下事件：
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 获取 Webhook 密钥

创建 Webhook 后，复制 "Signing secret" 并更新环境变量。

## 6. 设置 Supabase Edge Functions

### 创建支付会话函数

创建 `supabase/functions/create-checkout-session/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId,
      },
    })

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 创建 Webhook 处理函数

创建 `supabase/functions/stripe-webhook/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11.15',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

async function handleCheckoutSessionCompleted(session: any) {
  // 处理支付成功逻辑
  const userId = session.metadata.userId
  const subscriptionId = session.subscription

  // 更新用户订阅状态
  await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      status: 'active',
    })
}

async function handleSubscriptionUpdated(subscription: any) {
  // 处理订阅更新逻辑
}

async function handleSubscriptionDeleted(subscription: any) {
  // 处理订阅取消逻辑
}
```

## 7. 部署 Edge Functions

```bash
# 部署函数到 Supabase
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

## 8. 测试支付流程

### 测试环境
1. 使用 Stripe 测试卡号: `4242 4242 4242 4242`
2. 使用任意未来的过期日期和 CVC
3. 测试不同的支付场景

### 测试卡号
- **成功**: 4242 4242 4242 4242
- **需要验证**: 4000 0025 0000 3155
- **被拒绝**: 4000 0000 0000 0002

## 9. 监控和日志

### Stripe Dashboard
- 查看支付和订阅状态
- 监控收入和分析
- 处理退款和争议

### 应用监控
- 检查用户订阅状态
- 监控支付失败
- 处理客户支持请求

## 10. 安全注意事项

1. **API 密钥安全**: 永远不要在客户端暴露 Secret Key
2. **Webhook 验证**: 始终验证 Webhook 签名
3. **数据加密**: 敏感数据使用加密存储
4. **访问控制**: 限制对支付相关 API 的访问

## 11. 故障排除

### 常见问题

1. **支付失败**: 检查 Stripe 密钥配置
2. **Webhook 不工作**: 验证 URL 和签名
3. **订阅状态不同步**: 检查数据库更新逻辑

### 调试工具

- Stripe Dashboard 日志
- Supabase 函数日志
- 浏览器开发者工具

## 12. 生产环境检查清单

- [ ] 更新为生产环境 API 密钥
- [ ] 配置生产环境 Webhook URL
- [ ] 测试所有支付流程
- [ ] 设置监控和告警
- [ ] 配置备份和恢复
- [ ] 准备客户支持流程

## 支持

如有问题，请参考：
- [Stripe 文档](https://stripe.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- 联系技术支持: support@och.ai
