import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  FolderKanban, 
  BookOpen, 
  FileText, 
  Plus, 
  Upload as UploadIcon, 
  Search, 
  Clock, 
  CheckCircle2, 
  Brain, 
  Headphones, 
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { Upload } from './Upload';

export const MyResearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'projects';

  const projects: any[] = [];

  const workspaces: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 p-6 sm:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* 1. SYNCHRONIZED HEADER & PROFESSOR VOX CONTINUITY BANNER */}
      <div className="space-y-6">
        <div className="saas-panel p-8 bg-white border border-gray-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-200">
              <BookOpen className="w-4 h-4" />
              <span>Personal Learning Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Research</h1>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Your active research projects and workspaces. Continue learning where you left off.
            </p>
          </div>

          {/* Navigation Tab Pills */}
          <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/80 rounded-xl border border-gray-200/60 shrink-0">
            <button
              onClick={() => setSearchParams({ tab: 'projects' })}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'projects' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'workspaces' })}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'workspaces' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Workspaces ({workspaces.length})</span>
            </button>
          </div>
        </div>

        {/* Professor Vox Continuity Card */}
        {projects.length > 0 && (
          <div className="p-6 bg-indigo-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-indigo-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-800 border border-indigo-700 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">Professor Vox</span>
                <span className="badge-accent text-[10px] bg-indigo-800 text-indigo-200 border-indigo-700">Cognitive Twin</span>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed">
                Welcome back, Manikanth! In your <strong>Large Language Models Architecture Study</strong>, today's goal is <strong>Section 3.2: Multi-Head Attention</strong> (18 min).
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/workspace/transformer-1')}
            className="btn-primary bg-white text-indigo-950 hover:bg-gray-100 text-sm px-6 py-3 font-extrabold rounded-xl shrink-0 w-full md:w-auto text-center"
          >
            Continue Learning →
          </button>
        </div>
        )}
      </div>

      {/* 2. TAB 1: PROJECTS HUB (WORKSPACE PREVIEWS) */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Research Projects</h2>
              <p className="text-sm text-gray-600">Select a project to enter its workspace and continue your learning journey.</p>
            </div>
            <button
              onClick={() => navigate('/workspace/transformer-1')}
              className="btn-primary text-sm px-5 py-2.5 font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" /> New Research Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="saas-card p-6 space-y-5 rounded-2xl flex flex-col justify-between hover:border-indigo-400 transition-all bg-white border border-gray-200/80 shadow-xs">
                
                {/* Project Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-accent text-xs">{proj.category}</span>
                    <span className="text-xs text-gray-400 font-mono">{proj.lastActivity}</span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-xl leading-snug tracking-tight">{proj.title}</h3>
                  
                  {/* Rich Workspace Preview Box */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Paper</span>
                      <span className="font-bold text-gray-900 block line-clamp-1">{proj.currentPaper}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Today's Goal</span>
                      <span className="font-semibold text-gray-800 block line-clamp-1">{proj.todaysGoal}</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-500 pt-1 border-t border-gray-200/60 font-mono text-[11px]">
                      <span>Est. Read Time: {proj.readTime}</span>
                      <span className="font-bold text-indigo-600">{proj.progress}% Complete</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Outcome-Based Action Button */}
                <button
                  onClick={() => navigate(`/workspace/${proj.workspaceId}`)}
                  className="btn-primary w-full text-center py-3 text-xs font-bold rounded-xl"
                >
                  Resume Workspace →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB 2: WORKSPACES HUB */}
      {activeTab === 'workspaces' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Workspaces</h2>
              <p className="text-sm text-gray-600">Dedicated interactive study environments configured for specific learning goals.</p>
            </div>
            <button
              onClick={() => navigate('/workspace/transformer-1')}
              className="btn-primary text-sm px-5 py-2.5 font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" /> New Workspace
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <div key={ws.id} className="saas-card p-6 space-y-5 rounded-2xl flex flex-col justify-between hover:border-indigo-400 transition-all bg-white border border-gray-200/80 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-warning text-xs">{ws.template}</span>
                    <span className="text-xs text-indigo-600 font-semibold">{ws.lastActivity}</span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-lg leading-snug tracking-tight">{ws.title}</h3>
                  
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                    <p className="text-gray-500">Paper: <strong className="text-gray-900">{ws.currentPaper}</strong></p>
                    <p className="text-gray-500">Goal: <strong className="text-indigo-700">{ws.todaysGoal}</strong></p>
                    <p className="text-gray-400 text-[11px] font-mono">Read time remaining: {ws.readTime}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="btn-primary w-full text-center py-3 text-xs font-bold rounded-xl"
                >
                  Continue Learning →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
