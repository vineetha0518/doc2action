'use client';

import React, { useState } from 'react';
import { ActionItem } from '../types';
import { AlertCircle, Clock, ShieldAlert, Sparkles, CheckCircle, CheckSquare, Square } from 'lucide-react';

interface ActionPlanProps {
  actionPlan: ActionItem[];
}

export default function ActionPlan({ actionPlan }: ActionPlanProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const toggleCompletion = (id: string) => {
    setCompletedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const completedCount = completedIds.size;
  const totalCount = actionPlan.length;

  const getPriorityBadge = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-md flex items-center gap-1.5 uppercase tracking-wide animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            URGENT
          </span>
        );
      case 'IMPORTANT':
        return (
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-md flex items-center gap-1.5 uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5" />
            IMPORTANT
          </span>
        );
      case 'OPTIONAL':
      default:
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-md flex items-center gap-1.5 uppercase tracking-wide">
            <CheckCircle className="w-3.5 h-3.5" />
            OPTIONAL
          </span>
        );
    }
  };

  const getCardBorder = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-4 border-l-rose-500 border-slate-800 bg-slate-900/90 shadow-rose-950/20';
      case 'IMPORTANT':
        return 'border-l-4 border-l-amber-500 border-slate-800 bg-slate-900/90 shadow-amber-950/20';
      case 'OPTIONAL':
      default:
        return 'border-l-4 border-l-emerald-500 border-slate-800 bg-slate-900/90 shadow-emerald-950/20';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-lg">
      {/* Decorative Glow background */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Priority Action Engine
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            YOUR ACTION PLAN
          </h2>
        </div>
        <div className="text-xs text-slate-400 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg self-start sm:self-auto">
          {completedCount} of {totalCount} Action Steps Completed
        </div>
      </div>

      {/* What should I do today? section */}
      {actionPlan.length > 0 && (
        <div className="mb-6 bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4">
          <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2 text-sm uppercase">
            <AlertCircle className="w-4 h-4" />
            What should I do today?
          </h3>
          <div className="space-y-2">
            {actionPlan
              .filter(item => !completedIds.has(item.id) && (item.priority === 'URGENT' || item.priority === 'IMPORTANT'))
              .slice(0, 3)
              .map(item => (
                <div key={`today-${item.id}`} className="text-sm text-slate-200 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.priority === 'URGENT' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  {item.deadline && <span className="text-slate-400 text-xs">Deadline: {item.deadline}</span>}
                </div>
              ))}
            {actionPlan.filter(item => !completedIds.has(item.id) && (item.priority === 'URGENT' || item.priority === 'IMPORTANT')).length === 0 && (
              <p className="text-sm text-slate-400">No urgent or important tasks for today. Great job!</p>
            )}
          </div>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="space-y-4">
        {actionPlan.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800 border-dashed">
            No specific actions identified in this document.
          </div>
        ) : (
          actionPlan.map((item, index) => {
            const isCompleted = completedIds.has(item.id);
            return (
          <div
            key={item.id || index}
            className={`p-5 rounded-xl border shadow-lg transition-all hover:translate-x-1 ${getCardBorder(item.priority)} ${isCompleted ? 'opacity-60' : ''}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleCompletion(item.id)}
                  className="text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none"
                >
                  {isCompleted ? <CheckSquare className="w-6 h-6 text-emerald-500" /> : <Square className="w-6 h-6" />}
                </button>
                <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  {index + 1}
                </span>
                {getPriorityBadge(item.priority)}
              </div>

              {item.deadline && item.deadline !== 'N/A' && (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-slate-950/90 border border-slate-700/80 rounded-lg text-slate-300 self-start md:self-auto">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deadline: <strong className="text-white">{item.deadline}</strong></span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2 pl-1">
              {item.title}
            </h3>

            <div className="bg-slate-950/60 rounded-lg p-3 text-sm text-slate-300 border border-slate-800/60 mt-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block mb-0.5">
                Instructions:
              </span>
              <p className="mb-2">{item.instructions}</p>
              
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block mb-0.5">
                Why this action matters:
              </span>
              <p>{item.why}</p>
            </div>
          </div>
            );
          })
        )}
      </div>
    </div>
  );
}
