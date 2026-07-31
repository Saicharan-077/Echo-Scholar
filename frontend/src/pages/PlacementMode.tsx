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
  Play
} from 'lucide-react';

export const PlacementMode: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('System Design');
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Technical Placement Hub • Whiteboard & Scorecards</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">Placement & Technical Interview Simulator</h1>
          <p className="small-text mt-1">
            Simulate realistic technical interviews with AI audio scorecards and architectural evaluation.
          </p>
        </div>

        <div className="p-2.5 px-4 rounded bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold">
          Average Interview Rating: <span className="font-extrabold text-indigo-700">8.8 / 10</span>
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
              className={`p-4 rounded-lg border text-left transition-colors flex flex-col justify-between space-y-3 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="text-[10px] font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-500">{cat.count}</span>
              </div>
              <span className="font-semibold text-xs">{cat.id}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Card */}
      <div className="saas-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="badge-accent">Scenario #14</span>
            <h2 className="h3-title text-base mt-1">
              Design a Distributed Multi-Tier Caching Layer for High-Traffic E-Commerce
            </h2>
          </div>

          <button className="btn-primary text-xs">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Audio Interview</span>
          </button>
        </div>

        {/* Editor */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
            <span>Whiteboard Solution & Architecture Explanation</span>
            <span className="text-[10px] text-gray-400">Markdown / System Architecture text</span>
          </label>

          <textarea
            value={answerCode}
            onChange={(e) => setAnswerCode(e.target.value)}
            placeholder="Write your system design breakdown here... e.g. L1 Local Memory Cache (Guava) -> L2 Distributed Redis Cluster -> L3 Read Replicas (PostgreSQL)..."
            className="saas-input w-full h-40 font-mono text-xs text-gray-900"
          />

          <div className="flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={evaluating || !answerCode}
              className="btn-primary text-xs"
            >
              {evaluating ? 'Evaluating Architecture...' : 'Submit for AI Scorecard'}
            </button>
          </div>
        </div>

        {/* Scorecard Modal */}
        {scorecard && (
          <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="h3-title text-emerald-900 text-base">AI Mock Interview Scorecard</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-accent">{scorecard.verdict}</span>
                <span className="text-lg font-extrabold text-emerald-800">{scorecard.score}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-white border border-emerald-200 space-y-2">
                <span className="font-semibold text-emerald-900">Key Architectural Strengths:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {scorecard.strengths.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded bg-white border border-emerald-200 space-y-2">
                <span className="font-semibold text-amber-900">Suggested Enhancements:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
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
