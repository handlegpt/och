import React, { Suspense, ComponentType } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LazyRouteProps {
  fallback?: React.ReactNode;
  delay?: number;
}

// 带延迟的懒加载组件
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  delay: number = 200
) => {
  return React.lazy(() => {
    return new Promise<{ default: ComponentType<P> }>((resolve) => {
      setTimeout(() => {
        resolve(importFunc());
      }, delay);
    });
  });
};

// 懒加载路由组件
export const LazyRoute: React.FC<LazyRouteProps & { children: React.ReactNode }> = ({
  children,
  fallback,
  delay = 200
}) => {
  const [showFallback, setShowFallback] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-[var(--text-secondary)] mt-4">加载中...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {showFallback ? (fallback || defaultFallback) : children}
    </Suspense>
  );
};

// 预加载组件
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return () => {
    importFunc();
    return null;
  };
};

// 懒加载的页面组件
export const LazyHomePage = withLazyLoading(() => import('../HomePage').then(module => ({ default: module.HomePage })));
export const LazyProfilePage = withLazyLoading(() => import('../../pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
export const LazyGenerationWorkflow = withLazyLoading(() => import('../GenerationWorkflow').then(module => ({ default: module.GenerationWorkflow })));

// 懒加载的用户组件
export const LazyUserHistory = withLazyLoading(() => import('../user/UserHistory').then(module => ({ default: module.UserHistory })));
export const LazyUserSettings = withLazyLoading(() => import('../user/UserSettings').then(module => ({ default: module.UserSettings })));
export const LazyFavoritesManager = withLazyLoading(() => import('../user/FavoritesManager').then(module => ({ default: module.FavoritesManager })));
export const LazyDashboardLayout = withLazyLoading(() => import('../user/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
export const LazyPrivacyControls = withLazyLoading(() => import('../user/PrivacyControls').then(module => ({ default: module.PrivacyControls })));

// 懒加载的管理员组件
export const LazyAdminPanel = withLazyLoading(() => import('../admin/AdminPanel').then(module => ({ default: module.AdminPanel })));

// 懒加载的认证组件
export const LazyAuthModal = withLazyLoading(() => import('../auth/AuthModal').then(module => ({ default: module.AuthModal })));
export const LazyLoginPromptModal = withLazyLoading(() => import('../LoginPromptModal').then(module => ({ default: module.LoginPromptModal })));
export const LazyMagicLinkModal = withLazyLoading(() => import('../MagicLinkModal').then(module => ({ default: module.MagicLinkModal })));

// 懒加载的UI组件 - 注释掉不存在的组件
// export const LazyImagePreviewModal = withLazyLoading(() => import('../ImagePreviewModal'));

// 组件预加载器
export const ComponentPreloader: React.FC = () => {
  React.useEffect(() => {
    // 预加载常用组件
    const preloadComponents = [
      () => import('../HomePage'),
      () => import('../../pages/ProfilePage'),
      () => import('../GenerationWorkflow'),
      () => import('../user/UserHistory'),
      () => import('../user/UserSettings'),
      () => import('../auth/AuthModal')
    ];

    // 延迟预加载，避免影响初始加载
    const timer = setTimeout(() => {
      preloadComponents.forEach(preload => {
        preload().catch(console.error);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

// 懒加载包装器
export const LazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}> = ({ children, fallback, delay = 200 }) => {
  return (
    <LazyRoute fallback={fallback} delay={delay}>
      {children}
    </LazyRoute>
  );
};
