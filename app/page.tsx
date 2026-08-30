'use client';

import React, { useState } from 'react';
import DocumentInput from './components/DocumentInput';
import ResultsDashboard from './components/ResultsDashboard';
import { AnalysisResult } from './types';
import {
  Sparkles,
  FileCheck2,
  Clock,
  ShieldAlert,
  HelpCircle,
  Loader2,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string>('ai');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDocumentExtracted = async (text: string, title: string) => {
    setExtractedText(text);
    setDocTitle(title);
    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, title })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze document.');
      }

      setAnalysisResult(data.data);
      setAnalysisSource(data.source || 'ai');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setExtractedText('');
    setDocTitle('');
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Doc2<span className="text-indigo-400">Action</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Hackathon Demo Edition
            </span>
            {analysisResult && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg border border-slate-700 transition-all"
              >
                + New Document
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full z-10 flex flex-col justify-center">
        {!analysisResult && !isAnalyzing && (
          <div className="space-y-12">
            {/* Landing Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Convert PDF, Legal & Medical documents into zero-fluff priority plans
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Turn Complex Documents Into <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-500 bg-clip-text text-transparent">Clear Actions</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Upload your complicated contracts, leases, IRS notices, or medical pre-auths. Doc2Action extracts your essential deadlines, risks, required documents, and exact prioritized action steps.
              </p>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="max-w-3xl mx-auto p-4 bg-rose-950/40 border border-rose-500/50 text-rose-200 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Document Input Component */}
            <div className="max-w-4xl mx-auto">
              <DocumentInput onExtract={handleDocumentExtracted} isLoading={isAnalyzing} />
            </div>

            {/* Feature Highlights Grid */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-200 text-sm">Priority Action Plan</h4>
                <p className="text-xs text-slate-400">Classified by Urgent, Important, and Optional steps with clear reasons.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-200 text-sm">Deadlines & Dates</h4>
                <p className="text-xs text-slate-400">Never miss critical cut-off dates or notice periods hidden in fine print.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-200 text-sm">Warnings & Risks</h4>
                <p className="text-xs text-slate-400">Spot price hikes, coverage denials, levies, and penalty fees early.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-200 text-sm">Interactive Q&A</h4>
                <p className="text-xs text-slate-400">Ask any follow-up question and get answers grounded directly in the text.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-xl mx-auto my-16 p-10 bg-slate-900/90 border border-indigo-500/30 rounded-2xl shadow-2xl text-center space-y-6 backdrop-blur-md">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <Zap className="w-6 h-6 text-indigo-400 absolute" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Analyzing Your Document...</h3>
              <p className="text-xs text-slate-400">
                Extracting deadlines, detecting legal/financial risks, and generating your priority action plan.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-2 text-indigo-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Reading document structure
              </span>
              <span className="flex items-center gap-2 text-indigo-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Synthesizing plain English summary
              </span>
              <span className="flex items-center gap-2 text-indigo-300 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> Formatting YOUR ACTION PLAN
              </span>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {analysisResult && !isAnalyzing && (
          <div className="py-2">
            <ResultsDashboard
              result={analysisResult}
              documentText={extractedText}
              onReset={handleReset}
              source={analysisSource}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Doc2Action MVP — Automated Document Action Plan Generator</p>
          <div className="flex gap-4">
            <span>Fast Next.js 15 & Tailwind Architecture</span>
            <span>•</span>
            <span>Zero DB & No Auth</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
