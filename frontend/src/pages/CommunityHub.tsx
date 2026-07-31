import React from 'react';
import { Users, MessageSquare, Sparkles, BookOpen, Share2 } from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const studyGroups = [
    {
      name: 'Transformer & LLM Scholars Group',
      members: 128,
      notesCount: 42,
      podcastsCount: 5,
      desc: 'Active discussion group on self-attention mechanics, RoPE positional encodings, and KV-cache optimizations.'
    },
    {
      name: 'Distributed Systems & Raft Consensus',
      members: 84,
      notesCount: 29,
      podcastsCount: 3,
      desc: 'Deep dives into Paxos vs Raft, leader election split-votes, and WAL log compaction.'
    },
    {
      name: 'Computer Vision & ResNet Engineering',
      members: 96,
      notesCount: 18,
      podcastsCount: 4,
      desc: 'Exploring residual skip connections, vision transformers (ViT), and feature pyramid networks.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 p-6 sm:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-8 bg-white border border-gray-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-200">
            <Users className="w-4 h-4" />
            <span>Scholar Community & Study Groups</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Peer Discussions & Shared Notes</h1>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Connect with researchers, access faculty-reviewed notes, and participate in topic-based study groups.
          </p>
        </div>
      </div>

      {/* Study Groups */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Study Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyGroups.map((group) => (
            <div key={group.name} className="saas-card p-6 space-y-4 rounded-2xl flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-accent text-xs">{group.members} Scholars</span>
                  <span className="text-xs text-indigo-600 font-semibold">{group.notesCount} Shared Notes</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-snug">{group.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{group.desc}</p>
              </div>

              <button className="btn-secondary w-full text-center py-2.5 text-xs font-bold rounded-xl mt-2">
                Join Study Group →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
