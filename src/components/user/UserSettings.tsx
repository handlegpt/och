import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
// import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../../i18n/context'
import { DataPersistenceService } from '../../services/dataPersistence'
import { SecureInput } from '../SecureInput'
import { validateDisplayName, validateUsername, validateUrl } from '../../utils/security'

interface UserSettingsData {
  display_name: string
  username: string
  avatar_url: string
  language: string
  theme: string
  notifications: boolean
}

export const UserSettings: React.FC = () => {
  const { user, userProfile } = useAuth()
  const { t } = useTranslation()
  const [settings, setSettings] = useState<UserSettingsData>({
    display_name: '',
    username: '',
    avatar_url: '',
    language: 'zh',
    theme: 'dark',
    notifications: true,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'export'>('profile')

  useEffect(() => {
    if (userProfile) {
      setSettings({
        display_name: userProfile.display_name || '',
        username: userProfile.username || '',
        avatar_url: userProfile.avatar_url || '',
        language: localStorage.getItem('language') || 'zh',
        theme: localStorage.getItem('theme') || 'dark',
        notifications: true,
      })
    }
  }, [userProfile])

  const handleSave = async () => {
    if (!user) return

    // 验证所有输入
    const displayNameValidation = validateDisplayName(settings.display_name)
    const usernameValidation = validateUsername(settings.username)
    const avatarUrlValidation = settings.avatar_url
      ? validateUrl(settings.avatar_url)
      : { isValid: true }

    if (!displayNameValidation.isValid) {
      setError(displayNameValidation.error || '显示名称验证失败')
      return
    }

    if (!usernameValidation.isValid) {
      setError(usernameValidation.error || '用户名验证失败')
      return
    }

    if (!avatarUrlValidation.isValid) {
      setError(avatarUrlValidation.error || '头像URL验证失败')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 使用数据持久化服务保存设置
      const success = await DataPersistenceService.saveUserSettings(user.id, {
        display_name: displayNameValidation.sanitizedValue || settings.display_name,
        username: usernameValidation.sanitizedValue || settings.username,
        avatar_url: avatarUrlValidation.sanitizedValue || settings.avatar_url,
        language: settings.language,
        theme: settings.theme,
        notifications: settings.notifications,
      })

      if (success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('保存设置失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 数据导出功能
  const handleExportHistory = async () => {
    if (!user) return

    try {
      const history = await DataPersistenceService.getUserGenerationHistory(user.id, 1000, 0)
      const dataStr = JSON.stringify(history, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `och-ai-history-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting history:', error)
    }
  }

  const handleExportSettings = async () => {
    if (!user) return

    try {
      const userSettings = await DataPersistenceService.getUserSettings(user.id)
      const dataStr = JSON.stringify(userSettings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `och-ai-settings-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting settings:', error)
    }
  }

  const handleExportAll = async () => {
    if (!user) return

    try {
      const [history, userSettings, usageStats] = await Promise.all([
        DataPersistenceService.getUserGenerationHistory(user.id, 1000, 0),
        DataPersistenceService.getUserSettings(user.id),
        DataPersistenceService.getUserUsageStats(user.id),
      ])

      const allData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        settings: userSettings,
        history: history,
        stats: usageStats,
        export_date: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(allData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `och-ai-complete-data-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting all data:', error)
    }
  }

  // 数据导入功能
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string)
        console.log('Imported data:', data)
        // 这里可以添加导入逻辑
      } catch (error) {
        console.error('Error parsing imported file:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleImportSettings = () => {
    // 实现设置导入逻辑
    console.log('Import settings functionality')
  }

  if (!user) {
    return (
      <div className='p-6 text-center'>
        <p className='text-[var(--text-secondary)]'>{t('app.userSettings.pleaseLogin')}</p>
      </div>
    )
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold text-[var(--accent-primary)] mb-6'>
        {t('app.userSettings.title')}
      </h2>

      {/* 标签页导航 */}
      <div className='flex border-b border-[var(--border-primary)] mb-6'>
        {[
          { key: 'profile', label: t('app.userSettings.tabs.profile'), icon: '👤' },
          { key: 'account', label: t('app.userSettings.tabs.account'), icon: '🔐' },
          { key: 'export', label: t('app.userSettings.tabs.export'), icon: '📤' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className='mr-2'>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className='space-y-6'>
        {/* 个人资料标签页 */}
        {activeTab === 'profile' && (
          <>
            {/* 基本信息 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.userSettings.basicInfo')}
              </h3>

              <div className='space-y-4'>
                <SecureInput
                  type='displayName'
                  value={settings.display_name}
                  onChange={value => setSettings({ ...settings, display_name: value })}
                  label={t('app.userSettings.displayName')}
                  placeholder={t('app.userSettings.placeholders.displayName')}
                />

                <SecureInput
                  type='username'
                  value={settings.username}
                  onChange={value => setSettings({ ...settings, username: value })}
                  label={t('app.userSettings.username')}
                  placeholder={t('app.userSettings.placeholders.username')}
                />

                <SecureInput
                  type='url'
                  value={settings.avatar_url}
                  onChange={value => setSettings({ ...settings, avatar_url: value })}
                  label={t('app.userSettings.avatarUrl')}
                  placeholder={t('app.userSettings.placeholders.avatarUrl')}
                />
              </div>
            </div>

            {/* 偏好设置 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.userSettings.preferences')}
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-[var(--text-primary)] mb-1'>
                    {t('app.userSettings.language')}
                  </label>
                  <select
                    value={settings.language}
                    onChange={e => setSettings({ ...settings, language: e.target.value })}
                    className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--text-primary)]'
                  >
                    <option value='zh'>中文</option>
                    <option value='en'>English</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-[var(--text-primary)] mb-1'>
                    {t('app.userSettings.theme')}
                  </label>
                  <select
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value })}
                    className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--text-primary)]'
                  >
                    <option value='dark'>深色模式</option>
                    <option value='light'>浅色模式</option>
                  </select>
                </div>

                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-[var(--text-primary)]'>
                    {t('app.userSettings.notifications')}
                  </label>
                  <input
                    type='checkbox'
                    checked={settings.notifications}
                    onChange={e => setSettings({ ...settings, notifications: e.target.checked })}
                    className='w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]'
                  />
                </div>
              </div>
            </div>

            {/* 错误显示 */}
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='font-medium'>保存失败</span>
                </div>
                <p className='text-sm text-red-500 dark:text-red-300 mt-1'>{error}</p>
              </div>
            )}

            {/* 保存按钮 */}
            <div className='flex justify-end'>
              <button
                onClick={handleSave}
                disabled={loading}
                className='px-6 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--text-on-accent)] font-semibold rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
              >
                {loading
                  ? t('app.userSettings.saving')
                  : saved
                    ? t('app.userSettings.saved')
                    : t('app.userSettings.save')}
              </button>
            </div>
          </>
        )}

        {/* 账户管理标签页 */}
        {activeTab === 'account' && (
          <div className='space-y-6'>
            {/* 账户信息 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.userSettings.account.title')}
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-[var(--text-secondary)]'>
                    {t('app.userSettings.account.email')}
                  </span>
                  <span className='text-[var(--text-primary)] font-medium'>{user?.email}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[var(--text-secondary)]'>
                    {t('app.userSettings.account.registrationDate')}
                  </span>
                  <span className='text-[var(--text-primary)] font-medium'>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('zh-CN')
                      : '未知'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[var(--text-secondary)]'>
                    {t('app.userSettings.account.subscriptionStatus')}
                  </span>
                  <span className='text-[var(--accent-primary)] font-medium'>
                    {userProfile?.subscription_tier || 'free'}
                  </span>
                </div>
              </div>
            </div>

            {/* 安全设置 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.userSettings.security.title')}
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <div className='text-[var(--text-primary)] font-medium'>
                      {t('app.userSettings.security.loginMethod')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>
                      Google OAuth / Magic Link
                    </div>
                  </div>
                  <span className='text-green-500 text-sm'>已启用</span>
                </div>

                <div className='flex justify-between items-center'>
                  <div>
                    <div className='text-[var(--text-primary)] font-medium'>
                      {t('app.userSettings.security.twoFactorAuth')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>增强账户安全性</div>
                  </div>
                  <button className='px-3 py-1 text-xs bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)] rounded-md hover:bg-opacity-30 transition-colors'>
                    启用
                  </button>
                </div>
              </div>
            </div>

            {/* 危险操作 */}
            <div className='bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6'>
              <h3 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-4'>
                {t('app.userSettings.security.dangerZone')}
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <div>
                    <div className='text-red-600 dark:text-red-400 font-medium'>
                      {t('app.userSettings.security.deleteAccount')}
                    </div>
                    <div className='text-sm text-red-500 dark:text-red-300'>
                      {t('app.userSettings.security.deleteAccountDesc')}
                    </div>
                  </div>
                  <button className='px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'>
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 数据导出标签页 */}
        {activeTab === 'export' && (
          <div className='space-y-6'>
            {/* 导出选项 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.userSettings.export.title')}
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <div className='text-[var(--text-primary)] font-medium'>
                      {t('app.userSettings.export.generationHistory')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>
                      导出所有生成记录为 JSON 格式
                    </div>
                  </div>
                  <button
                    onClick={handleExportHistory}
                    className='px-4 py-2 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'
                  >
                    导出
                  </button>
                </div>

                <div className='flex justify-between items-center'>
                  <div>
                    <div className='text-[var(--text-primary)] font-medium'>
                      {t('app.userSettings.export.userSettings')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>导出个人设置和偏好</div>
                  </div>
                  <button
                    onClick={handleExportSettings}
                    className='px-4 py-2 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'
                  >
                    导出
                  </button>
                </div>

                <div className='flex justify-between items-center'>
                  <div>
                    <div className='text-[var(--text-primary)] font-medium'>
                      {t('app.userSettings.export.completeData')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>导出所有用户数据</div>
                  </div>
                  <button
                    onClick={handleExportAll}
                    className='px-4 py-2 text-sm bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] transition-colors'
                  >
                    导出全部
                  </button>
                </div>
              </div>
            </div>

            {/* 导入选项 */}
            <div className='bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
                {t('app.userSettings.export.import.title')}
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
                    {t('app.userSettings.export.import.selectFile')}
                  </label>
                  <input
                    type='file'
                    accept='.json'
                    onChange={handleImportData}
                    className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]'
                  />
                </div>
                <button
                  onClick={handleImportSettings}
                  className='w-full px-4 py-2 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors'
                >
                  {t('app.userSettings.export.import.importSettings')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
