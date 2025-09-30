import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/context'
import { ThemeProvider } from './theme/context'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './src/components/auth/AuthProvider'
import { initSentry } from './src/lib/sentry'
import './index.css'

// 初始化Sentry错误监控
initSentry()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Could not find root element to mount to')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
