import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Pin, 
  FileText, 
  Brain,
  ChevronLeft,
  Send
} from 'lucide-react';

export const CommunityGroupDetail: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'discussions' | 'resources' | 'quizzes'>('discussions');

  // Mock Data
  const group = {
    name: 'Transformer & LLM Scholars Group',
    desc: 'Active discussion group on self-attention mechanics, RoPE positional encodings, and KV-cache optimizations.',
    members: 128,
    activeNow: 14,
    tags: ['Machine Learning', 'NLP', 'Transformers']
  };

  const discussions = [
    { id: 1, author: 'Ananya S.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80', content: 'Has anyone figured out how rotary embeddings differ from absolute embeddings intuitively?', time: '2h ago', replies: 4 },
    { id: 2, author: 'Vikram', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&q=80', content: 'Sharing my mind map on the original Attention is All You Need paper!', time: '5h ago', replies: 12 }
  ];

  const resources = [
    { id: 1, title: 'Attention Mechanism Explained', type: 'Shared Note', author: 'Dr. Neerja' },
    { id: 2, title: 'KV Cache Implementation Guide', type: 'PDF Summary', author: 'System' }
  ];

  const quizzes = [
    { id: 1, title: 'Self-Attention Math Quiz', questions: 10, participants: 45 },
    { id: 2, title: 'Transformers Architecture Basics', questions: 15, participants: 82 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto transition-colors">
      
      <Link to="/community" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
        <ChevronLeft className="w-4 h-4" /> Back to Community Hub
      </Link>

      {/* Group Header */}
      <div className="saas-panel p-6 sm:p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col md:flex-row justify-between gap-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {group.tags.map(tag => (
              <span key={tag} className="badge-accent text-[10px] uppercase tracking-widest">{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{group.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">{group.desc}</p>
          
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {group.members} Members</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> {group.activeNow} Active Now</span>
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          <button className="btn-primary px-6 py-2.5 rounded-xl shadow-sm text-sm font-semibold">Join Study Session</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 pb-px">
        <button onClick={() => setActiveTab('discussions')} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'discussions' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <MessageSquare className="w-4 h-4 inline-block mr-2" /> Discussions
        </button>
        <button onClick={() => setActiveTab('resources')} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'resources' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <Pin className="w-4 h-4 inline-block mr-2" /> Pinned Resources
        </button>
        <button onClick={() => setActiveTab('quizzes')} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'quizzes' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <Brain className="w-4 h-4 inline-block mr-2" /> Collab Quizzes
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              <div className="relative">
                <input type="text" placeholder="Start a new discussion..." className="saas-input w-full pr-12 dark:bg-gray-800 dark:border-gray-700" />
                <button className="absolute right-2 top-2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Send className="w-4 h-4" /></button>
              </div>
              
              {discussions.map(d => (
                <div key={d.id} className="saas-card p-5 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={d.avatar} alt={d.author} className="w-8 h-8 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-sm">{d.author}</h4>
                      <span className="text-[10px] text-gray-500">{d.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{d.content}</p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <button className="hover:text-indigo-600 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {d.replies} Replies</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resources.map(r => (
                <div key={r.id} className="saas-card p-5 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between h-32">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-semibold text-indigo-600">{r.type}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{r.title}</h4>
                  </div>
                  <span className="text-[10px] text-gray-500">Shared by {r.author}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              {quizzes.map(q => (
                <div key={q.id} className="saas-card p-5 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{q.title}</h4>
                    <p className="text-xs text-gray-500">{q.questions} Questions • {q.participants} Taken</p>
                  </div>
                  <button className="btn-secondary text-xs px-4 py-2">Take Quiz</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="saas-card p-6 rounded-xl bg-indigo-600 text-white shadow-md text-center space-y-4">
            <h3 className="font-bold text-lg">Group Challenge</h3>
            <p className="text-sm text-indigo-100">Complete 100 flashcards collectively this week to unlock the 'Transformer Scholar' group badge!</p>
            <div className="w-full bg-indigo-900/50 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-[65%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
            <span className="text-xs font-semibold">65 / 100 Completed</span>
          </div>

          <div className="saas-card p-6 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold text-sm mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Group Leaders</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="font-bold text-lg text-yellow-500 w-4 text-center">1</div>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80" alt="Leader" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-xs font-semibold">Ananya S.</p>
                  <p className="text-[10px] text-gray-500">1,250 Group XP</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="font-bold text-lg text-gray-400 w-4 text-center">2</div>
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&q=80" alt="Leader" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-xs font-semibold">Vikram</p>
                  <p className="text-[10px] text-gray-500">980 Group XP</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
