import React, { useState } from 'react';
import { Send, FileSymlink } from 'lucide-react';

export const ChatInput = ({ onSend, resumes = [], selectedResumeId, onSelectResume, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim(), selectedResumeId);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/5 bg-slate-950/40 p-4">
      <div className="flex flex-col space-y-3">
        {/* Context Resume Selector */}
        {resumes.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800/80 rounded-lg max-w-fit">
            <FileSymlink className="h-3.5 w-3.5 text-violet-400" />
            <select
              value={selectedResumeId || ''}
              onChange={(e) => onSelectResume(e.target.value ? Number(e.target.value) : null)}
              className="bg-transparent border-none text-[11px] font-semibold text-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="">No Resume Context</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id} className="bg-slate-950 text-slate-300">
                  Context: {resume.filename}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              selectedResumeId 
                ? "Ask me anything about your resume or how to target it..." 
                : "Ask me a question or select a resume context..."
            }
            disabled={disabled}
            className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition duration-150 flex-shrink-0"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
