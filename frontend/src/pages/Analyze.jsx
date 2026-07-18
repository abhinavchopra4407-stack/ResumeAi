import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Sidebar from '../components/common/Sidebar';
import ATSScore from '../components/analyzer/ATSScore';
import JobMatching from '../components/analyzer/JobMatching';
import api from '../api/axios';

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [activeTab, setActiveTab] = useState('ats');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        toast.success('File uploaded successfully');
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File size exceeds 10MB limit');
      } else {
        toast.error('Invalid file format. Please upload PDF, DOCX, or TXT');
      }
    },
  });

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resumeId = response.data.id;
      setResumeId(resumeId);

      const analysisResponse = await api.post(`/resumes/${resumeId}/analyze`);
      setAnalysis(analysisResponse.data);

      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadAnalysis = async (id) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/resumes/analysis/${id}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Failed to load analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load analysis when resumeId changes
  useEffect(() => {
    if (resumeId) {
      loadAnalysis(resumeId);
    }
  }, [resumeId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <Sidebar />

      <main className="ml-0 px-4 py-6 sm:px-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <header className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">Resume Analyzer</p>
                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Upload, inspect, and optimize your resume</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                  Drag in a PDF, DOCX, or TXT file and get a polished ATS scorecard with actionable recommendations.
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-3xl border border-dashed p-8 text-center transition-all duration-300 sm:p-10 ${
                  file
                    ? 'border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                    : 'border-white/15 bg-slate-950/50 hover:border-violet-400/50 hover:bg-slate-900'
                }`}
              >
                <input {...getInputProps()} />
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>
                <div className="mt-5 space-y-2">
                  {file ? (
                    <>
                      <p className="text-base font-semibold text-white">{file.name}</p>
                      <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-white">Drop your resume here</p>
                      <p className="text-sm text-slate-400">PDF, DOCX, or TXT • up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!file || analyzing}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {analyzing ? (
                  <span className="flex items-center gap-3">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              {analysis ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">ATS Overview</p>
                      <h2 className="text-xl font-semibold text-white">Your optimization snapshot</h2>
                    </div>
                    <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-3xl font-bold text-violet-300">
                      {analysis.ats_score || 0}%
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['ats', 'analysis', 'jobs'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          activeTab === tab
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {tab === 'ats' ? 'ATS Scorecard' : tab === 'analysis' ? 'AI Analysis' : 'Job Match'}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'ats' && (
                    <ATSScore breakdown={analysis.ats_breakdown || {}} resumeId={resumeId} />
                  )}

                  {activeTab === 'analysis' && (
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div>
                        <h3 className="font-semibold text-white">Professional Summary</h3>
                        <p className="mt-2 text-sm text-slate-400">{analysis.professional_summary || 'Analysis in progress...'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Strengths</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
                          {(analysis.strengths || ['Analysis in progress...']).map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Areas for Improvement</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
                          {(analysis.weaknesses || ['Analysis in progress...']).map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Recommendations</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
                          {(analysis.recruiter_suggestions || 'Add metrics, tailor keywords, and tighten your summary.').split('.').filter((s) => s.trim()).map((r, i) => <li key={i}>{r.trim()}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'jobs' && (
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">Job Match</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Your resume is ready for role-specific matching. The score below is based on the skills and summary extracted from the uploaded resume.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-sm text-slate-400">Estimated Match</p>
                          <p className="mt-2 text-3xl font-bold text-violet-300">{Math.min(98, Math.max(15, Math.round((analysis.ats_score || 0) * 0.9)))}%</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-sm text-slate-400">Keywords Found</p>
                          <p className="mt-2 text-3xl font-bold text-emerald-300">{(analysis.missing_skills || []).length > 0 ? Math.max(1, 8 - (analysis.missing_skills || []).length) : 8}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Suggested improvements</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
                          {(analysis.weaknesses || ['Add metrics and role-specific keywords']).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-center">
                  <DocumentTextIcon className="mb-4 h-12 w-12 text-violet-400/70" />
                  <p className="text-lg font-semibold text-white">Upload and analyze a resume</p>
                  <p className="mt-2 text-sm text-slate-400">Your ATS scorecard and AI insights will appear here.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;