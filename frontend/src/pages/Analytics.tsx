import React, { useState, useEffect } from 'react';
import { Activity, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export const Analytics: React.FC = () => {
  const [learningDna, setLearningDna] = useState<any>(null);

  useEffect(() => {
    async function fetchDNA() {
      try {
        const res = await api.get('/learning-dna/');
        setLearningDna(res.data.learning_dna);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDNA();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      <div className="saas-panel p-6 bg-white border border-gray-200">
        <div className="space-y-1">
          <span className="badge-accent">Cognitive Twin Telemetry</span>
          <h1 className="h1-title text-2xl sm:text-3xl">Learning Analytics & Telemetry</h1>
          <p className="small-text">
            Track student retention velocity, memory decay parameters ($\lambda$), and active prerequisite gaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="saas-card p-6 space-y-2">
          <span className="small-text">Memory Decay Rate ($\lambda$)</span>
          <p className="text-3xl font-extrabold text-indigo-600">{(learningDna?.memory_decay_rate || 0.15) * 100}% <span className="text-xs text-gray-400 font-normal">/ day</span></p>
          <p className="text-[11px] text-gray-500">Calculated based on 30-day quiz performance</p>
        </div>

        <div className="saas-card p-6 space-y-2">
          <span className="small-text">Mastery Index</span>
          <p className="text-3xl font-extrabold text-gray-900">78.4%</p>
          <p className="text-[11px] text-emerald-600 font-medium">↑ +4.2% from last week</p>
        </div>

        <div className="saas-card p-6 space-y-2">
          <span className="small-text">Total Study Velocity</span>
          <p className="text-3xl font-extrabold text-gray-900">42.5 hrs</p>
          <p className="text-[11px] text-gray-500">Active study time recorded across sessions</p>
        </div>
      </div>

      <div className="saas-card p-6 space-y-4">
        <h2 className="h3-title">Prerequisite Gap Diagnostics</h2>
        <div className="p-4 rounded bg-amber-50 border border-amber-200 text-xs space-y-1">
          <p className="font-semibold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Active Misconception Alert: Recursion Call Stack
          </p>
          <p className="text-amber-800 leading-relaxed">
            Your Cognitive Twin detected confusion in stack frame unwinding during recursive calls. Review Recursion fundamentals before progressing to Dynamic Programming.
          </p>
        </div>
      </div>

    </div>
  );
};
