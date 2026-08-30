'use client';

import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import ActionPlan from './ActionPlan';
import QnASection from './QnASection';
import {
  FileText,
  Calendar,
  AlertOctagon,
  ClipboardList,
  Sparkles,
  ArrowLeft,
  CheckSquare,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
  documentText: string;
  onReset: () => void;
  source?: string;
}

export default function ResultsDashboard({ result, documentText, onReset, source }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'action' | 'summary' | 'dates' | 'warnings' | 'required' | 'chat'>('action');

  return (
    <div className="w-full space-y-6">
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Analyze Another Document
            </button>
            {source === 'mock' && (
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-md mb-2">
                Fallback AI Engine
              </span>
            )}
            {source === 'ai' && (
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-md mb-2">
                Live AI Engine
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            {result.documentTitle || "Analyzed Document"}
          </h1>
        </div>

        {/* Action Metrics pill bar */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl self-start md:self-auto">
          <div className="px-3 text-center border-r border-slate-800">
            <span className="block text-xs text-slate-400">Actions</span>
            <span className="text-base font-bold text-indigo-400">{result.actions.length}</span>
          </div>
          <div className="px-3 text-center border-r border-slate-800">
            <span className="block text-xs text-slate-400">Deadlines</span>
            <span className="text-base font-bold text-rose-400">{result.deadlines.length}</span>
          </div>
          <div className="px-3 text-center">
            <span className="block text-xs text-slate-400">Warnings</span>
            <span className="text-base font-bold text-amber-400">{result.warnings.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/60 p-2 rounded-xl gap-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('action')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'action'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          YOUR ACTION PLAN
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'summary'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          Simple Summary
        </button>

        <button
          onClick={() => setActiveTab('dates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'dates'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Important Dates ({result.deadlines.length})
        </button>

        <button
          onClick={() => setActiveTab('warnings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'warnings'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          Warnings & Risks ({result.warnings.length})
        </button>

        <button
          onClick={() => setActiveTab('required')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'required'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Required Info ({result.requiredDocuments.length})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          💬 Document Q&A
        </button>
      </div>

      {/* Tab Content Display */}

      {/* WOW FEATURE: ACTION PLAN */}
      {activeTab === 'action' && (
        <ActionPlan actionPlan={result.actions} />
      )}

      {/* SIMPLE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <Info className="w-4 h-4" />
            Plain Language Synthesis
          </div>
          <h2 className="text-2xl font-bold text-white">Simple Document Summary</h2>
          <p className="text-slate-200 leading-relaxed text-base bg-slate-950/80 p-5 rounded-xl border border-slate-800/80">
            {result.summary}
          </p>
        </div>
      )}

      {/* IMPORTANT DATES */}
      {activeTab === 'dates' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <Calendar className="w-4 h-4" />
            Timeline & Obligations
          </div>
          <h2 className="text-2xl font-bold text-white">Important Dates & Deadlines</h2>
          {result.deadlines.length === 0 ? (
            <p className="text-slate-400 p-4 border border-slate-800 border-dashed rounded-xl bg-slate-950/40 text-center">
              No deadlines found in this document.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.deadlines.map((d, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-base text-white">{d.date}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                      DEADLINE
                    </span>
                  </div>
                  <p className="font-semibold text-white text-sm mb-1">{d.title}</p>
                  <p className="text-sm text-slate-300">{d.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WARNINGS & RISKS */}
      {activeTab === 'warnings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4" />
            Liability & Risk Exposure
          </div>
          <h2 className="text-2xl font-bold text-white">Warnings & Risks Identified</h2>
          {result.warnings.length === 0 ? (
            <p className="text-slate-400 p-4 border border-slate-800 border-dashed rounded-xl bg-slate-950/40 text-center">
              No specific warnings identified.
            </p>
          ) : (
            <div className="space-y-4">
              {result.warnings.map((w, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border ${
                    w.severity === 'HIGH'
                      ? 'border-rose-500/50 bg-rose-950/20'
                      : w.severity === 'MEDIUM'
                      ? 'border-amber-500/50 bg-amber-950/20'
                      : 'border-slate-800 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      w.severity === 'HIGH' ? 'bg-rose-500 text-white' : w.severity === 'MEDIUM' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                    }`}>
                      {w.severity} SEVERITY
                    </span>
                    <h3 className="font-bold text-slate-100 text-base">{w.title}</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{w.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REQUIRED INFORMATION & DOCUMENTS */}
      {activeTab === 'required' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <ClipboardList className="w-4 h-4" />
            Preparation Checklist
          </div>
          <h2 className="text-2xl font-bold text-white">Required Information & Documents</h2>
          <div className="space-y-3">
            {result.requiredDocuments.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl gap-3">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-200 text-base">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT / Q&A */}
      {activeTab === 'chat' && (
        <QnASection documentText={documentText} />
      )}
    </div>
  );
}
