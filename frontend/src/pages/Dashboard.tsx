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
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight,
  Sparkles,
  Activity,
  BookOpen,
  Compass,
  Sliders,
  Sparkle
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
    <div className="min-h-screen bg-black text-slate-100 p-4 lg:p-8 space-y-8 max-w-7xl mx-auto pt-6">
      
      {/* Apple Vision Pro Style Hero Header */}
      <div className="relative overflow-hidden rounded-3xl apple-glass p-8 lg:p-10 border border-white/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Designed by Apple Developer Guidelines • Cognitive Twin System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Welcome to <span className="apple-purple-gradient">EchoScholar X</span>
          </h1>

          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Your persistent Cognitive Twin continuously recalculates memory decay rates, vernacular explanation preferences, and prerequisite DAG concept maps.
          </p>
        </div>
      </div>

      {/* Grid Layout: Apple Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Cognitive Twin Profile Card */}
        <div className="apple-card rounded-3xl p-6 space-y-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Brain className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-white">Cognitive DNA</h2>
            </div>
            <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              Live Sync
            </span>
          </div>

          {loading ? (
            <div className="text-xs text-slate-400 py-4">Syncing Cognitive Twin profile...</div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 font-medium">Explanation Style</span>
                <span className="text-purple-300 font-semibold">{learningDna?.explanation_style || 'Analogy-Based'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 font-medium">Vernacular Preference</span>
                <span className="text-cyan-300 font-semibold">{learningDna?.preferred_language || 'Teluglish'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 font-medium">Memory Decay Rate</span>
                <span className="text-amber-300 font-semibold">{(learningDna?.memory_decay_rate || 0.15) * 100}% / day</span>
              </div>

              {/* Warning Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Prerequisite Gap Alert</span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Prerequisite gap detected in <strong>Recursion call stack</strong> before Dynamic Programming.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Widget 2: 30-Day Activity Heatmap */}
        <div className="lg:col-span-2 apple-card rounded-3xl p-6 lg:p-8 space-y-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-white">Learning Velocity Grid</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Past 30 Days</span>
          </div>

          <div className="grid grid-cols-10 gap-2 py-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const intensity = [0, 1, 2, 3, 2, 4, 3, 1, 4, 2, 0, 3, 4, 2, 1, 3, 4, 2, 4, 3, 1, 2, 3, 4, 2, 3, 4, 1, 2, 4][i];
              const styles = [
                'bg-white/5 border-white/5',
                'bg-purple-950/60 border-purple-800/40 text-purple-200',
                'bg-purple-700/60 border-purple-500/40 text-white',
                'bg-purple-500 border-purple-400 text-white shadow-md shadow-purple-500/30',
                'bg-cyan-400 border-cyan-300 text-black font-extrabold shadow-lg shadow-cyan-400/40',
              ];
              return (
                <div
                  key={i}
                  className={`h-9 rounded-xl border flex items-center justify-center text-[10px] transition-all apple-btn ${styles[intensity]}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Total Study Time</span>
              <p className="text-xl font-extrabold text-purple-300">42.5 hrs</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Mastery Index</span>
              <p className="text-xl font-extrabold text-cyan-300">78.4%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Current Scholar Level</span>
              <p className="text-xl font-extrabold text-amber-300">Level 4</p>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <span>Core Interactive Learning Modules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <Link
            to="/podcasts"
            className="apple-card rounded-3xl p-6 space-y-4 border border-white/10 group apple-btn"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                <span>Interruptible Podcast</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Dual AI co-hosts with real-time speech interruption.</p>
            </div>
          </Link>

          <Link
            to="/professor"
            className="apple-card rounded-3xl p-6 space-y-4 border border-white/10 group apple-btn"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                <span>Voice Professor</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Socratic speech classroom in Teluglish/Hinglish.</p>
            </div>
          </Link>

          <Link
            to="/graph"
            className="apple-card rounded-3xl p-6 space-y-4 border border-white/10 group apple-btn"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                <span>Concept DAG Tree</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Interactive prerequisite tree with RED gap alerts.</p>
            </div>
          </Link>

          <Link
            to="/placement"
            className="apple-card rounded-3xl p-6 space-y-4 border border-white/10 group apple-btn"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                <span>Placement Simulator</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Whiteboard interview scenarios & AI scorecards.</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
};
