import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  todayGenerations: number;
  activeUsers: number;
}

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalGenerations: 0,
    todayGenerations: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin && supabase) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  const fetchAdminStats = async () => {
    if (!supabase) return;

    try {
      // 获取总用户数
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // 获取总生成数
      const { count: totalGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true });

      // 获取今日生成数
      const today = new Date().toISOString().split('T')[0];
      const { count: todayGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // 获取活跃用户数（最近7天有生成记录的用户）
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: activeUsers } = await supabase
        .from('ai_generations')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
        .not('user_id', 'is', null);

      setStats({
        totalUsers: totalUsers || 0,
        totalGenerations: totalGenerations || 0,
        todayGenerations: todayGenerations || 0,
        activeUsers: activeUsers || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">访问被拒绝</h1>
          <p className="text-[var(--text-secondary)]">您没有管理员权限访问此页面。</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="bg-[var(--bg-card-alpha)] backdrop-blur-lg border-b border-[var(--border-primary)] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--accent-primary)]">Och AI 管理后台</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-secondary)]">
              欢迎，{user?.email}
            </span>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-on-accent)] rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">总用户数</p>
                <p className="text-3xl font-bold text-[var(--accent-primary)]">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-[var(--accent-primary)] bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">总生成数</p>
                <p className="text-3xl font-bold text-[var(--accent-secondary)]">{stats.totalGenerations}</p>
              </div>
              <div className="w-12 h-12 bg-[var(--accent-secondary)] bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">今日生成</p>
                <p className="text-3xl font-bold text-green-500">{stats.todayGenerations}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">活跃用户</p>
                <p className="text-3xl font-bold text-blue-500">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent-primary)]">系统状态</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">数据库连接</span>
                <span className="text-green-500 font-medium">正常</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">认证服务</span>
                <span className="text-green-500 font-medium">正常</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">AI 生成服务</span>
                <span className="text-green-500 font-medium">正常</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] p-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent-primary)]">快速操作</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] hover:bg-opacity-80 rounded-lg transition-colors">
                查看用户列表
              </button>
              <button className="w-full text-left px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] hover:bg-opacity-80 rounded-lg transition-colors">
                生成记录管理
              </button>
              <button className="w-full text-left px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] hover:bg-opacity-80 rounded-lg transition-colors">
                系统设置
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;