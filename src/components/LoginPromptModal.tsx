import React from 'react';
import { useTranslation } from '../../i18n/context';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => void;
  onMagicLinkLogin: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  onGoogleLogin,
  onMagicLinkLogin
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框 */}
      <div className="relative bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] shadow-2xl p-6 mx-4 max-w-md w-full">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[var(--text-secondary)] hover:bg-[rgba(107,114,128,0.2)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* 内容 */}
        <div className="text-center">
          {/* 图标 */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-primary)] bg-opacity-20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {t('app.loginPrompt.title') || '需要登录'}
          </h3>

          {/* 描述 */}
          <p className="text-[var(--text-secondary)] mb-6">
            {t('app.loginRequired') || '请先登录以使用此功能'}
          </p>

          {/* 登录选项 */}
          <div className="space-y-4">
            {/* Google登录 */}
            <button
              onClick={onGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {t('app.loginOptions.google') || '使用 Google 登录'}
              </span>
            </button>

            {/* Magic Link登录 */}
            <button
              onClick={onMagicLinkLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] transition-all duration-200 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {t('app.loginOptions.magicLink') || '使用 Magic Link 登录'}
              </span>
            </button>

            {/* 取消按钮 */}
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] bg-[rgba(107,114,128,0.1)] rounded-lg hover:bg-[rgba(107,114,128,0.2)] transition-colors duration-200"
            >
              {t('app.loginPrompt.cancel') || '取消'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};