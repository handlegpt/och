import React, { useState } from 'react'
import { useTranslation } from '../../i18n/context'
import { PRICING_TIERS, FEATURE_COMPARISON } from '../config/pricing'
import { PaymentModal } from '../components/payment/PaymentModal'
import { useAuth } from '../hooks/useAuth'

export const PricingPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string>('standard')
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean
    planId: string
    billingCycle: 'monthly' | 'yearly'
    price: number
    planName: string
  }>({
    isOpen: false,
    planId: '',
    billingCycle: 'monthly',
    price: 0,
    planName: '',
  })

  const handleSelectPlan = (tierId: string) => {
    setSelectedTier(tierId)

    // 如果是免费计划，直接跳转到首页
    if (tierId === 'free') {
      window.location.href = '/'
      return
    }

    // 检查用户是否已登录
    if (!user) {
      // 可以显示登录提示或跳转到登录页面
      alert('请先登录以订阅服务')
      return
    }

    // 获取计划信息
    const tier = PRICING_TIERS.find(t => t.id === tierId)
    if (!tier) return

    const price = billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly

    // 打开支付模态框
    setPaymentModal({
      isOpen: true,
      planId: tierId,
      billingCycle,
      price: price * 100, // 转换为分
      planName: t(`app.${tier.name}`),
    })
  }

  const handleClosePaymentModal = () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }))
  }

  const getPrice = (tier: any) => {
    return billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly
  }

  const getSavings = (tier: any) => {
    if (billingCycle === 'yearly' && tier.price.yearly > 0) {
      const monthlyTotal = tier.price.monthly * 12
      const savings = monthlyTotal - tier.price.yearly
      return Math.round((savings / monthlyTotal) * 100)
    }
    return 0
  }

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] pb-20'>
      <div className='container mx-auto p-4 md:p-8'>
        {/* 页面标题 - 参考 Nano Banana AI 的大气设计 */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-sm text-[var(--accent-primary)] mb-6'>
            <span>✨</span>
            Powered by Nano Banana AI
          </div>
          <h1 className='text-5xl md:text-6xl font-black text-[var(--text-primary)] mb-6 leading-tight'>
            {t('app.pricing.title')}
          </h1>
          <p className='text-xl md:text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto leading-relaxed'>
            {t('app.pricing.subtitle')}
          </p>

          {/* 计费周期切换 */}
          <div className='flex items-center justify-center gap-4 mb-8'>
            <span
              className={`text-sm ${billingCycle === 'monthly' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
              {t('app.pricing.monthly')}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className='relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--accent-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2'
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm ${billingCycle === 'yearly' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
              {t('app.pricing.yearly')}
            </span>
            {billingCycle === 'yearly' && (
              <span className='ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                {t('app.pricing.save').replace('{percent}', '17')}
              </span>
            )}
          </div>
        </div>

        {/* 定价卡片 - 参考 Nano Banana AI 的专业设计 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20'>
          {PRICING_TIERS.map(tier => (
            <div
              key={tier.id}
              className={`relative bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20 hover:-translate-y-2 ${
                tier.popular
                  ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)] ring-opacity-30 shadow-2xl shadow-[var(--accent-primary)]/20'
                  : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
              } ${selectedTier === tier.id ? 'ring-2 ring-[var(--accent-primary)]' : ''}`}
            >
              {/* 推荐标签 - 参考 Nano Banana AI */}
              {tier.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <span className='bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white px-6 py-2 text-sm font-bold rounded-full shadow-lg'>
                    {t('app.pricing.mostPopular')}
                  </span>
                </div>
              )}

              {/* 套餐信息 - 参考 Nano Banana AI 的专业展示 */}
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-3'>
                  {t(`app.${tier.name}`)}
                </h3>
                <p className='text-base text-[var(--text-secondary)] mb-6 leading-relaxed'>
                  {t(`app.${tier.description}`)}
                </p>

                {/* 价格 - 参考 Nano Banana AI 的突出展示 */}
                <div className='mb-6'>
                  {tier.price.monthly === 0 ? (
                    <div className='text-4xl font-black text-[var(--text-primary)]'>
                      {t('app.pricing.free')}
                    </div>
                  ) : (
                    <div className='flex items-baseline justify-center'>
                      <span className='text-5xl font-black text-[var(--text-primary)]'>
                        ${getPrice(tier)}
                      </span>
                      <span className='text-lg text-[var(--text-secondary)] ml-2'>
                        /
                        {billingCycle === 'yearly' ? t('app.pricing.year') : t('app.pricing.month')}
                      </span>
                    </div>
                  )}

                  {/* 年度节省 */}
                  {billingCycle === 'yearly' && tier.price.yearly > 0 && (
                    <div className='text-sm text-green-600 mt-1'>
                      {t('app.pricing.saveAmount').replace(
                        '{percent}',
                        getSavings(tier).toString()
                      )}
                    </div>
                  )}
                </div>

                {/* 限制信息 */}
                <div className='text-sm text-[var(--text-secondary)] mb-6'>
                  {tier.limits.dailyGenerations === -1 ? (
                    <span>{t('app.pricing.unlimitedGenerations')}</span>
                  ) : (
                    <span>
                      {t('app.pricing.dailyGenerations').replace(
                        '{count}',
                        tier.limits.dailyGenerations.toString()
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* 功能列表 */}
              <div className='space-y-3 mb-6'>
                {Object.entries(tier.features).map(([feature, enabled]) => (
                  <div key={feature} className='flex items-center'>
                    <span className='mr-3'>{enabled ? '✅' : '❌'}</span>
                    <span
                      className={`text-sm ${enabled ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {t(`app.pricing.features.${feature}`) || feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* 选择按钮 - 参考 Nano Banana AI 的专业CTA */}
              <button
                onClick={() => handleSelectPlan(tier.id)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  tier.id === 'free'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-primary)] hover:bg-[var(--bg-primary)] hover:border-[var(--accent-primary)]'
                    : tier.popular
                      ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-2xl hover:shadow-[var(--accent-primary)]/25'
                      : 'bg-[var(--accent-primary)] text-white hover:opacity-90 shadow-lg hover:shadow-xl'
                }`}
              >
                {tier.id === 'free' ? t('app.pricing.getStarted') : t('app.pricing.selectPlan')}
              </button>

              {/* 企业版特殊处理 */}
              {tier.id === 'enterprise' && (
                <div className='mt-4 text-center'>
                  <button className='text-[var(--accent-primary)] text-sm hover:underline'>
                    {t('app.pricing.contactSales')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 功能对比表 - 参考 Nano Banana AI 的专业设计 */}
        <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] overflow-hidden shadow-2xl'>
          <div className='p-8 border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5'>
            <h2 className='text-3xl font-bold text-[var(--text-primary)] text-center'>
              {t('app.pricing.featureComparison')}
            </h2>
            <p className='text-[var(--text-secondary)] text-center mt-2'>
              {t('app.pricing.featureComparisonDescription')}
            </p>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[var(--border-primary)]'>
                  <th className='text-left p-4 text-[var(--text-primary)] font-medium'>
                    {t('app.pricing.featureComparison')}
                  </th>
                  {PRICING_TIERS.map(tier => (
                    <th
                      key={tier.id}
                      className='text-center p-4 text-[var(--text-primary)] font-medium'
                    >
                      {t(`app.${tier.name}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, index) => (
                  <tr key={index} className='border-b border-[var(--border-primary)]'>
                    <td className='p-4 text-[var(--text-primary)] font-medium'>
                      {t(`app.${row.feature}`)}
                    </td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>
                      {row.free.startsWith('pricing.') ? t(`app.${row.free}`) : row.free}
                    </td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>
                      {row.standard.startsWith('pricing.')
                        ? t(`app.${row.standard}`)
                        : row.standard}
                    </td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>
                      {row.professional.startsWith('pricing.')
                        ? t(`app.${row.professional}`)
                        : row.professional}
                    </td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>
                      {row.enterprise.startsWith('pricing.')
                        ? t(`app.${row.enterprise}`)
                        : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 部分 - 参考 Nano Banana AI 的专业设计 */}
        <div className='mt-20'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 rounded-full text-sm text-[var(--accent-secondary)] mb-6'>
              <span>❓</span>
              Frequently Asked Questions
            </div>
            <h2 className='text-4xl font-bold text-[var(--text-primary)] mb-4'>
              {t('app.pricing.faq.title')}
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto'>
              解答您关于定价和服务的常见问题
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 hover:shadow-xl'>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-4'>
                {t('app.pricing.faq.q1')}
              </h3>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                {t('app.pricing.faq.a1')}
              </p>
            </div>
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 hover:shadow-xl'>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-4'>
                {t('app.pricing.faq.q2')}
              </h3>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                {t('app.pricing.faq.a2')}
              </p>
            </div>
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 hover:shadow-xl'>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-4'>
                {t('app.pricing.faq.q3')}
              </h3>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                {t('app.pricing.faq.a3')}
              </p>
            </div>
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 hover:shadow-xl'>
              <h3 className='text-xl font-bold text-[var(--text-primary)] mb-4'>
                {t('app.pricing.faq.q4')}
              </h3>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                {t('app.pricing.faq.a4')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 支付模态框 */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={handleClosePaymentModal}
        planId={paymentModal.planId}
        billingCycle={paymentModal.billingCycle}
        price={paymentModal.price}
        planName={paymentModal.planName}
      />
    </div>
  )
}
