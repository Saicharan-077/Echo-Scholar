import React, { useState } from 'react';
import { 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Layers, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const KnowledgeGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('Dynamic Programming');

  const nodes = [
    { id: 'Basic Math & Logic', status: 'mastered', score: '95%', level: 'Prerequisite' },
    { id: 'Recursion & Call Stack', status: 'gap', score: '52%', level: 'Prerequisite Gap Warning' },
    { id: 'Memoization', status: 'learning', score: '68%', level: 'Core Concept' },
    { id: 'Dynamic Programming', status: 'target', score: '45%', level: 'Target Weakness' },
    { id: 'System Design Caching', status: 'locked', score: '30%', level: 'Advanced' },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Prerequisite DAG Visualizer • Live Red-Flag Radar</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            Concept Dependency <span className="gradient-text">Knowledge Graph</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maps paper concepts into directed prerequisite dependency trees to identify hidden learning bottlenecks.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-calculate Prerequisite DAG</span>
        </button>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Graph Canvas Representation */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 lg:p-8 border border-indigo-500/20 relative min-h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Interactive Concept Dependency Tree</span>
            </h3>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Mastered
              </span>
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div> Prerequisite Gap
              </span>
            </div>
          </div>

          {/* Connected Node Tree */}
          <div className="py-8 flex flex-col items-center gap-6">
            
            {/* Level 1 Node */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedNode('Basic Math & Logic')}
                className="p-3 px-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Basic Math & Logic (95%)</span>
              </button>
            </div>

            <div className="h-6 w-0.5 bg-slate-700"></div>

            {/* Level 2 Node (RED GAP ALERT) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedNode('Recursion & Call Stack')}
                className="p-3 px-6 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-200 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-red-500/20 animate-pulse hover:scale-105 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>⚠️ Prerequisite Gap: Recursion & Call Stack (52%)</span>
              </button>
            </div>

            <div className="h-6 w-0.5 bg-slate-700"></div>

            {/* Level 3 Nodes */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSelectedNode('Memoization')}
                className="p-3 px-5 rounded-2xl bg-purple-500/10 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Memoization (68%)</span>
              </button>
              
              <button
                onClick={() => setSelectedNode('Dynamic Programming')}
                className="p-3 px-5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all"
              >
                <span>Dynamic Programming (45%)</span>
              </button>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>💡 Click any node on the tree to inspect Cognitive Twin gap analysis</span>
            <span className="text-indigo-400 font-semibold">5 Connected Nodes</span>
          </div>

        </div>

        {/* Node Detail Inspector */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                Node Inspector
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: node_dp_01</span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">{selectedNode}</h3>
              <p className="text-xs text-slate-400 mt-1">Cognitive Twin gap score & roadmap status</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Current Concept Mastery</span>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full w-[52%]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>52% Benchmark</span>
                  <span className="text-red-400 font-bold">Needs Review</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1 text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> AI Prerequisite Recommendation
                </p>
                <p className="text-[11px] leading-relaxed">
                  Before tackling Dynamic Programming, complete 3 practice quizzes on <strong>Recursion call stack frames</strong> to bridge your gap.
                </p>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md">
              Generate Remedial Micro-Quiz ▶
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
