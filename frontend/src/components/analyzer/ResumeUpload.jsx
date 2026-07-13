import React, { useRef, useState } from 'react';
import Card from '../common/Card';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export const ResumeUpload = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = (file) => {
    setErrorMessage(null);
    if (!file) return;

    // Check file type
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage("Unsupported file format. Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File is too large. Maximum file size is 5MB.");
      return;
    }

    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`border-dashed border-2 py-12 px-6 text-center transition-all ${
        isDragOver
          ? 'border-violet-500 bg-violet-600/5'
          : 'border-slate-800/80 hover:border-slate-700/60'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/15 text-violet-400 animate-pulse">
          <UploadCloud className="h-7 w-7" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Upload your Resume</h4>
          <p className="text-xs text-slate-500 mt-1">Drag and drop your file here, or click to browse</p>
        </div>
        
        <Button
          onClick={handleButtonClick}
          variant="secondary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Select File
        </Button>
        
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          Supported formats: PDF, DOCX, TXT (Max 5MB)
        </p>

        {errorMessage && (
          <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-2 rounded-lg text-xs mt-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumeUpload;
