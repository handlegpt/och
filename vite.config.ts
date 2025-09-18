import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // 加载所有环境变量，包括不以 VITE_ 开头的
    const env = loadEnv(mode, process.cwd(), '');
    
    
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
        'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
        'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // 将 React 相关库分离
              'react-vendor': ['react', 'react-dom'],
              // 将 Supabase 相关库分离
              'supabase-vendor': ['@supabase/supabase-js'],
              // 将 Google AI 相关库分离
              'google-ai-vendor': ['@google/genai']
            }
          }
        },
        // 增加 chunk 大小警告限制
        chunkSizeWarningLimit: 1000
      },
      server: {
        host: '0.0.0.0',
        allowedHosts: true,
        hmr: {
          clientPort: 4173
        }
      },
      preview: {
        host: '0.0.0.0',
        port: 4173, // Vite preview 默认端口
        allowedHosts: true,
        strictPort: false
      }
    };
});
