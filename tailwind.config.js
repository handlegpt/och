/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "./**/*.html",
  ],
  theme: {
    extend: {
      // 移除 colors 配置，让 Tailwind 使用任意值语法
      // 这样 bg-[var(--bg-primary)] 就能正常工作
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}