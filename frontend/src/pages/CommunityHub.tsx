import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Sparkles, BookOpen, Share2, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommunityHub: React.FC = () => {
  const [recommendedGroups, setRecommendedGroups] = useState<any[]>([]);

  useEffect(() => {
    // Mocking recommendation logic
    setRecommendedGroups([
      {
        id: 1,
        name: 'Transformer & LLM Scholars Group',
        members: 128,
        matchScore: 98,
        reason: 'Matches your recent uploads on Attention Mechanisms'
      },
      {
        id: 2,
        name: 'AI Agent Architecture',
        members: 64,
        matchScore: 85,
        reason: 'Recommended for "Developer" persona'
      }
    ]);
  }, []);

  const studyGroups = [
    {
      id: 1,
      name: 'Transformer & LLM Scholars Group',
      members: 128,
      notesCount: 42,
      podcastsCount: 5,
      desc: 'Active discussion group on self-attention mechanics, RoPE positional encodings, and KV-cache optimizations.'
    },
    {
      id: 3,
      name: 'Distributed Systems & Raft Consensus',
      members: 84,
      notesCount: 29,
      podcastsCount: 3,
      desc: 'Deep dives into Paxos vs Raft, leader election split-votes, and WAL log compaction.'
    },
    {
      id: 4,
      name: 'Computer Vision & ResNet Engineering',
      members: 96,
      notesCount: 18,
      podcastsCount: 4,
      desc: 'Exploring residual skip connections, vision transformers (ViT), and feature pyramid networks.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto transition-colors">
      
      {/* Header */}
      <div className="saas-panel p-8 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold border border-indigo-200 dark:border-indigo-800">
            <Users className="w-4 h-4" />
            <span>Scholar Community & Study Groups</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Peer Discussions & Shared Notes</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Connect with researchers, access faculty-reviewed notes, and participate in topic-based study groups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content (Left - 3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" /> Discover Active Groups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <div key={group.id} className="saas-card p-6 space-y-4 rounded-2xl flex flex-col justify-between hover:border-indigo-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-500 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge-accent text-xs">{group.members} Scholars</span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{group.notesCount} Shared Notes</span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug">{group.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{group.desc}</p>
                </div>

                <Link to={`/community/${group.id}`} className="btn-secondary dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 w-full text-center py-2.5 text-xs font-bold rounded-xl mt-2 block">
                  Join Study Group →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Recommended Groups (Right - 1 Column) */}
        <div className="space-y-6">
          <div className="saas-card p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border-indigo-100 dark:border-gray-700 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm flex items-center gap-2 text-indigo-900 dark:text-indigo-300 border-b border-indigo-100 dark:border-gray-700 pb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> AI Recommendations
            </h3>
            <div className="space-y-4">
              {recommendedGroups.map(rec => (
                <div key={rec.id} className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{rec.matchScore}% Match</span>
                    <span className="text-[10px] text-gray-500">{rec.members} Members</span>
                  </div>
                  <h4 className="font-bold text-xs">{rec.name}</h4>
                  <p className="text-[10px] text-gray-500 leading-snug">{rec.reason}</p>
                  <Link to={`/community/${rec.id}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 mt-1">
                    Join <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
