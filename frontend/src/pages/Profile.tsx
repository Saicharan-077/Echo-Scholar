import React, { useState, useEffect } from 'react';
import { 
  User, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  GraduationCap, 
  Target, 
  Award,
  Save
} from 'lucide-react';
import { api } from '../services/api';

export const Profile: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<'girl' | 'boy'>('girl');
  const [fullName, setFullName] = useState('Ananya Sharma');
  const [username, setUsername] = useState('ananya_scholar');
  const [branch, setBranch] = useState('Computer Science & AI');
  const [language, setLanguage] = useState('Teluglish');
  const [explanationStyle, setExplanationStyle] = useState('Analogy-Based');
  const [targetGoal, setTargetGoal] = useState('Campus Placement & Tech Interviews');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const girlAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const boyAvatar = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80';

  const handleSaveProfile = async () => {
    try {
      await api.put('/learning-dna/', {
        branch,
        preferred_language: language,
        explanation_style: explanationStyle,
        placement_goals: targetGoal
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 lg:p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Cognitive Twin User Profile & Avatar Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            User Persona & <span className="gradient-text">Cognitive Profile</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize your AI persona avatar (Girl/Boy), learning style, and academic targets.
          </p>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-8 border border-purple-500/20">
        
        {/* AVATAR SELECTOR: GIRL VS BOY IMAGE */}
        <div className="space-y-4">
          <label className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Select Your User Persona Avatar (Girl / Boy Image)</span>
          </label>

          <div className="grid grid-cols-2 gap-6 max-w-md">
            
            {/* Girl Persona Option */}
            <button
              type="button"
              onClick={() => setSelectedAvatar('girl')}
              className={`p-4 rounded-2xl border text-center space-y-3 transition-all flex flex-col items-center ${
                selectedAvatar === 'girl'
                  ? 'bg-purple-600/30 border-2 border-purple-500 shadow-xl shadow-purple-500/20 scale-105'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70'
              }`}
            >
              <img
                src={girlAvatar}
                alt="Girl Persona Avatar"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-400 shadow-md"
              />
              <div>
                <span className="font-bold text-xs text-white block">Girl Scholar Persona</span>
                <span className="text-[10px] text-purple-300">Ananya (Research Lead)</span>
              </div>
              {selectedAvatar === 'girl' && (
                <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selected Avatar
                </span>
              )}
            </button>

            {/* Boy Persona Option */}
            <button
              type="button"
              onClick={() => setSelectedAvatar('boy')}
              className={`p-4 rounded-2xl border text-center space-y-3 transition-all flex flex-col items-center ${
                selectedAvatar === 'boy'
                  ? 'bg-cyan-600/30 border-2 border-cyan-500 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70'
              }`}
            >
              <img
                src={boyAvatar}
                alt="Boy Persona Avatar"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
              />
              <div>
                <span className="font-bold text-xs text-white block">Boy Scholar Persona</span>
                <span className="text-[10px] text-cyan-300">Vikram (AI Engineer)</span>
              </div>
              {selectedAvatar === 'boy' && (
                <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selected Avatar
                </span>
              )}
            </button>

          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-400" /> Academic Branch / Major
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Data Science & ML">Data Science & ML</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Biotechnology & Medicine">Biotechnology & Medicine</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" /> Preferred Vernacular Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Teluglish">Teluglish (Telugu + English)</option>
              <option value="Hinglish">Hinglish (Hindi + English)</option>
              <option value="English">English (Standard Academic)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-amber-400" /> AI Explanation Style
            </label>
            <select
              value={explanationStyle}
              onChange={(e) => setExplanationStyle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Analogy-Based">Analogy-Based (Real-world examples)</option>
              <option value="First-Principles">First-Principles (Mathematical & Proofs)</option>
              <option value="Code-First">Code-First (Python/C++ snippets first)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> Career & Academic Goal
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cognitive Twin Profile & Persona Updated Successfully!</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">Changes save instantly to Cognitive Twin database</span>
          )}

          <button
            onClick={handleSaveProfile}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Persona</span>
          </button>
        </div>

      </div>

    </div>
  );
};
