import api from './axios';

export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const createChat = async (title = 'New Chat') => {
  const response = await api.post('/chats', { title });
  return response.data;
};

export const getChatDetails = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

export const sendChatMessage = async (chatId, message, resumeId = null) => {
  const response = await api.post(`/chats/${chatId}/message`, {
    message,
    resume_id: resumeId,
  });
  return response.data;
};
