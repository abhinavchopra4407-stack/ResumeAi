import React from 'react';
import { Sparkles, User } from 'lucide-react';

export const Message = ({ sender, text, timestamp }) => {
  const isAI = sender === 'ai';

  return (
    <div className={`flex items-start space-x-3.5 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20 mt-1 flex-shrink-0">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] rounded-2xl p-4 border text-sm leading-relaxed ${
        isAI
          ? 'bg-slate-900/60 border-slate-800/80 text-slate-200'
          : 'bg-violet-600 border-violet-500 text-white font-medium rounded-tr-none'
      }`}>
        <p className="whitespace-pre-wrap select-text">{text}</p>
        
        {timestamp && (
          <span className={`block text-[10px] mt-2 ${isAI ? 'text-slate-500' : 'text-violet-200'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {!isAI && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 mt-1 flex-shrink-0">
          <User className="h-4 w-4 text-violet-400" />
        </div>
      )}
    </div>
  );
};

export default Message;
