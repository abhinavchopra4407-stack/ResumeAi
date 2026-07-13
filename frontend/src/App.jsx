import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router';
import Navbar from './components/common/Navbar';
import { useAuth } from './hooks/useAuth';

// Separate content wrapper so we can access auth context inside
const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-violet-600/30 selection:text-violet-200">
      <AppRouter />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
