import React, { useState } from 'react'
import { useTranslation } from '../../i18n/context'
import { PRICING_TIERS, FEATURE_COMPARISON } from '../config/pricing'

export const PricingPage: React.FC = () => {
  const { t } = useTranslation()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string>('standard')

  const handleSelectPlan = (tierId: string) => {
    setSelectedTier(tierId)
    // 这里可以添加选择计划的逻辑
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
        {/* 页面标题 */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-[var(--text-primary)] mb-4'>
            {t('pricing.title')}
          </h1>
          <p className='text-xl text-[var(--text-secondary)] mb-8'>{t('pricing.subtitle')}</p>
          {/* 调试信息 */}
          <div className='text-xs text-red-500 mb-4'>
            Debug: pricing.title = "{t('pricing.title')}" | pricing.tiers.free.name = "
            {t('pricing.tiers.free.name')}"
          </div>

          {/* 计费周期切换 */}
          <div className='flex items-center justify-center gap-4 mb-8'>
            <span
              className={`text-sm ${billingCycle === 'monthly' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
              {t('pricing.monthly')}
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
              {t('pricing.yearly')}
            </span>
            {billingCycle === 'yearly' && (
              <span className='ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                {t('pricing.save', { percent: 17 })}
              </span>
            )}
          </div>
        </div>

        {/* 定价卡片 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {PRICING_TIERS.map(tier => (
            <div
              key={tier.id}
              className={`relative bg-[var(--bg-card)] rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                tier.popular
                  ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)] ring-opacity-20'
                  : 'border-[var(--border-primary)]'
              } ${selectedTier === tier.id ? 'ring-2 ring-[var(--accent-primary)]' : ''}`}
            >
              {/* 推荐标签 */}
              {tier.popular && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <span className='bg-[var(--accent-primary)] text-white px-4 py-1 text-sm font-medium rounded-full'>
                    {t('pricing.mostPopular')}
                  </span>
                </div>
              )}

              {/* 套餐信息 */}
              <div className='text-center mb-6'>
                <h3 className='text-xl font-bold text-[var(--text-primary)] mb-2'>
                  {t(tier.name)}
                </h3>
                <p className='text-sm text-[var(--text-secondary)] mb-4'>{t(tier.description)}</p>

                {/* 价格 */}
                <div className='mb-4'>
                  {tier.price.monthly === 0 ? (
                    <div className='text-3xl font-bold text-[var(--text-primary)]'>
                      {t('pricing.free')}
                    </div>
                  ) : (
                    <div className='flex items-baseline justify-center'>
                      <span className='text-4xl font-bold text-[var(--text-primary)]'>
                        ${getPrice(tier)}
                      </span>
                      <span className='text-[var(--text-secondary)] ml-1'>
                        /{billingCycle === 'yearly' ? t('pricing.year') : t('pricing.month')}
                      </span>
                    </div>
                  )}

                  {/* 年度节省 */}
                  {billingCycle === 'yearly' && tier.price.yearly > 0 && (
                    <div className='text-sm text-green-600 mt-1'>
                      {t('pricing.saveAmount', { percent: getSavings(tier) })}
                    </div>
                  )}
                </div>

                {/* 限制信息 */}
                <div className='text-sm text-[var(--text-secondary)] mb-6'>
                  {tier.limits.dailyGenerations === -1 ? (
                    <span>{t('pricing.unlimitedGenerations')}</span>
                  ) : (
                    <span>
                      {t('pricing.dailyGenerations', { count: tier.limits.dailyGenerations })}
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
                      {t(`pricing.features.${feature}`)}
                    </span>
                  </div>
                ))}
              </div>

              {/* 选择按钮 */}
              <button
                onClick={() => handleSelectPlan(tier.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  tier.id === 'free'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-primary)]'
                    : 'bg-[var(--accent-primary)] text-white hover:opacity-90'
                }`}
              >
                {tier.id === 'free' ? t('pricing.getStarted') : t('pricing.selectPlan')}
              </button>

              {/* 企业版特殊处理 */}
              {tier.id === 'enterprise' && (
                <div className='mt-4 text-center'>
                  <button className='text-[var(--accent-primary)] text-sm hover:underline'>
                    {t('pricing.contactSales')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 功能对比表 */}
        <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden'>
          <div className='p-6 border-b border-[var(--border-primary)]'>
            <h2 className='text-2xl font-bold text-[var(--text-primary)] text-center'>
              {t('pricing.featureComparison')}
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[var(--border-primary)]'>
                  <th className='text-left p-4 text-[var(--text-primary)] font-medium'>
                    {t('pricing.features')}
                  </th>
                  {PRICING_TIERS.map(tier => (
                    <th
                      key={tier.id}
                      className='text-center p-4 text-[var(--text-primary)] font-medium'
                    >
                      {t(tier.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, index) => (
                  <tr key={index} className='border-b border-[var(--border-primary)]'>
                    <td className='p-4 text-[var(--text-primary)] font-medium'>{row.feature}</td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>{row.free}</td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>{row.standard}</td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>
                      {row.professional}
                    </td>
                    <td className='p-4 text-center text-[var(--text-secondary)]'>
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 部分 */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-[var(--text-primary)] text-center mb-8'>
            {t('pricing.faq.title')}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
                {t('pricing.faq.q1')}
              </h3>
              <p className='text-[var(--text-secondary)]'>{t('pricing.faq.a1')}</p>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
                {t('pricing.faq.q2')}
              </h3>
              <p className='text-[var(--text-secondary)]'>{t('pricing.faq.a2')}</p>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
                {t('pricing.faq.q3')}
              </h3>
              <p className='text-[var(--text-secondary)]'>{t('pricing.faq.a3')}</p>
            </div>
            <div className='bg-[var(--bg-card)] rounded-lg p-6 border border-[var(--border-primary)]'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
                {t('pricing.faq.q4')}
              </h3>
              <p className='text-[var(--text-secondary)]'>{t('pricing.faq.a4')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
