import React from 'react';
import Card from '../common/Card';
import { Target, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const JobMatching = ({ matchResults }) => {
  const {
    match_score = 0,
    matching_skills = [],
    missing_skills = [],
    gap_analysis = []
  } = matchResults || {};

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h4 className="text-base font-bold text-white">Target Job Analysis</h4>
          <p className="text-xs text-slate-500 font-medium">Evaluation against job requirements</p>
        </div>
        <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border ${getScoreColor(match_score)}`}>
          <Target className="h-4 w-4" />
          <span className="text-sm font-bold tracking-tight">{match_score}% Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Matching Keywords ({matching_skills.length})</span>
          </h5>
          {matching_skills.length === 0 ? (
            <p className="text-sm text-slate-500">No matching skills identified.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matching_skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span>Missing Keywords ({missing_skills.length})</span>
          </h5>
          {missing_skills.length === 0 ? (
            <p className="text-sm text-slate-500">No missing skills detected!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md animate-pulse"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gap Analysis Summary */}
      {gap_analysis.length > 0 && (
        <div className="mt-6 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2 mb-3">
            <Info className="h-4 w-4 text-violet-400" />
            <span>Gap Analysis & Recommendations</span>
          </h5>
          <ul className="space-y-2 text-sm text-slate-300">
            {gap_analysis.map((gap, index) => (
              <li key={index} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-violet-400 flex-shrink-0 mt-1">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default JobMatching;
