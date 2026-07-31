import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Flame, 
  Zap, 
  Headphones, 
  Mic, 
  Network, 
  Briefcase, 
  AlertTriangle, 
  ArrowRight,
  Activity,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const [learningDna, setLearningDna] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDNA() {
      try {
        const res = await api.get('/learning-dna/');
        setLearningDna(res.data.learning_dna);
      } catch (err) {
        console.error('Failed to fetch DNA:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDNA();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Title & Header */}
      <div className="saas-panel p-6 sm:p-8 bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
            <span>Cognitive Twin System</span>
            <span>•</span>
            <span className="font-semibold">Enterprise Active Session</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">Command Center Dashboard</h1>
          <p className="small-text">
            Real-time memory decay tracking, concept prerequisite DAG maps, and adaptive quiz diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/upload" className="btn-primary text-xs">
            <span>Upload Research Paper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid Row 1: Cognitive DNA & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cognitive DNA Panel */}
        <div className="saas-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h2 className="h3-title">Cognitive Twin Profile</h2>
            </div>
            <span className="badge-accent">Live Sync</span>
          </div>

          {loading ? (
            <div className="small-text py-4">Syncing profile metrics...</div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-200">
                <span className="text-gray-600">Explanation Style</span>
                <span className="font-semibold text-gray-900">{learningDna?.explanation_style || 'Analogy-Based'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-200">
                <span className="text-gray-600">Vernacular Language</span>
                <span className="font-semibold text-gray-900">{learningDna?.preferred_language || 'Teluglish'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-200">
                <span className="text-gray-600">Memory Decay Rate ($\lambda$)</span>
                <span className="font-semibold text-indigo-600">{(learningDna?.memory_decay_rate || 0.15) * 100}% / day</span>
              </div>

              {/* Warning Alert */}
              <div className="p-3 rounded bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Prerequisite Gap Warning</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Prerequisite gap detected in <strong>Recursion call stack</strong> before Dynamic Programming.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 30-Day Learning Velocity Heatmap */}
        <div className="lg:col-span-2 saas-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h2 className="h3-title">30-Day Study Velocity Heatmap</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-gray-200"></div> Low</span>
              <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-indigo-600"></div> High</span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 py-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const intensity = [0, 1, 2, 3, 2, 4, 3, 1, 4, 2, 0, 3, 4, 2, 1, 3, 4, 2, 4, 3, 1, 2, 3, 4, 2, 3, 4, 1, 2, 4][i];
              const styles = [
                'bg-gray-100 text-gray-500 border-gray-200',
                'bg-indigo-50 text-indigo-700 border-indigo-200',
                'bg-indigo-100 text-indigo-800 border-indigo-300 font-medium',
                'bg-indigo-600 text-white font-semibold',
                'bg-indigo-800 text-white font-bold',
              ];
              return (
                <div
                  key={i}
                  className={`h-8 rounded border flex items-center justify-center text-[10px] ${styles[intensity]}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded bg-gray-50 border border-gray-200 text-center">
              <span className="text-[11px] text-gray-500">Total Study Time</span>
              <p className="text-lg font-bold text-gray-900">42.5 hrs</p>
            </div>
            <div className="p-3 rounded bg-gray-50 border border-gray-200 text-center">
              <span className="text-[11px] text-gray-500">Mastery Index</span>
              <p className="text-lg font-bold text-indigo-600">78.4%</p>
            </div>
            <div className="p-3 rounded bg-gray-50 border border-gray-200 text-center">
              <span className="text-[11px] text-gray-500">Scholar Level</span>
              <p className="text-lg font-bold text-gray-900">Level 4</p>
            </div>
          </div>
        </div>

      </div>

      {/* Core Action Modules */}
      <div className="space-y-4">
        <h2 className="h2-title text-xl">Core Learning Engines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link to="/podcasts" className="saas-card p-5 space-y-3 hover:border-indigo-400 group transition-all">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm flex items-center justify-between">
                <span>Interruptible Podcast</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Dual AI co-hosts with real-time speech interruption.</p>
            </div>
          </Link>

          <Link to="/professor" className="saas-card p-5 space-y-3 hover:border-indigo-400 group transition-all">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm flex items-center justify-between">
                <span>Voice Professor</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Socratic speech classroom in Teluglish / Hinglish.</p>
            </div>
          </Link>

          <Link to="/graph" className="saas-card p-5 space-y-3 hover:border-indigo-400 group transition-all">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm flex items-center justify-between">
                <span>Concept DAG Tree</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Interactive prerequisite tree with RED gap alerts.</p>
            </div>
          </Link>

          <Link to="/placement" className="saas-card p-5 space-y-3 hover:border-indigo-400 group transition-all">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm flex items-center justify-between">
                <span>Placement Mode</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Whiteboard interview practice & AI scorecards.</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
};
