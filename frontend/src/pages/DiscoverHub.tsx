import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Command, 
  BookOpen, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Layers,
  HelpCircle,
  FolderKanban,
  FileText
} from 'lucide-react';

interface DiscoverHubProps {
  onOpenSearch?: () => void;
}

export const DiscoverHub: React.FC<DiscoverHubProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const [topicQuery, setTopicQuery] = useState('');

  const userName = localStorage.getItem('user_name') || 'Manikanth';

  const startLearningCards = [
    {
      title: 'Start with a Topic',
      desc: 'Pick an academic domain (e.g. Transformers, System Design, Raft Consensus).',
      icon: Sparkles,
      action: () => navigate('/workspace/transformer-1'),
      badge: 'Interactive AI Roadmap'
    },
    {
      title: 'Search Research Papers',
      desc: 'Explore indexed papers from arXiv, CVPR, NeurIPS, and IEEE.',
      icon: Search,
      action: () => navigate('/research?tab=library'),
      badge: 'arXiv & IEEE Ingestion'
    },
    {
      title: 'Upload Your Own Paper',
      desc: 'Import PDFs, DOCX, or PPTX to generate RAG vector embeddings.',
      icon: Upload,
      action: () => navigate('/research?tab=library&sub=upload'),
      badge: 'PDF Vector Store'
    },
    {
      title: 'Continue Previous Session',
      desc: 'Resume your active workspace: Attention Is All You Need (68% complete).',
      icon: Clock,
      action: () => navigate('/workspace/transformer-1'),
      badge: 'Resume Learning'
    }
  ];

  const popularTopics = [
    'Transformers & LLMs',
    'Deep Residual Networks (ResNet)',
    'Raft Distributed Consensus',
    'System Design & Caching',
    'Self-Attention Mechanics',
    'Database Sharding'
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 font-sans space-y-16 pb-24">
      
      {/* 1. HERO SEARCH & GREETING */}
      <section className="bg-white border-b border-gray-200/80 py-16 lg:py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>EchoScholar AI — Research & Learning Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Good Afternoon, <span className="text-indigo-600">{userName}</span>.<br />
            How can I help you learn today?
          </h1>

          {/* Real Interactive Search Bar Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (topicQuery.trim()) {
                navigate(`/workspace/transformer-1`);
              } else if (onOpenSearch) {
                onOpenSearch();
              }
            }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="w-full bg-white border-2 border-indigo-200 focus-within:border-indigo-600 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-3 transition-all">
              <Search className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
              <input
                type="text"
                value={topicQuery}
                onChange={(e) => setTopicQuery(e.target.value)}
                placeholder="Search topics, research papers (e.g. 'Transformers')..."
                className="w-full bg-transparent text-base text-gray-900 font-medium outline-none placeholder:text-gray-400"
              />
              <kbd 
                onClick={onOpenSearch}
                className="hidden sm:inline-flex items-center gap-1 font-semibold text-xs text-gray-400 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer shrink-0 transition-colors"
                title="Open Spotlight Search"
              >
                Cmd + K
              </kbd>
              <button 
                type="submit" 
                className="btn-primary text-xs px-5 py-2.5 font-semibold rounded-xl shrink-0 cursor-pointer"
              >
                Search →
              </button>
            </div>
          </form>

          {/* Popular Topic Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-2">Popular:</span>
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setTopicQuery(topic);
                  navigate('/workspace/transformer-1');
                }}
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent text-xs font-medium text-gray-600 transition-all cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. START LEARNING WORKFLOW CARDS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div>
            <span className="badge-accent text-xs">Start Learning Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Choose How You Want to Learn Today</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {startLearningCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={card.action}
                className="text-left saas-card p-6 space-y-4 rounded-2xl hover:border-indigo-400 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="badge-accent text-[11px] px-2 py-0.5">{card.badge}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{card.title}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">{card.desc}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                  <span>Launch Workspace</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. RESUME ACTIVE SESSION & AI RECOMMENDATIONS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Session Card */}
        <div className="lg:col-span-2 saas-panel p-8 bg-white border border-gray-200/80 rounded-2xl space-y-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="badge-warning text-xs">Active Session • 68% Completed</span>
              <span className="text-xs text-gray-400 font-mono">Last studied: Yesterday</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">Attention Is All You Need — Transformer Architecture</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                You stopped on **Section 3.2: Multi-Head Attention**. Professor Vox suggests reviewing self-attention matrix formulas next.
              </p>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '68%' }} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
              <span>📄 48 Chunks</span>
              <span>🎧 14-min Podcast Ready</span>
              <span>🎯 3 Quizzes Passed</span>
            </div>

            <Link to="/workspace/transformer-1" className="btn-primary text-sm px-6 py-2.5 font-semibold rounded-xl w-full sm:w-auto text-center">
              Resume Workspace →
            </Link>
          </div>
        </div>

        {/* AI Knowledge Gap Radar Card */}
        <div className="saas-card p-8 bg-indigo-950 text-white rounded-2xl space-y-6 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Cognitive Twin Radar</span>
            </div>

            <h3 className="text-xl font-bold text-white">Active Prerequisite Warning</h3>
            
            <div className="p-4 rounded-xl bg-indigo-900/80 border border-indigo-800 space-y-2 text-xs text-indigo-200">
              <p className="font-semibold text-white">Detected Gap: Encoder-Decoder Attention</p>
              <p>Your learning history shows a 45% score on cross-attention matrix scaling.</p>
            </div>
          </div>

          <Link to="/workspace/transformer-1" className="btn-primary bg-white text-indigo-950 hover:bg-gray-100 text-xs px-4 py-2.5 font-bold rounded-xl text-center">
            Review 5-Min Prerequisite Recap →
          </Link>
        </div>

      </section>

    </div>
  );
};
