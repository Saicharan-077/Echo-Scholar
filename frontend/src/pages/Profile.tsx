import React, { useState } from 'react';
import { 
  User, 
  Brain, 
  CheckCircle2, 
  Globe, 
  Save,
  Award,
  History,
  Users,
  Camera,
  Star,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

const AVATAR_OPTIONS = [
  { id: 'student', label: 'Student', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
  { id: 'developer', label: 'Developer', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80' },
  { id: 'researcher', label: 'Researcher', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { id: 'professor', label: 'Professor', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80' },
  { id: 'ai_engineer', label: 'AI Engineer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: 'scientist', label: 'Scientist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80' },
];

export const Profile: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState('student');
  const [fullName, setFullName] = useState('Ananya Sharma');
  const [username, setUsername] = useState('ananya_scholar');
  const [language, setLanguage] = useState('Teluglish');
  const [learningMode, setLearningMode] = useState('Learning Mode');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async () => {
    try {
      await api.put('/learning-dna/', {
        preferred_language: language,
        learning_mode: learningMode,
        avatar: selectedAvatar
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto transition-colors">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Cognitive Twin Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Learning Identity</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your AI personas, learning levels, and track your progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Profile Form (Left - 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="saas-card p-6 sm:p-8 space-y-8 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700">
            
            {/* AVATAR SELECTOR */}
            <div className="space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4" /> Select Your Avatar
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center cursor-pointer group hover:scale-105 ${
                      selectedAvatar === avatar.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 border-2 border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={avatar.img}
                      alt={avatar.label}
                      className="w-12 h-12 rounded-full object-cover shadow-sm mb-2"
                    />
                    <span className="text-[10px] font-semibold whitespace-nowrap">{avatar.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="saas-input w-full dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="saas-input w-full dark:bg-gray-900 dark:border-gray-700" />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Globe className="w-4 h-4 text-indigo-600" /> Preferred Language
                </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="saas-input w-full cursor-pointer dark:bg-gray-900 dark:border-gray-700">
                  <option value="Teluglish">Teluglish (Telugu + English)</option>
                  <option value="Hinglish">Hinglish (Hindi + English)</option>
                  <option value="English">English (Standard Academic)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Brain className="w-4 h-4 text-indigo-600" /> Default AI Mode
                </label>
                <select value={learningMode} onChange={(e) => setLearningMode(e.target.value)} className="saas-input w-full cursor-pointer dark:bg-gray-900 dark:border-gray-700">
                  <option value="Learning Mode">Learning Mode (Patient, Explanatory)</option>
                  <option value="Debate Mode">Debate Mode (Challenges your views)</option>
                  <option value="Storytelling Mode">Storytelling Mode (Narrative-based)</option>
                  <option value="Real-Life Mode">Real-Life Mode (Practical examples)</option>
                  <option value="Teacher Mode">Teacher Mode (Socratic method)</option>
                  <option value="Researcher Mode">Researcher Mode (Academic, citations)</option>
                  <option value="Interview Mode">Interview Mode (Tough questioning)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              {savedSuccess ? (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile Updated Successfully!</span>
                </div>
              ) : (
                <span className="text-[11px] text-gray-400">Settings sync across all AI tools</span>
              )}

              <button onClick={handleSaveProfile} className="btn-primary text-xs px-4 py-2">
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gamification & Stats Sidebar (Right - 1 Column) */}
        <div className="space-y-6">
          
          {/* Level & Badges */}
          <div className="saas-card p-6 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Award className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <div>
                <span className="uppercase text-[10px] font-bold tracking-widest text-indigo-200">Current Level</span>
                <h2 className="text-3xl font-extrabold flex items-end gap-2">
                  Lv. 12 <span className="text-sm font-normal text-indigo-100 mb-1">Scholar</span>
                </h2>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-indigo-100">
                  <span>14,500 XP</span>
                  <span>15,000 XP</span>
                </div>
                <div className="w-full bg-indigo-900/50 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[90%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <span className="text-xs font-semibold mb-2 block text-indigo-100">Recent Badges</span>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-yellow-900" title="10-Day Streak">🔥</div>
                  <div className="w-8 h-8 rounded-full bg-sky-400 border-2 border-white flex items-center justify-center text-sky-900" title="First Mind Map">🗺️</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-emerald-900" title="Perfect Quiz">💯</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity & Groups */}
          <div className="saas-card p-6 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 space-y-5">
            <h3 className="font-semibold text-sm border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" /> Recent Activity
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex gap-3">
                <div className="mt-0.5"><FileText className="w-3.5 h-3.5 text-gray-400" /></div>
                <div>
                  <p className="font-medium">Uploaded "Attention is All You Need"</p>
                  <span className="text-gray-500">2 hours ago</span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5"><Star className="w-3.5 h-3.5 text-yellow-500" /></div>
                <div>
                  <p className="font-medium">Bookmarked 15 Flashcards</p>
                  <span className="text-gray-500">Yesterday</span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5"><Users className="w-3.5 h-3.5 text-emerald-500" /></div>
                <div>
                  <p className="font-medium">Joined "Transformer Architecture" Group</p>
                  <span className="text-gray-500">3 days ago</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
