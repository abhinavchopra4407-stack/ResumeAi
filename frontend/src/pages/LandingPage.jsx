import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Terminal, Compass } from 'lucide-react';
import Card from '../components/common/Card';

export const LandingPage = () => {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative Glow Elements */}
      <div className="glow-bg glow-violet top-20 left-1/4"></div>
      <div className="glow-bg glow-blue bottom-10 right-1/4"></div>

      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
        {/* Banner Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-600/5 text-violet-400 text-xs font-semibold animate-pulse-slow">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Career Optimizations</span>
        </div>

        {/* Hero Headers */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          Optimize your resume for the <span className="text-gradient">AI Screening Era</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          ResumeIQ leverages smart algorithms to audit your layout, review technical keyword matches, and score templates against real-world ATS filters.
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 px-6 py-3.5 hover:from-violet-500 hover:to-indigo-500 transition duration-150 transform active:scale-98 group"
          >
            <span>Scan Your Resume Free</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-800/80 px-6 py-3.5 transition duration-150"
          >
            Developer Login
          </Link>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 w-full">
        <Card hoverEffect>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/10 border border-violet-500/15 text-violet-400 mb-4">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">ATS Score Auditing</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Get instant feedback on layout density, structure headers, and quantifiable metrics to ensure compliance with hiring systems.
          </p>
        </Card>

        <Card hoverEffect>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 border border-emerald-500/15 text-emerald-400 mb-4">
            <Terminal className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Bullet Rewriter</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Convert weak phrases into professional accomplishments. Inject industry action verbs and result-driven structures.
          </p>
        </Card>

        <Card hoverEffect>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/15 text-indigo-400 mb-4">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Target Job Matching</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Paste target descriptions to run keyword gaps, identify missing tech skills, and estimate your interview likelihood score.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
