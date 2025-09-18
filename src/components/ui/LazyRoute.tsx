import React, { Suspense, lazy, ComponentType } from 'react';
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
export const LazyHomePage = withLazyLoading(() => import('../HomePage'));
export const LazyProfilePage = withLazyLoading(() => import('../../pages/ProfilePage'));
export const LazyGenerationWorkflow = withLazyLoading(() => import('../GenerationWorkflow'));

// 懒加载的用户组件
export const LazyUserHistory = withLazyLoading(() => import('../user/UserHistory'));
export const LazyUserSettings = withLazyLoading(() => import('../user/UserSettings'));
export const LazyFavoritesManager = withLazyLoading(() => import('../user/FavoritesManager'));
export const LazyDashboardLayout = withLazyLoading(() => import('../user/DashboardLayout'));
export const LazyPrivacyControls = withLazyLoading(() => import('../user/PrivacyControls'));

// 懒加载的管理员组件
export const LazyAdminPanel = withLazyLoading(() => import('../admin/AdminPanel'));

// 懒加载的认证组件
export const LazyAuthModal = withLazyLoading(() => import('../auth/AuthModal'));
export const LazyLoginPromptModal = withLazyLoading(() => import('../LoginPromptModal'));
export const LazyMagicLinkModal = withLazyLoading(() => import('../MagicLinkModal'));

// 懒加载的UI组件
export const LazyImagePreviewModal = withLazyLoading(() => import('../ImagePreviewModal'));

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
