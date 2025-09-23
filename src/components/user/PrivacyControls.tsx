import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '../../../i18n/context'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends'
  show_generation_history: boolean
  allow_data_collection: boolean
  show_activity_status: boolean
  allow_direct_messages: boolean
  content_sharing_permission: 'public' | 'private' | 'friends'
  data_retention_days: number
  allow_analytics: boolean
}

export const PrivacyControls: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'private',
    show_generation_history: false,
    allow_data_collection: false,
    show_activity_status: false,
    allow_direct_messages: false,
    content_sharing_permission: 'private',
    data_retention_days: 365,
    allow_analytics: false,
  })
  const [loading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 获取隐私设置

  // 保存隐私设置
  const savePrivacySettings = useCallback(async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.from('user_privacy_settings').upsert({
        user_id: user.id,
        settings,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: 'success', text: '隐私设置已保存' })
    } catch (err) {
      console.error('Error saving privacy settings:', err)
      setMessage({ type: 'error', text: '保存隐私设置失败' })
    } finally {
      setSaving(false)
    }
  }, [user, settings])

  // 重置为默认设置
  const resetToDefaults = useCallback(() => {
    setSettings({
      profile_visibility: 'private',
      show_generation_history: false,
      allow_data_collection: false,
      show_activity_status: false,
      allow_direct_messages: false,
      content_sharing_permission: 'private',
      data_retention_days: 365,
      allow_analytics: false,
    })
  }, [])

  // 导出数据
  const exportData = useCallback(async () => {
    if (!user) return

    try {
      const { data: userData, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const exportData = {
        user_id: user.id,
        export_date: new Date().toISOString(),
        generation_history: userData || [],
        privacy_settings: settings,
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `och-ai-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage({ type: 'success', text: '数据导出成功' })
    } catch (err) {
      console.error('Error exporting data:', err)
      setMessage({ type: 'error', text: '数据导出失败' })
    }
  }, [user, settings])

  // 删除所有数据
  const deleteAllData = useCallback(async () => {
    if (!user) return

    const confirmed = window.confirm(
      '警告：此操作将永久删除您的所有数据，包括生成历史、收藏等。此操作不可撤销。确定要继续吗？'
    )

    if (!confirmed) return

    try {
      // 删除AI生成记录（使用正确的表名）
      await supabase.from('ai_generations').delete().eq('user_id', user.id)

      // 删除使用统计
      await supabase.from('usage_stats').delete().eq('user_id', user.id)

      // 删除收藏（如果表存在）
      try {
        await supabase.from('user_favorites').delete().eq('user_id', user.id)
      } catch (err) {
        console.warn('user_favorites table may not exist:', err)
      }

      // 删除隐私设置
      await supabase.from('user_privacy_settings').delete().eq('user_id', user.id)

      setMessage({ type: 'success', text: '所有数据已删除，页面将刷新以更新显示' })

      // 延迟刷新页面，让用户看到成功消息
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.error('Error deleting data:', err)
      setMessage({ type: 'error', text: '删除数据失败' })
    }
  }, [user])

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('user_privacy_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching privacy settings:', error)
          return
        }

        if (data) {
          setSettings(data)
        } else {
          // 如果没有设置，使用默认值
          setSettings({
            profile_visibility: 'private',
            show_generation_history: false,
            show_online_status: true,
            allow_direct_messages: true,
            allow_data_collection: true,
            allow_analytics_tracking: true,
            data_retention_days: 365,
          })
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error)
      }
    }

    fetchPrivacySettings()
  }, [])

  const handleSettingChange = useCallback((key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 消息提示 */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 个人资料可见性 */}
      <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
          🔒 {t('common.profileVisibility')}
        </h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
              {t('common.profileVisibility')}
            </label>
            <select
              value={settings.profile_visibility}
              onChange={e => handleSettingChange('profile_visibility', e.target.value)}
              className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
            >
              <option value='public'>公开 - 所有人都可以看到</option>
              <option value='friends'>仅好友 - 只有好友可以看到</option>
              <option value='private'>私密 - 只有自己可以看到</option>
            </select>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <label className='text-sm font-medium text-[var(--text-primary)]'>
                {t('common.showGenerationHistory')}
              </label>
              <p className='text-xs text-[var(--text-secondary)]'>
                {t('common.allowOthersViewHistory')}
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.show_generation_history}
                onChange={e => handleSettingChange('show_generation_history', e.target.checked)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <label className='text-sm font-medium text-[var(--text-primary)]'>
                {t('common.showOnlineStatus')}
              </label>
              <p className='text-xs text-[var(--text-secondary)]'>{t('common.showOnlineStatus')}</p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.show_activity_status}
                onChange={e => handleSettingChange('show_activity_status', e.target.checked)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 内容分享权限 */}
      <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
          📤 {t('common.contentSharingPermissions')}
        </h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
              {t('common.contentSharingPermissions')}
            </label>
            <select
              value={settings.content_sharing_permission}
              onChange={e => handleSettingChange('content_sharing_permission', e.target.value)}
              className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
            >
              <option value='public'>公开 - 所有人都可以分享</option>
              <option value='friends'>仅好友 - 只有好友可以分享</option>
              <option value='private'>私密 - 只有自己可以分享</option>
            </select>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <label className='text-sm font-medium text-[var(--text-primary)]'>
                {t('common.allowDirectMessages')}
              </label>
              <p className='text-xs text-[var(--text-secondary)]'>
                {t('common.allowOthersSendMessages')}
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.allow_direct_messages}
                onChange={e => handleSettingChange('allow_direct_messages', e.target.checked)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 数据收集和分析 */}
      <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
          📊 {t('common.dataCollectionAndAnalysis')}
        </h3>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <label className='text-sm font-medium text-[var(--text-primary)]'>
                {t('common.allowDataCollection')}
              </label>
              <p className='text-xs text-[var(--text-secondary)]'>
                {t('common.allowUsCollectData')}
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.allow_data_collection}
                onChange={e => handleSettingChange('allow_data_collection', e.target.checked)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <label className='text-sm font-medium text-[var(--text-primary)]'>
                {t('common.allowAnalyticsTracking')}
              </label>
              <p className='text-xs text-[var(--text-secondary)]'>
                {t('common.allowUsAnalyzeBehavior')}
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.allow_analytics}
                onChange={e => handleSettingChange('allow_analytics', e.target.checked)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
              {t('common.dataRetentionPeriod')}
            </label>
            <input
              type='number'
              min='1'
              max='3650'
              value={settings.data_retention_days}
              onChange={e => handleSettingChange('data_retention_days', parseInt(e.target.value))}
              className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
            />
            <p className='text-xs text-[var(--text-secondary)] mt-1'>
              {t('common.dataWillBeDeleted')}
            </p>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className='bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
          💾 {t('common.dataManagement')}
        </h3>
        <div className='space-y-4'>
          <div className='flex space-x-4'>
            <button
              onClick={exportData}
              className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200'
            >
              📥 {t('common.exportData')}
            </button>
            <button
              onClick={resetToDefaults}
              className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors duration-200'
            >
              🔄 {t('common.resetToDefault')}
            </button>
            <button
              onClick={deleteAllData}
              className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200'
            >
              🗑️ {t('common.deleteAllData')}
            </button>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className='flex justify-end'>
        <button
          onClick={savePrivacySettings}
          disabled={saving}
          className='px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  )
}
