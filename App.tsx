import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Navigation } from './src/components/Navigation';
import { HomePage } from './src/components/HomePage';
import { ProfilePage } from './src/pages/ProfilePage';
import { AuthCallback } from './src/components/auth/AuthCallback';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

// Add fade-in animation for view transitions
const style = document.createElement('style');
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
`;
document.head.appendChild(style);

export default App;