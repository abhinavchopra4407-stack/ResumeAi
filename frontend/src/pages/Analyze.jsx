import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ResumeUpload from '../components/analyzer/ResumeUpload';
import ATSScore from '../components/analyzer/ATSScore';
import JobMatching from '../components/analyzer/JobMatching';
import ResumePreview from '../components/analyzer/ResumePreview';
import Loader from '../components/common/Loader';
import CoverLetter from '../components/tools/CoverLetter';
import InterviewPrep from '../components/tools/InterviewPrep';
import ResumeRewriter from '../components/tools/ResumeRewriter';
import RoadmapGenerator from '../components/tools/RoadmapGenerator';

import { useResume } from '../hooks/useResume';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Play, Sparkles, FileText, Compass, HelpCircle, CheckSquare, Search } from 'lucide-react';

export const Analyze = () => {
  const [searchParams] = useSearchParams();
  const resumeUrlId = searchParams.get('id');

  const {
    resumes,
    selectedResume,
    loading,
    actionLoading,
    fetchResumes,
    fetchResumeDetails,
    uploadNewResume,
    runJobAnalysis
  } = useResume();

  const [activeTab, setActiveTab] = useState('ats'); // 'ats', 'match', 'rewrite', 'cover', 'prep', 'roadmap'
  const [jobDescription, setJobDescription] = useState('');
  const [jdAnalysisResult, setJdAnalysisResult] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Load details if query param exists or falls back to first resume in history
  useEffect(() => {
    if (resumeUrlId) {
      fetchResumeDetails(Number(resumeUrlId));
    } else if (resumes.length > 0 && !selectedResume) {
      fetchResumeDetails(resumes[0].id);
    }
  }, [resumeUrlId, resumes, selectedResume, fetchResumeDetails]);

  const handleUpload = async (file) => {
    try {
      const res = await uploadNewResume(file);
      setJdAnalysisResult(null);
      setJobDescription('');
      setActiveTab('ats');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedResume || !jobDescription.trim()) return;
    try {
      const result = await runJobAnalysis(selectedResume.id, jobDescription);
      setJdAnalysisResult(result);
      setActiveTab('match');
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeSelect = (e) => {
    const rId = e.target.value;
    if (rId) {
      fetchResumeDetails(Number(rId));
      setJdAnalysisResult(null);
      setJobDescription('');
    }
  };

  if (loading && resumes.length === 0) {
    return <Loader fullPage message="Accessing analyzer workstation..." />;
  }

  // Get base analysis (the baseline one generated on upload, which is the first analysis in selectedResume)
  const baseAnalysis = selectedResume?.analyses?.[0];
  const activeAnalysis = jdAnalysisResult || baseAnalysis;

  const tabs = [
    { id: 'ats', label: 'ATS Scorecard', icon: CheckSquare },
    { id: 'match', label: 'JD Matcher', icon: Search },
    { id: 'rewrite', label: 'AI Editor', icon: Sparkles },
    { id: 'cover', label: 'Cover Letter', icon: FileText },
    { id: 'prep', label: 'Interview Q&A', icon: HelpCircle },
    { id: 'roadmap', label: 'Roadmap', icon: Compass }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Workspace Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Optimizer Workstation</h2>
            <p className="text-xs text-slate-500 font-medium">Verify guidelines, match job descriptions, and write cover letters.</p>
          </div>

          {resumes.length > 0 && (
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Document</label>
              <select
                value={selectedResume?.id || ''}
                onChange={handleResumeSelect}
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-xs font-semibold"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* If no resumes uploaded, show upload widget */}
        {resumes.length === 0 ? (
          <div className="max-w-xl mx-auto py-12">
            <ResumeUpload onUpload={handleUpload} isLoading={actionLoading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Left Panel: Tabs and Operations */}
            <div className="xl:col-span-2 space-y-6">
              {/* Tab Header row */}
              <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none pb-0.5 space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
                        isActive
                          ? 'border-violet-500 text-violet-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="pt-2">
                {activeTab === 'ats' && (
                  <div className="space-y-6">
                    {baseAnalysis ? (
                      <ATSScore metrics={baseAnalysis.feedback} />
                    ) : (
                      <Loader message="Loading ATS scorecards..." />
                    )}
                  </div>
                )}

                {activeTab === 'match' && (
                  <div className="space-y-6">
                    <Card className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Compare Job Description</h4>
                        <p className="text-xs text-slate-500">Run a custom keyword overlap verification against target job posts</p>
                      </div>
                      <Input
                        label="Job Description / Requirements"
                        type="textarea"
                        placeholder="Paste target job requirements here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={4}
                      />
                      <Button
                        onClick={handleRunAnalysis}
                        disabled={actionLoading || !jobDescription.trim()}
                        isLoading={actionLoading}
                        icon={Play}
                      >
                        Scan Target JD
                      </Button>
                    </Card>

                    {activeAnalysis && activeAnalysis.job_description && (
                      <JobMatching matchResults={activeAnalysis.job_matching} />
                    )}
                  </div>
                )}

                {activeTab === 'rewrite' && (
                  <ResumeRewriter resumes={resumes} />
                )}

                {activeTab === 'cover' && (
                  <CoverLetter resumes={resumes} />
                )}

                {activeTab === 'prep' && (
                  <InterviewPrep resumes={resumes} />
                )}

                {activeTab === 'roadmap' && (
                  <RoadmapGenerator resumes={resumes} />
                )}
              </div>
            </div>

            {/* Right Panel: Resume Extracted Text Preview */}
            <div className="xl:col-span-1">
              {selectedResume ? (
                <ResumePreview
                  text={selectedResume.file_content_text}
                  filename={selectedResume.filename}
                />
              ) : (
                <Card className="h-[500px] flex items-center justify-center text-slate-500">
                  Select a resume to view parsed text.
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analyze;
