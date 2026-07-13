import React from 'react';
import Card from '../common/Card';
import { getScoreColorClass } from '../../utils/helpers';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';

export const ATSScore = ({ metrics }) => {
  const {
    score = 0,
    formatting_score = 0,
    contact_score = 0,
    skills_score = 0,
    metrics_score = 0,
    suggestions = []
  } = metrics || {};

  // Calculate circular SVG parameters
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getCircleColor = (val) => {
    if (val >= 80) return 'stroke-emerald-400';
    if (val >= 60) return 'stroke-amber-400';
    return 'stroke-rose-400';
  };

  const getBarColor = (val) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Circle Guage Card */}
      <Card className="flex flex-col items-center justify-center text-center py-8">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Overall ATS Rating</h4>
        <div className="relative w-36 h-36">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="stroke-slate-800"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx="72"
              cy="72"
            />
            <circle
              className={`${getCircleColor(score)} transition-all duration-500 ease-out`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="72"
              cy="72"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white">{score}</span>
            <span className="text-xs text-slate-500 font-medium">/ 100</span>
          </div>
        </div>
        <p className="mt-6 text-sm font-semibold text-slate-300 flex items-center space-x-1.5 justify-center">
          <Award className="h-4 w-4 text-violet-400" />
          <span>Structural Score</span>
        </p>
      </Card>

      {/* Breakdown Card */}
      <Card className="lg:col-span-2 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Metric Breakdown</h4>
          <div className="space-y-4">
            {/* Formatting */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Structure & Formatting</span>
                <span className="text-slate-400">{formatting_score} / 25</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${getBarColor(formatting_score * 4)}`} style={{ width: `${(formatting_score / 25) * 100}%` }}></div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Contact Details</span>
                <span className="text-slate-400">{contact_score} / 15</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${getBarColor(contact_score * 6.6)}`} style={{ width: `${(contact_score / 15) * 100}%` }}></div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Core Skills Depth</span>
                <span className="text-slate-400">{skills_score} / 30</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${getBarColor(skills_score * 3.3)}`} style={{ width: `${(skills_score / 30) * 100}%` }}></div>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Action Verbs & Impact metrics</span>
                <span className="text-slate-400">{metrics_score} / 30</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${getBarColor(metrics_score * 3.3)}`} style={{ width: `${(metrics_score / 30) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Suggestions Expandable Card */}
      {suggestions.length > 0 && (
        <Card className="lg:col-span-3">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Improvement Suggestions</h4>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-3 text-sm text-slate-300 leading-relaxed">
                <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default ATSScore;
