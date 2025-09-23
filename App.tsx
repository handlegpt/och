import React from 'react'
// import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './src/components/ErrorBoundary'
// import { Navigation } from './src/components/Navigation'
// import { BottomNavigation } from './src/components/BottomNavigation'
// import { AuthCallback } from './src/components/auth/AuthCallback'
// import { UsageLimitAlert } from './src/components/UsageLimitAlert'
// import { SimpleAuthProvider } from './src/components/auth/SimpleAuthProvider'
// import { LanguageProvider } from './i18n/context'
// import { ThemeProvider } from './theme/context'
// import {
//   LazyHomePage,
//   LazyProfilePage,
//   LazySocialPage,
//   LazyPricingPage,
// } from './src/components/LazyWrapper'

// 同步导入的轻量级页面
// import { CategoriesPage } from './src/pages/CategoriesPage'
// import { PrivacyPage } from './src/pages/PrivacyPage'
// import { SettingsPage } from './src/pages/SettingsPage'
// import { MorePage } from './src/pages/MorePage'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-100 text-gray-900 font-sans'>
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-4'>Och AI - Minimal Test</h1>
          <p className='text-lg mb-4'>This is a minimal version to test for React error #185.</p>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-2'>Status</h2>
            <p>✅ ErrorBoundary - Working</p>
            <p>✅ Basic React - Working</p>
            <p>✅ Tailwind CSS - Working</p>
            <p>❌ Complex Providers - Disabled</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

// Add fade-in animation for view transitions
const style = document.createElement('style')
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  @keyframes fadeInFast {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in-fast {
    animation: fadeInFast 0.2s ease-out forwards;
  }
`
document.head.appendChild(style)

export default App
