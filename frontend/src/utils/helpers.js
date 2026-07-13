export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getScoreColorClass = (score) => {
  if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
  if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
  return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
};

export const getScoreProgressColor = (score) => {
  if (score >= 80) return '#34d399'; // Emerald-400
  if (score >= 60) return '#fbbf24'; // Amber-400
  return '#f87171'; // Rose-400
};

export const saveToken = (token) => {
  localStorage.setItem('resumeiq_token', token);
};

export const getToken = () => {
  return localStorage.getItem('resumeiq_token');
};

export const removeToken = () => {
  localStorage.removeItem('resumeiq_token');
};
