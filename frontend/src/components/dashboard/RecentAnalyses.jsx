import React from 'react';
import { FileText, Eye, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import { formatDate, getScoreColorClass } from '../../utils/helpers';

export const RecentAnalyses = ({ resumes, onView, onDelete }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-white">Recent Analyses</h4>
          <p className="text-xs text-slate-500">Your uploaded files and current evaluations</p>
        </div>
      </div>
      
      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-3">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-400">No resumes uploaded yet</p>
          <p className="text-xs text-slate-500 mt-1">Upload a resume in the Analyze page to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resumes.slice(0, 5).map((resume) => (
                <tr key={resume.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white flex items-center space-x-3">
                    <div className="p-2 bg-violet-500/10 border border-violet-500/15 rounded-lg text-violet-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="truncate max-w-[200px]" title={resume.filename}>
                      {resume.filename}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs">
                    {formatDate(resume.uploaded_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(resume.id)}
                        className="p-1.5 hover:bg-slate-800 border border-transparent hover:border-slate-700/60 rounded text-slate-400 hover:text-violet-400 transition"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(resume.id)}
                        className="p-1.5 hover:bg-slate-800 border border-transparent hover:border-slate-700/60 rounded text-slate-400 hover:text-rose-400 transition"
                        title="Delete resume"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default RecentAnalyses;
