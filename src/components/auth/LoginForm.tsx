import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            邮箱地址
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-3 bg-[var(--bg-error)] border border-[var(--border-error)] rounded-lg">
            <p className="text-sm text-[var(--text-error)]">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--text-on-accent)] font-semibold rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          还没有账户？{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium"
          >
            立即注册
          </button>
        </p>
      </div>
    </div>
  );
};