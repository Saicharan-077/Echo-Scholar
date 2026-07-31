import React, { useState } from 'react';
import { 
  Briefcase, 
  Code, 
  Cpu, 
  Database, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Play,
  FileText
} from 'lucide-react';

export const PlacementMode: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('System Design');
  const [inInterview, setInInterview] = useState(false);
  const [answerCode, setAnswerCode] = useState('');
  const [scorecard, setScorecard] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const categories = [
    { id: 'System Design', icon: Cpu, count: '24 Scenarios' },
    { id: 'Data Structures & Algo', icon: Code, count: '45 Problems' },
    { id: 'DBMS & SQL', icon: Database, count: '18 Queries' },
    { id: 'Operating Systems & CN', icon: Terminal, count: '15 Topics' },
  ];

  const handleEvaluate = () => {
    setEvaluating(true);
    setTimeout(() => {
      setScorecard({
        score: '92 / 100',
        verdict: 'Strong Hire',
        strengths: ['Correct cache eviction strategy (LRU)', 'Redis TTL configuration precision'],
        improvement: ['Mention write-through vs write-back database consistency trade-offs'],
      });
      setEvaluating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Technical Placement Hub • Whiteboard & Scorecards</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            Placement & Mock <span className="gradient-text">Interview Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate realistic technical interviews with AI audio scorecards and architectural evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            Average Interview Rating: <span className="text-white font-extrabold">8.8 / 10</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                  : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-6 h-6 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-[10px] font-bold bg-slate-900/80 px-2 py-0.5 rounded text-slate-400">{cat.count}</span>
              </div>
              <span className="font-bold text-xs">{cat.id}</span>
            </button>
          );
        })}
      </div>

      {/* Interview Question Workspace */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-6 border border-amber-500/20">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
              Mock Scenario #14
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Design a Distributed Multi-Tier Caching Layer for High-Traffic E-Commerce
            </h2>
          </div>

          <button
            onClick={() => setInInterview(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start AI Audio Interview</span>
          </button>
        </div>

        {/* Whiteboard / Solution Editor */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Whiteboard Solution & Code Explanation</span>
            <span className="text-[10px] text-slate-500">Supports Markdown / Python / SQL / Architecture text</span>
          </label>

          <textarea
            value={answerCode}
            onChange={(e) => setAnswerCode(e.target.value)}
            placeholder="Write your system design architecture breakdown here... e.g. L1 Local Memory Cache (Guava) -> L2 Distributed Redis Cluster -> L3 Read Replicas (PostgreSQL)..."
            className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
          />

          <div className="flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={evaluating || !answerCode}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {evaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
                  <span>Evaluating Architecture...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-purple-300" />
                  <span>Submit for AI Interview Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Scorecard Modal */}
        {scorecard && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900/80 border border-emerald-500/40 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">AI Mock Interview Scorecard</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Verdict:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/40">
                  {scorecard.verdict}
                </span>
                <span className="text-lg font-extrabold text-emerald-400">{scorecard.score}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400">Key Architectural Strengths:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {scorecard.strengths.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">Suggested Enhancements:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {scorecard.improvement.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
