import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { Bot, HelpCircle } from 'lucide-react';

export const ChatInterface = ({
  messages = [],
  resumes = [],
  selectedResumeId,
  onSelectResume,
  onSendMessage,
  isLoading,
  isSending
}) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const suggestedPrompts = [
    "How can I improve my skills section?",
    "Give me tips for my experience bullets.",
    "What formatting errors should I avoid?"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/10 rounded-xl border border-white/5 overflow-hidden">
      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10 border border-violet-500/15 text-violet-400 mb-4 animate-bounce">
              <Bot className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Your AI Resume Coach</h4>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Select a resume context and ask questions to optimize your resume for recruiters and ATS filters.
            </p>
            
            {/* Suggestions */}
            <div className="mt-8 flex flex-col space-y-2.5 max-w-md w-full px-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center justify-center space-x-1.5 mb-1.5">
                <HelpCircle className="h-4 w-4" />
                <span>Suggested Prompts</span>
              </span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendMessage(prompt, selectedResumeId)}
                  className="px-4 py-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/30 text-slate-300 hover:text-white rounded-xl text-left text-sm transition duration-150 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message
                key={index}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
              />
            ))}
            
            {/* AI Typing Indicator */}
            {isSending && (
              <div className="flex items-start space-x-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20 mt-1 flex-shrink-0 animate-pulse">
                  <Bot className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input box */}
      <ChatInput
        onSend={onSendMessage}
        resumes={resumes}
        selectedResumeId={selectedResumeId}
        onSelectResume={onSelectResume}
        disabled={isLoading || isSending}
      />
    </div>
  );
};

export default ChatInterface;
