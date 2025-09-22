/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // 定义CSS变量颜色，确保与index.html中的变量一致
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'bg-card-alpha': 'var(--bg-card-alpha)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border-primary': 'var(--border-primary)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-primary-hover': 'var(--accent-primary-hover)',
        'accent-secondary-hover': 'var(--accent-secondary-hover)',
        'text-on-accent': 'var(--text-on-accent)',
        'bg-disabled': 'var(--bg-disabled)',
        'text-disabled': 'var(--text-disabled)',
        'bg-error': 'var(--bg-error)',
        'border-error': 'var(--border-error)',
        'text-error': 'var(--text-error)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
