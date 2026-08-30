'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, FileCode, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../mockData';

interface DocumentInputProps {
  onExtract: (extractedText: string, docName: string) => void;
  isLoading: boolean;
}

export default function DocumentInput({ onExtract, isLoading }: DocumentInputProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setExtracting(true);
    setExtractProgress('Reading file content...');

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        onExtract(text, file.name);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setExtractProgress('Extracting text from PDF pages...');
        try {
          // Dynamic import of pdfjs-dist
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            setExtractProgress(`Reading PDF page ${i} of ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(' ') + '\n\n';
          }

          if (fullText.trim().length > 0) {
            onExtract(fullText, file.name);
          } else {
            throw new Error('PDF appears to contain no extractable text. Try OCR or text paste.');
          }
        } catch (pdfErr: any) {
          console.warn('PDF parsing error, falling back to basic reader:', pdfErr);
          const fallbackText = await readAsPlainTextFallback(file);
          onExtract(fallbackText, file.name);
        }
      } else if (file.type.startsWith('image/')) {
        setExtractProgress('Scanning image with Optical Character Recognition (OCR)...');
        try {
          const Tesseract = await import('tesseract.js');
          const result = await Tesseract.recognize(file, 'eng', {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setExtractProgress(`OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            }
          });
          onExtract(result.data.text, file.name);
        } catch (ocrErr: any) {
          throw new Error('Could not extract text from image. Please paste text directly.');
        }
      } else {
        // Generic plain text attempt
        const text = await readAsPlainTextFallback(file);
        onExtract(text, file.name);
      }
    } catch (err: any) {
      alert(err.message || 'Error processing file');
    } finally {
      setExtracting(false);
      setExtractProgress('');
    }
  };

  const readAsPlainTextFallback = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    onExtract(pastedText, 'Pasted Document Text');
  };

  const handleSampleSelect = (sample: typeof SAMPLE_DOCUMENTS[0]) => {
    onExtract(sample.text, sample.name);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'upload'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Document (PDF / Image / TXT)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'paste'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'samples'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Try Sample Document
        </button>
      </div>

      {/* Upload View */}
      {activeTab === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-100">
                Drag and drop your document here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-400 underline hover:text-indigo-300 font-semibold"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Supports PDF contracts, lease agreements, medical letters, notices, or scanned images (OCR).
              </p>
            </div>

            {extracting && (
              <div className="flex flex-col items-center space-y-2 mt-4 text-indigo-400 animate-pulse">
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium">{extractProgress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paste View */}
      {activeTab === 'paste' && (
        <div className="space-y-4">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw contract, agreement, email notice, or document text here..."
            className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">
              {pastedText.length} characters entered
            </span>
            <button
              type="button"
              disabled={!pastedText.trim() || isLoading}
              onClick={handlePasteSubmit}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Document Text
            </button>
          </div>
        </div>
      )}

      {/* Samples View */}
      {activeTab === 'samples' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_DOCUMENTS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSampleSelect(sample)}
              className="border border-slate-800 bg-slate-950/60 hover:border-indigo-500/80 hover:bg-indigo-950/20 p-5 rounded-xl cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                  {sample.type}
                </span>
                <h4 className="font-semibold text-slate-200 text-base group-hover:text-indigo-300 transition-colors">
                  {sample.name}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                  {sample.text}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span>Click to Instant Test</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
