import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { rewriteResumeSection } from '../../api/resume';
import { Sparkles, Copy, Check } from 'lucide-react';

export const ResumeRewriter = ({ resumes = [] }) => {
  const [resumeId, setResumeId] = useState('');
  const [sectionText, setSectionText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!resumeId || !sectionText.trim()) return;
    setIsLoading(true);
    try {
      const res = await rewriteResumeSection(Number(resumeId), sectionText, tone);
      setRewrittenText(res.rewritten_text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-bold text-white">AI Resume Editor & Rewriter</h4>
            <p className="text-xs text-slate-500">Transform passive phrases into action-oriented statements</p>
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

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Style Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              >
                <option value="Professional">Professional & Formal</option>
                <option value="Impactful">Result & Metrics-Driven</option>
                <option value="Technical">Tech-Stack Optimized</option>
              </select>
            </div>
          </div>

          <Input
            label="Original Bullet Point or Paragraph"
            type="textarea"
            placeholder="Paste a bullet point here (e.g., 'I was responsible for fixing bugs and updating the code...')"
            value={sectionText}
            onChange={(e) => setSectionText(e.target.value)}
            rows={3}
          />

          <Button
            onClick={handleRewrite}
            disabled={isLoading || !resumeId || !sectionText.trim()}
            isLoading={isLoading}
            icon={Sparkles}
          >
            Rewrite Selection
          </Button>
        </div>
      </Card>

      {rewrittenText && (
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
            <h4 className="text-sm font-bold text-white">Suggested Revision ({tone})</h4>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition duration-150 flex items-center space-x-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-4 font-sans text-sm text-slate-200 select-text leading-relaxed italic">
            {rewrittenText}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResumeRewriter;
