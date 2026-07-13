import { useState, useCallback } from 'react';
import * as resumeApi from '../api/resume';

export const useResume = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resumeApi.getResumes();
      setResumes(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResumeDetails = useCallback(async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await resumeApi.getResumeDetails(resumeId);
      setSelectedResume(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch resume details');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadNewResume = useCallback(async (file) => {
    setActionLoading(true);
    setError(null);
    try {
      const newResume = await resumeApi.uploadResume(file);
      setResumes((prev) => [newResume, ...prev]);
      setSelectedResume(newResume);
      return newResume;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume. Make sure it is a valid format.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const runJobAnalysis = useCallback(async (resumeId, jobDescription) => {
    setActionLoading(true);
    setError(null);
    try {
      const analysisResult = await resumeApi.analyzeResume(resumeId, jobDescription);
      // Refresh the selected resume details to get the new analysis in history
      const updatedResume = await resumeApi.getResumeDetails(resumeId);
      setSelectedResume(updatedResume);
      return analysisResult;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to run analysis against job description');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeResume = useCallback(async (resumeId) => {
    setActionLoading(true);
    setError(null);
    try {
      await resumeApi.deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      if (selectedResume?.id === resumeId) {
        setSelectedResume(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete resume');
    } finally {
      setActionLoading(false);
    }
  }, [selectedResume]);

  return {
    resumes,
    selectedResume,
    loading,
    actionLoading,
    error,
    fetchResumes,
    fetchResumeDetails,
    uploadNewResume,
    runJobAnalysis,
    removeResume,
    setSelectedResume
  };
};
export default useResume;
