import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { generateCoverLetter } from '../../api/resume';
import { FileText, Copy, Check } from 'lucide-react';

export const CoverLetter = ({ resumes = [] }) => {
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resumeId || !jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const res = await generateCoverLetter(Number(resumeId), jobDescription);
      setCoverLetter(res.cover_letter);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-bold text-white">Cover Letter Builder</h4>
            <p className="text-xs text-slate-500">Generate a custom cover letter mapped to a specific job opening</p>
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
            placeholder="Paste the target job description or requirements here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
          />

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !resumeId || !jobDescription.trim()}
            isLoading={isLoading}
            icon={FileText}
          >
            Generate Cover Letter
          </Button>
        </div>
      </Card>

      {coverLetter && (
        <Card className="flex flex-col h-[400px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h4 className="text-sm font-bold text-white">Tailored Letter</h4>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition duration-150 flex items-center space-x-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-slate-950/80 border border-slate-900 rounded-lg p-4 font-sans text-sm text-slate-300 whitespace-pre-wrap select-text leading-relaxed">
            {coverLetter}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CoverLetter;
