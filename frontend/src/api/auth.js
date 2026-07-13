import api from './axios';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signupUser = async (email, password, fullName) => {
  const response = await api.post('/auth/signup', { email, password, full_name: fullName });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
