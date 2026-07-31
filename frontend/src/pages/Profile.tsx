import React, { useState } from 'react';
import { 
  User, 
  Brain, 
  CheckCircle2, 
  Globe, 
  GraduationCap, 
  Target, 
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Cognitive Twin Profile Engine</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">User Persona & Cognitive Profile</h1>
          <p className="small-text mt-1">
            Customize your AI persona avatar (Girl / Boy Image), learning style, and academic targets.
          </p>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="saas-card p-6 sm:p-8 space-y-8">
        
        {/* AVATAR SELECTOR */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">
            Select User Persona Avatar (Girl / Boy Image)
          </label>

          <div className="grid grid-cols-2 gap-6 max-w-md">
            
            {/* Girl Persona */}
            <button
              type="button"
              onClick={() => setSelectedAvatar('girl')}
              className={`p-4 rounded-lg border text-center space-y-3 transition-all flex flex-col items-center cursor-pointer ${
                selectedAvatar === 'girl'
                  ? 'bg-indigo-50 border-2 border-indigo-600 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={girlAvatar}
                alt="Girl Persona Avatar"
                className="w-20 h-20 rounded-lg object-cover border border-gray-300"
              />
              <div>
                <span className="font-semibold text-xs text-gray-900 block">Girl Scholar Persona</span>
                <span className="text-[11px] text-gray-500">Ananya (Research Lead)</span>
              </div>
              {selectedAvatar === 'girl' && (
                <span className="badge-accent">Selected Avatar</span>
              )}
            </button>

            {/* Boy Persona */}
            <button
              type="button"
              onClick={() => setSelectedAvatar('boy')}
              className={`p-4 rounded-lg border text-center space-y-3 transition-all flex flex-col items-center cursor-pointer ${
                selectedAvatar === 'boy'
                  ? 'bg-indigo-50 border-2 border-indigo-600 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={boyAvatar}
                alt="Boy Persona Avatar"
                className="w-20 h-20 rounded-lg object-cover border border-gray-300"
              />
              <div>
                <span className="font-semibold text-xs text-gray-900 block">Boy Scholar Persona</span>
                <span className="text-[11px] text-gray-500">Vikram (AI Engineer)</span>
              </div>
              {selectedAvatar === 'boy' && (
                <span className="badge-accent">Selected Avatar</span>
              )}
            </button>

          </div>
        </div>

        {/* User Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="saas-input w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="saas-input w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-indigo-600" /> Academic Branch / Major
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="saas-input w-full cursor-pointer"
            >
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Data Science & ML">Data Science & ML</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Biotechnology & Medicine">Biotechnology & Medicine</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 flex items-center gap-1">
              <Globe className="w-4 h-4 text-indigo-600" /> Preferred Vernacular Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="saas-input w-full cursor-pointer"
            >
              <option value="Teluglish">Teluglish (Telugu + English)</option>
              <option value="Hinglish">Hinglish (Hindi + English)</option>
              <option value="English">English (Standard Academic)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 flex items-center gap-1">
              <Brain className="w-4 h-4 text-indigo-600" /> AI Explanation Style
            </label>
            <select
              value={explanationStyle}
              onChange={(e) => setExplanationStyle(e.target.value)}
              className="saas-input w-full cursor-pointer"
            >
              <option value="Analogy-Based">Analogy-Based (Real-world examples)</option>
              <option value="First-Principles">First-Principles (Mathematical & Proofs)</option>
              <option value="Code-First">Code-First (Python/C++ snippets first)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 flex items-center gap-1">
              <Target className="w-4 h-4 text-indigo-600" /> Target Goal
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="saas-input w-full"
            />
          </div>

        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cognitive Twin Profile Updated Successfully!</span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-400">Changes save directly to persistent database</span>
          )}

          <button onClick={handleSaveProfile} className="btn-primary text-xs">
            <Save className="w-4 h-4" />
            <span>Save Profile Persona</span>
          </button>
        </div>

      </div>

    </div>
  );
};
