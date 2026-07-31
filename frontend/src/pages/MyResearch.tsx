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
  Sparkles
} from 'lucide-react';
import { Upload } from './Upload';

export const MyResearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'projects';

  const projects = [
    {
      id: 'proj-1',
      title: 'Large Language Models Architecture Study',
      category: 'Artificial Intelligence',
      progress: 68,
      paperCount: 14,
      conceptCount: 128,
      noteCount: 52,
      updatedAt: '2 hours ago'
    },
    {
      id: 'proj-2',
      title: 'Distributed Consensus & Fault Tolerant Storage',
      category: 'Distributed Systems',
      progress: 82,
      paperCount: 8,
      conceptCount: 64,
      noteCount: 29,
      updatedAt: 'Yesterday'
    },
    {
      id: 'proj-3',
      title: 'Computer Vision & Deep Residual Networks',
      category: 'Computer Vision',
      progress: 45,
      paperCount: 6,
      conceptCount: 42,
      noteCount: 18,
      updatedAt: '3 days ago'
    }
  ];

  const workspaces = [
    {
      id: 'transformer-1',
      title: 'Transformer Architecture & Self-Attention Literature Review',
      template: 'Literature Review',
      papers: 3,
      progress: 68,
      lastSection: 'Section 3.2 Multi-Head Attention',
      readTime: 18,
      updatedAt: 'Active Session'
    },
    {
      id: 'resnet-2',
      title: 'ResNet Interview Preparation & Whiteboard Scenarios',
      template: 'Interview Prep',
      papers: 2,
      progress: 90,
      lastSection: 'Residual Connections & Gradient Vanishing',
      readTime: 12,
      updatedAt: '2 days ago'
    },
    {
      id: 'raft-3',
      title: 'Raft Consensus Algorithm Implementation Study',
      template: 'Implementation',
      papers: 4,
      progress: 55,
      lastSection: 'Leader Election & Heartbeat Timers',
      readTime: 25,
      updatedAt: '4 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 p-6 sm:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-8 bg-white border border-gray-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-200">
            <BookOpen className="w-4 h-4" />
            <span>Personal Knowledge Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Research Workspace Hub</h1>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Manage your long-term research projects, active study workspaces, and indexed document library in one place.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/80 rounded-xl border border-gray-200/60 shrink-0">
          <button
            onClick={() => setSearchParams({ tab: 'projects' })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'projects' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'workspaces' })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'workspaces' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Workspaces ({workspaces.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'library' })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'library' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROJECTS HUB */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Research Projects</h2>
              <p className="text-sm text-gray-600">High-level containers organizing multiple papers, notes, and workspaces.</p>
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
              <div key={proj.id} className="saas-card p-6 space-y-5 rounded-2xl flex flex-col justify-between hover:border-indigo-300 transition-all">
                <div className="space-y-3">
                  <span className="badge-accent text-xs">{proj.category}</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">{proj.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-700">
                    <div>
                      <span className="block text-gray-400 text-[10px] font-normal">Papers</span>
                      <span>{proj.paperCount}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[10px] font-normal">Concepts</span>
                      <span>{proj.conceptCount}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[10px] font-normal">Notes</span>
                      <span>{proj.noteCount}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>Overall Progress</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/workspace/transformer-1')}
                  className="btn-secondary w-full text-center py-2.5 text-xs font-bold rounded-xl mt-2"
                >
                  Open Project Workspace →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WORKSPACES HUB */}
      {activeTab === 'workspaces' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Active Workspaces</h2>
              <p className="text-sm text-gray-600">Interactive study environments configured with specific research templates.</p>
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
              <div key={ws.id} className="saas-card p-6 space-y-5 rounded-2xl flex flex-col justify-between hover:border-indigo-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge-warning text-xs">{ws.template}</span>
                    <span className="text-xs text-indigo-600 font-semibold">{ws.updatedAt}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug">{ws.title}</h3>
                  <p className="text-xs text-gray-500">Last Section: <strong className="text-gray-800">{ws.lastSection}</strong></p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span>📄 {ws.papers} Papers</span>
                    <span>⏱️ {ws.readTime} min read</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="btn-primary w-full text-center py-2.5 text-xs font-bold rounded-xl"
                >
                  Launch Studio →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIBRARY HUB */}
      {activeTab === 'library' && (
        <Upload />
      )}

    </div>
  );
};
