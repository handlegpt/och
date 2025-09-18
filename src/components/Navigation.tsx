import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/context';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { UserInfo } from './UserInfo';
import { useGenerationState } from '../hooks/useGenerationState';

export const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [, actions] = useGenerationState();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoClick = () => {
    // 重置所有状态
    actions.setSelectedTransformation(null);
    actions.clearPrimaryImage();
    actions.clearSecondaryImage();
    actions.setGeneratedContent(null);
    actions.setError(null);
    actions.setIsLoading(false);
    actions.setMaskData(null);
    actions.setCustomPrompt('');
    actions.setActiveTool('none');
    actions.setActiveCategory(null);
    
    // 导航到首页
    navigate('/');
  };

  return (
    <header className="bg-[var(--bg-card-alpha)] backdrop-blur-lg sticky top-0 z-20 p-4 border-b border-[var(--border-primary)]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] transition-all duration-200 cursor-pointer"
        >
          {t('app.title')}
        </button>

        {/* 主导航 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/')
                ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            🏠 {t('nav.home')}
          </Link>
          
          <Link
            to="/profile"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/profile')
                ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            👤 {t('nav.profile')}
          </Link>
        </nav>

        {/* 右侧工具 */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <UserInfo />
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="md:hidden mt-4 pt-4 border-t border-[var(--border-primary)]">
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/')
                ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            🏠 {t('nav.home')}
          </Link>
          
          <Link
            to="/profile"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/profile')
                ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            👤 {t('nav.profile')}
          </Link>
        </nav>
      </div>
    </header>
  );
};
