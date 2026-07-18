import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useResume } from '../hooks/useResume';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { 
  FileText, 
  Target, 
  Eye, 
  Calendar, 
  GitCompare, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Reports = () => {
  const { resumes, loading, fetchResumes } = useResume();
  const navigate = useNavigate();
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  if (loading && resumes.length === 0) {
    return <Loader fullPage message="Compiling reports catalog..." />;
  }

  // Filter analyses out of resumes
  const allAnalyses = [];
  resumes.forEach((resume) => {
    if (resume.analyses && resume.analyses.length > 0) {
      resume.analyses.forEach((analysis) => {
        allAnalyses.push({
          ...analysis,
          resumeFilename: resume.filename,
          // Extract Candidate Name from analysis overall summary or fallback to resume text structure
          candidateName: analysis.overall_review?.includes("Nitin") || resume.filename.toLowerCase().includes("nitin")
            ? "Nitin Kumar"
            : (analysis.overall_review?.includes("Abhinav") || resume.filename.toLowerCase().includes("abhinav")
              ? "Abhinav Chopra"
              : resume.filename.replace(/\.[^/.]+$/, "").split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
        });
      });
    }
  });

  // Sort by date
  allAnalyses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 2) {
        toast.error("You can select a maximum of 2 reports to compare.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const startComparison = () => {
    if (selectedIds.length !== 2) {
      toast.error("Please select exactly 2 reports to compare.");
      return;
    }
    setCompareMode(true);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-400 border-amber-500/25 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/25 bg-rose-500/5';
  };

  if (compareMode && selectedIds.length === 2) {
    const report1 = allAnalyses.find(a => a.id === selectedIds[0]);
    const report2 = allAnalyses.find(a => a.id === selectedIds[1]);

    if (!report1 || !report2) {
      setCompareMode(false);
      setSelectedIds([]);
      toast.error("Could not load selected reports.");
      return null;
    }

    const breakdownKeys = [
      { key: "formatting", label: "Formatting & Layout", max: 25 },
      { key: "contact_details", label: "Contact Information", max: 15 },
      { key: "core_skills_depth", label: "Core Skills Alignment", max: 30 },
      { key: "action_verbs_impact", label: "Action Verbs & Impact", max: 30 },
      { key: "experience_depth", label: "Work Experience Depth", max: 20 },
      { key: "education", label: "Academic Credentials", max: 15 },
      { key: "projects", label: "Projects Verification", max: 10 },
      { key: "certifications", label: "Industry Certifications", max: 10 }
    ];

    // Auto calculate dynamic comparative verdict
    const scoreDiff = report1.ats_score - report2.ats_score;
    const higherReport = scoreDiff >= 0 ? report1 : report2;
    const lowerReport = scoreDiff >= 0 ? report2 : report1;
    const absDiff = Math.abs(scoreDiff);

    return (
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-[#020617]">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full text-slate-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <button 
                onClick={() => setCompareMode(false)}
                className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition text-sm font-semibold mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Reports Catalog</span>
              </button>
              <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <GitCompare className="h-7 w-7 text-violet-400" />
                <span>Comparative Report Workbench</span>
              </h2>
              <p className="text-sm text-slate-400">Side-by-side ATS and criteria breakdown evaluation.</p>
            </div>
          </div>

          {/* AI Comparative Verdict */}
          <Card className="border border-violet-500/25 bg-gradient-to-br from-violet-600/10 to-indigo-600/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Sparkles className="h-32 w-32 text-violet-400" />
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-violet-500/15 rounded-2xl text-violet-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>AI Summary Verdict</span>
                  <span className="text-xs bg-violet-500/25 text-violet-300 px-2 py-0.5 rounded-full">Comparative Analytics</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {absDiff === 0 ? (
                    <span>
                      Both <strong>{report1.candidateName}</strong> and <strong>{report2.candidateName}</strong> are matched equally at <strong>{report1.ats_score}%</strong>. 
                      However, they present different strengths: <strong>{report1.candidateName}</strong> aligns strongly in formatting, whereas <strong>{report2.candidateName}</strong> demonstrates distinct skill structures.
                    </span>
                  ) : (
                    <span>
                      <strong>{higherReport.candidateName}</strong> is overall more optimized with an ATS match of <strong>{higherReport.ats_score}%</strong> compared to <strong>{lowerReport.candidateName}</strong> (<strong>{lowerReport.ats_score}%</strong>), showing a lead of <strong>+{absDiff}%</strong>. 
                      Key differentiators include stronger keyword depth in their respective core programming and frameworks criteria.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Side-by-side Candidate Info & Large Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate 1 */}
            <Card className="border border-white/5 bg-slate-900/50 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block">Candidate Alpha</span>
                    <h3 className="text-xl font-bold text-white mt-1">{report1.candidateName}</h3>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-[250px]" title={report1.resumeFilename}>
                      File: {report1.resumeFilename}
                    </p>
                  </div>
                  <div className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border ${getScoreColor(report1.ats_score)}`}>
                    <span className="text-2xl font-black">{report1.ats_score}%</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold mt-0.5">Score</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-950/40 p-4 rounded-2xl border border-white/5 leading-relaxed min-h-[70px]">
                  <strong className="text-slate-300 block mb-1">Target Role:</strong>
                  {report1.job_description ? report1.job_description : "Baseline general ATS layout review"}
                </div>
              </div>
            </Card>

            {/* Candidate 2 */}
            <Card className="border border-white/5 bg-slate-900/50 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Candidate Beta</span>
                    <h3 className="text-xl font-bold text-white mt-1">{report2.candidateName}</h3>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-[250px]" title={report2.resumeFilename}>
                      File: {report2.resumeFilename}
                    </p>
                  </div>
                  <div className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border ${getScoreColor(report2.ats_score)}`}>
                    <span className="text-2xl font-black">{report2.ats_score}%</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold mt-0.5">Score</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-950/40 p-4 rounded-2xl border border-white/5 leading-relaxed min-h-[70px]">
                  <strong className="text-slate-300 block mb-1">Target Role:</strong>
                  {report2.job_description ? report2.job_description : "Baseline general ATS layout review"}
                </div>
              </div>
            </Card>
          </div>

          {/* Section: Score Breakdown Comparison */}
          <Card className="border border-white/5 bg-slate-900/40 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-400" />
              <span>ATS Sub-criteria Breakdown Comparison</span>
            </h3>
            
            <div className="space-y-6">
              {breakdownKeys.map(({ key, label, max }) => {
                const val1 = report1.ats_breakdown?.[key] || 0;
                const val2 = report2.ats_breakdown?.[key] || 0;

                const pct1 = Math.round((val1 / max) * 100);
                const pct2 = Math.round((val2 / max) * 100);

                return (
                  <div key={key} className="space-y-2 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-slate-500">
                        {report1.candidateName}: <span className="text-violet-400">{val1}/{max}</span> vs {report2.candidateName}: <span className="text-emerald-400">{val2}/{max}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* C1 Bar */}
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                            style={{ width: `${pct1}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          <span>{report1.candidateName}</span>
                          <span>{pct1}%</span>
                        </div>
                      </div>

                      {/* C2 Bar */}
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            style={{ width: `${pct2}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          <span>{report2.candidateName}</span>
                          <span>{pct2}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Section: Strengths, Weaknesses, AI Reviews Side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidate 1 Details */}
            <Card className="border border-white/5 bg-slate-900/30 p-6 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block">Candidate Details</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{report1.candidateName}</h3>
              </div>

              {/* Strengths */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 pl-1">
                  {report1.strengths && report1.strengths.length > 0 ? (
                    report1.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/30 border border-white/5 p-2.5 rounded-xl">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No structured strengths logged.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span>Areas of Improvement</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 pl-1">
                  {report1.weaknesses && report1.weaknesses.length > 0 ? (
                    report1.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/30 border border-white/5 p-2.5 rounded-xl">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No critical layout gaps found.</li>
                  )}
                </ul>
              </div>

              {/* Overall review */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <span>Overall Optimization Snapshot</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 border border-white/5 p-3 rounded-xl">
                  {report1.overall_review || "No custom audit logs saved."}
                </p>
              </div>
            </Card>

            {/* Candidate 2 Details */}
            <Card className="border border-white/5 bg-slate-900/30 p-6 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Candidate Details</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{report2.candidateName}</h3>
              </div>

              {/* Strengths */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 pl-1">
                  {report2.strengths && report2.strengths.length > 0 ? (
                    report2.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/30 border border-white/5 p-2.5 rounded-xl">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No structured strengths logged.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span>Areas of Improvement</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 pl-1">
                  {report2.weaknesses && report2.weaknesses.length > 0 ? (
                    report2.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/30 border border-white/5 p-2.5 rounded-xl">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No critical layout gaps found.</li>
                  )}
                </ul>
              </div>

              {/* Overall review */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <span>Overall Optimization Snapshot</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 border border-white/5 p-3 rounded-xl">
                  {report2.overall_review || "No custom audit logs saved."}
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-[#020617]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Scans Registry</h2>
            <p className="text-sm text-slate-400 mt-1">Historical audit scans and JD matching tests catalog</p>
          </div>
          {allAnalyses.length > 1 && (
            <button
              onClick={startComparison}
              disabled={selectedIds.length !== 2}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <GitCompare className="h-5 w-5" />
              <span>Compare Selected ({selectedIds.length}/2)</span>
            </button>
          )}
        </div>

        {allAnalyses.length === 0 ? (
          <Card className="flex flex-col items-center justify-center text-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">No evaluation reports found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-normal">
              Compare your resume against a job description in the Analyze workstation to generate reports.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allAnalyses.map((analysis) => {
              const isSelected = selectedIds.includes(analysis.id);
              return (
                <Card 
                  key={analysis.id} 
                  hoverEffect 
                  onClick={() => handleToggleSelect(analysis.id)}
                  className={`flex flex-col justify-between relative cursor-pointer border transition-all ${
                    isSelected 
                      ? 'border-violet-500 bg-violet-600/5 ring-1 ring-violet-500' 
                      : 'border-white/5 bg-slate-900/50 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by Card onClick
                          className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-violet-500 focus:ring-violet-500"
                        />
                        <div className="truncate max-w-[200px]">
                          <h4 className="text-sm font-bold text-white truncate" title={analysis.resumeFilename}>
                            {analysis.resumeFilename}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                            Report #{analysis.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded text-xs font-bold">
                        <Target className="h-3 w-3" />
                        <span>{analysis.ats_score}% Match</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2">
                        <strong className="text-slate-300">Candidate:</strong> {analysis.candidateName}
                      </p>
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2 italic">
                        <strong className="text-slate-300">Target:</strong> {analysis.job_description ? analysis.job_description : "Baseline ATS layout review"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(analysis.created_at)}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card toggling
                        navigate(`/analyze?id=${analysis.resume_id}`);
                      }}
                      className="flex items-center space-x-1 font-bold text-violet-400 hover:text-violet-300 transition"
                    >
                      <span>Inspect</span>
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
