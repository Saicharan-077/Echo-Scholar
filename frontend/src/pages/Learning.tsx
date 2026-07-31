import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Layers, 
  Headphones, 
  HelpCircle, 
  Target, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../shared/ui/Badge';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';

export const Learning: React.FC = () => {
  const navigate = useNavigate();

  const activeSessions = [
    {
      id: 'transformer-1',
      title: 'Attention Is All You Need — Transformer Architecture',
      category: 'Artificial Intelligence & Deep Learning',
      progress: 72,
      lastStudied: '10 mins ago',
      currentSection: 'Section 2: Key Vector Chunks & Scaled Dot-Product Attention',
      totalChunks: 38,
      readChunks: 27,
      route: '/workspace/transformer-1',
      badge: 'Active Workstation'
    },
    {
      id: 'resnet-2',
      title: 'Deep Residual Learning for Image Recognition (ResNet)',
      category: 'Computer Vision & Convolutional Nets',
      progress: 45,
      lastStudied: '2 hours ago',
      currentSection: 'Section 1: Residual Mapping & Degenerate Identity Functions',
      totalChunks: 42,
      readChunks: 19,
      route: '/workspace/resnet-2',
      badge: 'In Progress'
    },
    {
      id: 'raft-3',
      title: 'Raft Consensus Algorithm for Fault-Tolerant Systems',
      category: 'Distributed Systems & Databases',
      progress: 90,
      lastStudied: 'Yesterday',
      currentSection: 'Section 4: Log Compaction & Snapshotting',
      totalChunks: 30,
      readChunks: 27,
      route: '/workspace/raft-3',
      badge: 'Near Mastery'
    }
  ];

  const timelineSteps = [
    {
      step: 1,
      title: 'Executive Summary & Core Abstract',
      status: 'completed',
      desc: 'High-level synthesis of self-attention mechanisms replacing recurrence.'
    },
    {
      step: 2,
      title: 'Vector Chunk Extracts & Key Findings',
      status: 'active',
      desc: 'Deep dive into Scaled Dot-Product, Positional Encodings, and Multi-Head projections.'
    },
    {
      step: 3,
      title: 'Interactive Knowledge Graph & Concept Map',
      status: 'upcoming',
      desc: 'Visual DAG tree mapping term dependencies and prerequisites.'
    },
    {
      step: 4,
      title: 'Socratic Active Recall Quiz & Mastery Check',
      status: 'upcoming',
      desc: 'Adaptive assessment evaluating formula retention and structural design.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 font-sans space-y-12 pb-24">
      
      {/* 1. HERO SECTION (Synchronized with Discover & Landing Page Template) */}
      <section className="bg-gradient-to-b from-indigo-50/60 via-white to-gray-50/60 border-b border-gray-200/80 py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="accent">Continuous Learning Studio</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                Resume Active Workspaces
              </h1>
              <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
                Continue your active paper reader workstations, interactive quizzes, and audio overviews right where you left off.
              </p>
            </div>

            <Button variant="primary" size="lg" onClick={() => navigate('/upload')}>
              <BookOpen className="w-4 h-4" />
              <span>Upload New Paper</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. HERO PRIORITY ACTIVE WORKSPACE CARD */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="badge-accent text-xs px-3 py-1 font-semibold">
              🔥 Active Workstation
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Last active 10 minutes ago</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {activeSessions[0].category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {activeSessions[0].title}
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
              <Target className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Current Focus: {activeSessions[0].currentSection}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-700">Overall Mastery Progress</span>
              <span className="text-indigo-600 font-extrabold">{activeSessions[0].progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200/60">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${activeSessions[0].progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <span>{activeSessions[0].readChunks} of {activeSessions[0].totalChunks} Vector Chunks Processed</span>
              <span>Target Score: 90%+</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <Link to={activeSessions[0].route} className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xs">
              <Play className="w-4 h-4 fill-white" /> Resume Workspace Reader
            </Link>
            <Link to="/quiz" className="btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Take Concept Quiz
            </Link>
            <Link to="/podcasts" className="btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-600" /> Audio Overview
            </Link>
            <Link to="/graph" className="btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Mind Map
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TIMELINE & RECENT WORKSPACES GRID */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Learning Milestone Timeline */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Milestone Timeline</h3>
            <span className="text-xs font-bold text-indigo-600">2 / 4 Completed</span>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            {timelineSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  step.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : step.status === 'active'
                    ? 'bg-indigo-600 text-white shadow-xs ring-4 ring-indigo-100'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                </div>
                <div className="space-y-1 pt-0.5">
                  <h4 className={`text-sm font-bold ${step.status === 'active' ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Other Active Learning Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Active Study Workspaces</h3>
            <Link to="/research" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All Papers <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeSessions.slice(1).map((s) => (
              <div 
                key={s.id}
                className="bg-white border border-gray-200/80 hover:border-indigo-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge-neutral text-[11px] font-semibold">{s.badge}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{s.lastStudied}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium line-clamp-1">{s.category}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-gray-600">
                      <span>Progress</span>
                      <span className="text-indigo-600 font-bold">{s.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${s.progress}%` }}></div>
                    </div>
                  </div>

                  <Link 
                    to={s.route} 
                    className="btn-secondary w-full py-2.5 text-xs font-bold flex justify-center items-center gap-2 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-700 transition-colors"
                  >
                    Resume Study Session <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

    </div>
  );
};
export default Learning;
