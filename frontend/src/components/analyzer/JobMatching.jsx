import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const JobMatching = ({ resumeId }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    if (!resumeId) {
      toast.error('Please upload and analyze a resume first');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/resume/match-job', {
        resume_id: resumeId,
        job_description: jobDescription
      });
      setMatchResult(response.data);
      toast.success('Job matching completed!');
    } catch (error) {
      console.error('Job matching error:', error);
      toast.error(error.response?.data?.detail || 'Job matching failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Paste Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-dark-card border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 h-40"
          placeholder="Paste the job description here..."
        />
      </div>

      <button
        onClick={handleMatch}
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Matching...
          </span>
        ) : (
          'Match with Job'
        )}
      </button>

      {matchResult && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Match Percentage</span>
              <span className="text-2xl font-bold text-primary-500">
                {matchResult.match_percentage || 0}%
              </span>
            </div>
          </div>

          {matchResult.matched_keywords && matchResult.matched_keywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.matched_keywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {matchResult.missing_keywords && matchResult.missing_keywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_keywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {matchResult.recommendations && matchResult.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Recommendations</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {matchResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {matchResult.overall_assessment && (
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-300">{matchResult.overall_assessment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobMatching;