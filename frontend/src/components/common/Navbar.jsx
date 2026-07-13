import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Resume<span className="text-gradient">IQ</span>
          </span>
        </Link>

        {/* User profile dropdown / login buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                  <UserIcon className="h-4 w-4 text-violet-400" />
                </div>
                <span className="hidden md:inline font-medium">{user.full_name || user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition duration-150"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-medium text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 px-4 py-2 hover:from-violet-500 hover:to-indigo-500 transition duration-150"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
