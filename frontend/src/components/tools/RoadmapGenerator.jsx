import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { generateRoadmap } from '../../api/resume';
import { Compass, GraduationCap, MapPin } from 'lucide-react';

export const RoadmapGenerator = ({ resumes = [] }) => {
  const [resumeId, setResumeId] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!resumeId || !targetRole.trim()) return;
    setIsLoading(true);
    try {
      const res = await generateRoadmap(Number(resumeId), targetRole);
      setRoadmap(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-bold text-white">Career Roadmap Planner</h4>
            <p className="text-xs text-slate-500">Generate a step-by-step technical learning path for your dream role</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Resume Context</label>
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              >
                <option value="">-- Choose Resume --</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-950 text-slate-300">
                    {r.filename}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Target Role / Job Title"
              placeholder="e.g. Senior Fullstack Engineer, DevOps Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !resumeId || !targetRole.trim()}
            isLoading={isLoading}
            icon={Compass}
          >
            Generate Learning Roadmap
          </Button>
        </div>
      </Card>

      {roadmap && (
        <Card className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <Compass className="h-5 w-5 text-violet-400" />
              <span>Tailored Roadmap: {roadmap.target_role}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">Personalized guide based on your current background</p>
          </div>

          {/* Current Skills Badge Grid */}
          {roadmap.current_skills && roadmap.current_skills.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Starting Skills Catalog:</span>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.current_skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-300 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Milestones */}
          <div className="relative border-l border-slate-800/80 ml-3 pl-6 space-y-8">
            {roadmap.milestones.map((m, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-violet-400">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-3">
                    <h5 className="text-sm font-bold text-white">{m.title}</h5>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-md">
                      {m.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{m.description}</p>
                  
                  {/* Phase checklists */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pl-1.5">
                    {m.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start space-x-2 text-xs text-slate-300 leading-normal">
                        <span className="text-violet-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoadmapGenerator;
