import { useState, useCallback } from 'react';
import * as chatApi from '../api/chat';

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatApi.getChats();
      setChats(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChatDetails = useCallback(async (chatId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatApi.getChatDetails(chatId);
      setCurrentChat(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const startNewChat = useCallback(async (title = 'New Chat') => {
    setLoading(true);
    setError(null);
    try {
      const newChat = await chatApi.createChat(title);
      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
      return newChat;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create new chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId, text, resumeId = null) => {
    setMessageSending(true);
    setError(null);
    
    // Optimistic Update: Add user message to UI immediately
    const userMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setCurrentChat((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...(prev.messages || []), userMsg]
      };
    });

    try {
      const aiResponse = await chatApi.sendChatMessage(chatId, text, resumeId);
      
      // Update with the final AI message from server
      setCurrentChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), aiResponse]
        };
      });

      // Refresh list to update titles if it was the first message
      chatApi.getChats().then(data => setChats(data));
      
      return aiResponse;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message');
      throw err;
    } finally {
      setMessageSending(false);
    }
  }, []);

  return {
    chats,
    currentChat,
    loading,
    messageSending,
    error,
    fetchChats,
    fetchChatDetails,
    startNewChat,
    sendMessage,
    setCurrentChat
  };
};
export default useChat;
