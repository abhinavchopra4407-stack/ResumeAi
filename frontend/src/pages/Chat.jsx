import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import ChatInterface from '../components/chat/ChatInterface';
import { useChat } from '../hooks/useChat';
import { useResume } from '../hooks/useResume';
import Loader from '../components/common/Loader';
import { MessageSquare, Plus, Bot } from 'lucide-react';
import Card from '../components/common/Card';

export const Chat = () => {
  const {
    chats,
    currentChat,
    loading,
    messageSending,
    fetchChats,
    fetchChatDetails,
    startNewChat,
    sendMessage
  } = useChat();

  const { resumes, fetchResumes } = useResume();
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  useEffect(() => {
    fetchChats();
    fetchResumes();
  }, [fetchChats, fetchResumes]);

  // Load details of the first chat if nothing is active
  useEffect(() => {
    if (chats.length > 0 && !currentChat && !loading) {
      fetchChatDetails(chats[0].id);
    }
  }, [chats, currentChat, loading, fetchChatDetails]);

  // Auto attach first resume as context default if available
  useEffect(() => {
    if (resumes.length > 0 && selectedResumeId === null) {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes, selectedResumeId]);

  const handleStartNewChat = async () => {
    try {
      const newChat = await startNewChat("New Chat");
      fetchChatDetails(newChat.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (text, resumeId) => {
    if (!currentChat) return;
    try {
      await sendMessage(currentChat.id, text, resumeId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        {/* Chat History Panel */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/20 p-4 flex flex-col space-y-4 md:h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <MessageSquare className="h-4 w-4 text-violet-400" />
              <span>Chat Threads</span>
            </h4>
            <button
              onClick={handleStartNewChat}
              className="p-1 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/30 rounded text-slate-400 hover:text-white transition duration-150"
              title="Start New Thread"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {chats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <p className="text-xs text-slate-500 font-medium">No active chat sessions.</p>
              <button
                onClick={handleStartNewChat}
                className="text-xs text-violet-400 hover:underline mt-2 font-bold"
              >
                Create session
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-row md:flex-col md:space-y-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
              {chats.map((chat) => {
                const isActive = currentChat?.id === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => fetchChatDetails(chat.id)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold truncate transition-all duration-150 whitespace-nowrap md:whitespace-normal md:w-full border ${
                      isActive
                        ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                        : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/40'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window Panel */}
        <div className="flex-1 p-6 md:p-8 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
          {currentChat ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <ChatInterface
                messages={currentChat.messages}
                resumes={resumes}
                selectedResumeId={selectedResumeId}
                onSelectResume={setSelectedResumeId}
                onSendMessage={handleSendMessage}
                isLoading={loading}
                isSending={messageSending}
              />
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                <Bot className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-white">AI Assistant Console</h4>
              <p className="text-xs text-slate-500 mt-1">Select an active thread or start a new conversation to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
