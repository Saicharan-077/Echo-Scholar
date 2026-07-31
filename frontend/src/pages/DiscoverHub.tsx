import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Clock 
} from 'lucide-react';

import { SearchHero } from '../features/discover/components/SearchHero';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import { useAuth } from '../hooks/useAuth';

interface DiscoverHubProps {
  onOpenSearch?: () => void;
}

export const DiscoverHub: React.FC<DiscoverHubProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const [topicQuery, setTopicQuery] = useState('');
  const { user } = useAuth();
  
  const userName = user?.full_name?.split(' ')[0] || user?.username || 'Scholar';

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
      action: () => navigate('/research'),
      badge: 'arXiv & IEEE Ingestion'
    },
    {
      title: 'Upload Your Own Paper',
      desc: 'Import PDFs, DOCX, or PPTX to generate RAG vector embeddings.',
      icon: Upload,
      action: () => navigate('/upload'),
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicQuery.trim()) {
      navigate('/workspace/transformer-1');
    } else if (onOpenSearch) {
      onOpenSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 font-sans space-y-16 pb-24">
      
      {/* 1. HERO SEARCH & GREETING */}
      <SearchHero
        userName={userName}
        topicQuery={topicQuery}
        onQueryChange={setTopicQuery}
        onSubmit={handleSearchSubmit}
        onOpenSearch={onOpenSearch}
        popularTopics={popularTopics}
        onSelectTopic={(t) => {
          setTopicQuery(t);
          navigate('/workspace/transformer-1');
        }}
      />

      {/* 2. START LEARNING WORKFLOW CARDS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div>
            <Badge variant="accent">Start Learning Workflow</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Choose How You Want to Learn Today</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {startLearningCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                variant="interactive"
                onClick={card.action}
                className="space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="accent" size="sm">{card.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
                      <span>{card.title}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">{card.desc}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                  <span>Launch Workspace</span>
                  <span>→</span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. RESUME ACTIVE SESSION & AI RECOMMENDATIONS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Session Card */}
        <Card variant="default" className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="warning">Active Session • 68% Completed</Badge>
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

            <Link to="/workspace/transformer-1">
              <Button variant="primary" size="md">
                Resume Workspace →
              </Button>
            </Link>
          </div>
        </Card>

        {/* AI Knowledge Gap Radar Card */}
        <div className="p-8 bg-indigo-950 text-white rounded-2xl space-y-6 flex flex-col justify-between shadow-md">
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

          <Link to="/workspace/transformer-1">
            <Button variant="secondary" fullWidth className="bg-white text-indigo-950 hover:bg-gray-100 border-none font-bold">
              Review 5-Min Prerequisite Recap →
            </Button>
          </Link>
        </div>

      </section>

    </div>
  );
};
