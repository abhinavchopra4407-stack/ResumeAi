import React from 'react';
import Card from '../common/Card';
import { FileText, Copy, Check } from 'lucide-react';

export const ResumePreview = ({ text, filename }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-violet-500/10 border border-violet-500/15 rounded-lg text-violet-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Parsed Content</h4>
            <p className="text-xs text-slate-500 truncate max-w-[200px]" title={filename}>{filename}</p>
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition duration-150 flex items-center space-x-1.5 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950/80 border border-slate-900 rounded-lg p-4 font-mono text-xs text-slate-400 leading-relaxed whitespace-pre-wrap select-text">
        {text || "No resume text content found."}
      </div>
    </Card>
  );
};

export default ResumePreview;
