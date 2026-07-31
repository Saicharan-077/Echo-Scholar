import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  ChevronDown, 
  UserCheck, 
  Settings, 
  Sparkles,
  Command
} from 'lucide-react';
import { JUDGE_PERSONAS, loginWithPersona } from '../services/api';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const [selectedPersona, setSelectedPersona] = useState<string>('Standard Student');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
      const match = JUDGE_PERSONAS.find(p => p.email === savedEmail);
      if (match) setSelectedPersona(match.role);
    }
  }, []);

  const handleSwitchPersona = async (persona: typeof JUDGE_PERSONAS[0]) => {
    try {
      await loginWithPersona(persona.email, persona.password);
      setSelectedPersona(persona.role);
      setIsPersonaOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Minimal Symbol + EchoScholar X) */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-all duration-150 group-hover:scale-105">
            <Command className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            EchoScholar <span className="text-indigo-600 font-extrabold">X</span>
          </span>
        </Link>

        {/* Primary Phase 1 MVP Navigation (Discover, My Research, Community, Profile) */}
        <div className="hidden lg:flex items-center gap-10 mx-10">
          
          <Link
            to="/discover"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              ['/', '/discover'].includes(location.pathname) ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Discover
          </Link>

          <Link
            to="/upload"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              location.pathname.startsWith('/upload') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upload PDF
          </Link>

          <Link
            to="/research"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              location.pathname.startsWith('/research')
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Research
          </Link>

          <Link
            to="/community"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              location.pathname === '/community' ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Community
          </Link>

          <Link
            to="/profile"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              location.pathname === '/profile' ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </Link>

        </div>

        {/* Right Section: Profile & Settings */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Settings Modal Toggle */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors"
            title="AI Model & Platform Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* AI Settings Modal */}
          {isSettingsOpen && (
            <div className="absolute right-12 top-16 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <span className="text-sm font-semibold text-gray-900">AI Model Settings</span>
                <button onClick={() => setIsSettingsOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Active LLM Engine:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="saas-input w-full text-xs"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                  <option value="meta-llama/Meta-Llama-3.1-70B-Instruct">Featherless Llama-3.1-70B</option>
                  <option value="llama-3.3-70b-versatile">Groq Llama 3.3 (Fast)</option>
                  <option value="deepseek-r1">DeepSeek R1 (Ollama)</option>
                </select>
              </div>
            </div>
          )}

          {/* De-emphasized Persona Switcher (Secondary Subtle Outline) */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-gray-50/60 hover:bg-gray-100/80 transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline font-normal text-gray-400">Persona:</span>
              <strong className="font-medium text-gray-800">{selectedPersona}</strong>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-84 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hackathon Demo Persona Quick Switcher
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Instantly test pre-seeded candidate accounts</p>
                </div>

                <div className="space-y-1.5">
                  {JUDGE_PERSONAS.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => handleSwitchPersona(p)}
                      className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex flex-col gap-1 ${
                        selectedPersona === p.role
                          ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-sm">{p.role}</span>
                        <span className="badge-accent text-xs">{p.badge}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-normal">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Button (Primary Action) */}
          <Link to="/profile" className="btn-primary text-sm px-4 py-2 font-semibold shadow-sm">
            Profile
          </Link>

        </div>

      </div>
    </header>
  );
};
