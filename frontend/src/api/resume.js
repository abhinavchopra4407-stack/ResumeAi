import api from './axios';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

export const getResumeDetails = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}`);
  return response.data;
};

export const analyzeResume = async (resumeId, jobDescription) => {
  const response = await api.post(`/resumes/${resumeId}/analyze`, {
    job_description: jobDescription,
  });
  return response.data;
};

export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/resumes/${resumeId}`);
  return response.data;
};

// Tool APIs
export const generateCoverLetter = async (resumeId, jobDescription) => {
  const response = await api.post('/tools/cover-letter', {
    resume_id: resumeId,
    job_description: jobDescription,
  });
  return response.data;
};

export const generateInterviewPrep = async (resumeId, jobDescription) => {
  const response = await api.post('/tools/interview-prep', {
    resume_id: resumeId,
    job_description: jobDescription,
  });
  return response.data;
};

export const generateRoadmap = async (resumeId, targetRole) => {
  const response = await api.post('/tools/roadmap', {
    resume_id: resumeId,
    target_role: targetRole,
  });
  return response.data;
};

export const rewriteResumeSection = async (resumeId, sectionText, tone) => {
  const response = await api.post('/tools/rewrite', {
    resume_id: resumeId,
    section_text: sectionText,
    tone,
  });
  return response.data;
};
