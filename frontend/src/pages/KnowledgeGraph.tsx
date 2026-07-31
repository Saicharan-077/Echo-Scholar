import React, { useState } from 'react';
import { 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Info
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Prerequisite DAG Visualizer • Gap Radar</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">Concept Dependency Knowledge Graph</h1>
          <p className="small-text mt-1">
            Parses documents into directed prerequisite trees to identify hidden learning bottlenecks.
          </p>
        </div>

        <button className="btn-secondary text-xs">
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          <span>Re-calculate Prerequisite DAG</span>
        </button>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Canvas Representation */}
        <div className="lg:col-span-2 saas-card p-6 border border-gray-200 relative min-h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="h3-title text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Prerequisite Concept Tree</span>
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Mastered
              </span>
              <span className="flex items-center gap-1.5 text-red-700 font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Prerequisite Gap
              </span>
            </div>
          </div>

          {/* Connected Node Tree */}
          <div className="py-8 flex flex-col items-center gap-6">
            
            {/* Level 1 Node */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedNode('Basic Math & Logic')}
                className="p-3 px-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium text-xs flex items-center gap-2 shadow-sm hover:border-emerald-400 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Basic Math & Logic (95%)</span>
              </button>
            </div>

            <div className="h-6 w-0.5 bg-gray-300"></div>

            {/* Level 2 Node (RED GAP ALERT) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedNode('Recursion & Call Stack')}
                className="p-3 px-6 rounded-lg bg-red-50 border-2 border-red-500 text-red-900 font-semibold text-xs flex items-center gap-2 shadow-sm hover:bg-red-100 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>⚠️ Prerequisite Gap: Recursion & Call Stack (52%)</span>
              </button>
            </div>

            <div className="h-6 w-0.5 bg-gray-300"></div>

            {/* Level 3 Nodes */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSelectedNode('Memoization')}
                className="p-3 px-5 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium text-xs flex items-center gap-2 shadow-sm hover:border-indigo-400 transition-colors"
              >
                <span>Memoization (68%)</span>
              </button>
              
              <button
                onClick={() => setSelectedNode('Dynamic Programming')}
                className="p-3 px-5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold text-xs flex items-center gap-2 shadow-sm hover:border-indigo-400 transition-colors"
              >
                <span>Dynamic Programming (45%)</span>
              </button>
            </div>

          </div>

          <div className="p-3 rounded bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Info className="w-4 h-4 text-gray-400" /> Click any node to inspect Cognitive Twin gap analysis</span>
            <span className="font-semibold text-indigo-600">5 Nodes Connected</span>
          </div>

        </div>

        {/* Node Detail Inspector */}
        <div className="space-y-6">
          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="badge-accent">Node Inspector</span>
              <span className="text-xs text-gray-400 font-mono">ID: node_dp_01</span>
            </div>

            <div>
              <h3 className="h3-title text-base">{selectedNode}</h3>
              <p className="small-text mt-0.5">Cognitive Twin gap score & roadmap status</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-gray-600 font-medium">Concept Benchmark</span>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-indigo-600 h-full w-[52%]"></div>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span>52% Mastery</span>
                  <span className="text-red-600 font-semibold">Needs Review</span>
                </div>
              </div>

              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1 text-red-700">
                  <AlertTriangle className="w-3.5 h-3.5" /> AI Prerequisite Recommendation
                </p>
                <p className="text-[11px] leading-relaxed">
                  Before tackling Dynamic Programming, complete 3 practice quizzes on <strong>Recursion call stack frames</strong> to bridge your gap.
                </p>
              </div>
            </div>

            <button className="btn-primary w-full text-xs">
              Generate Remedial Micro-Quiz ▶
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
