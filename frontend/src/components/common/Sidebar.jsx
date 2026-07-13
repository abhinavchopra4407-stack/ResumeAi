import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSearch, MessageSquare, User, FileText } from 'lucide-react';

export const Sidebar = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Resume', icon: FileSearch },
    { to: '/chat', label: 'AI Assistant', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/40 backdrop-blur-md p-4">
      <nav className="flex flex-row md:flex-col md:space-y-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="hidden md:block mt-8 pt-6 border-t border-white/5">
        <h4 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Core Resources
        </h4>
        <div className="space-y-1">
          <a
            href="https://resume.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <FileText className="h-4 w-4" />
            <span>Templates Library</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
