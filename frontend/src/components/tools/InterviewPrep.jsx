import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { generateInterviewPrep } from '../../api/resume';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const InterviewPrep = ({ resumes = [] }) => {
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const handleGenerate = async () => {
    if (!resumeId || !jobDescription.trim()) return;
    setIsLoading(true);
    setOpenIndex(null);
    try {
      const res = await generateInterviewPrep(Number(resumeId), jobDescription);
      setQuestions(res.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-bold text-white">Interview Prep Planner</h4>
            <p className="text-xs text-slate-500">Generate targeted interview prep questions & model answers</p>
          </div>

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
            label="Target Job Description"
            type="textarea"
            placeholder="Paste target job descriptions to focus questions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
          />

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !resumeId || !jobDescription.trim()}
            isLoading={isLoading}
            icon={HelpCircle}
          >
            Generate Q&A Cards
          </Button>
        </div>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider px-1">Tailored Interview Questions</h4>
          
          {questions.map((q, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card key={idx} className="p-0 border-white/5 overflow-hidden">
                <button
                  onClick={() => toggleQuestion(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-900/40 transition duration-150"
                >
                  <span className="text-sm font-bold text-white pr-4">{q.question}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-violet-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-slate-900/20 text-sm text-slate-300 leading-relaxed select-text">
                    <p className="font-semibold text-violet-400 mb-1 text-xs uppercase tracking-widest">Suggested Response Pattern:</p>
                    <p className="whitespace-pre-wrap">{q.answer}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
