import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useResume } from '../hooks/useResume';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { FileText, Target, Eye, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export const Reports = () => {
  const { resumes, loading, fetchResumes } = useResume();
  const navigate = useNavigate();

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
          resumeFilename: resume.filename
        });
      });
    }
  });

  // Sort by date
  allAnalyses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Scans Registry</h2>
          <p className="text-xs text-slate-500 font-medium">Historical audit scans and JD matching tests catalog</p>
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
            {allAnalyses.map((analysis) => (
              <Card key={analysis.id} hoverEffect className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-violet-500/10 border border-violet-500/15 rounded-lg text-violet-400">
                        <FileText className="h-4 w-4" />
                      </div>
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

                  <p className="text-xs text-slate-400 leading-normal line-clamp-3 italic">
                    Target: {analysis.job_description ? analysis.job_description : "Baseline ATS layout review"}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(analysis.created_at)}</span>
                  </span>
                  <button
                    onClick={() => navigate(`/analyze?id=${analysis.resume_id}`)}
                    className="flex items-center space-x-1 font-bold text-violet-400 hover:text-violet-300 transition"
                  >
                    <span>Inspect</span>
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
