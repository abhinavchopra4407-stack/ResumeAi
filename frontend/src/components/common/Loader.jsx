import React from 'react';

export const Loader = ({ fullPage = false, message = "Processing..." }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 bg-slate-950 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-violet-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return <div className="py-8 flex justify-center items-center w-full">{spinner}</div>;
};

export default Loader;
