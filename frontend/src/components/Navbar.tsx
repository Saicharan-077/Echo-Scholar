import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Mic, 
  Headphones, 
  Briefcase, 
  Award, 
  Network, 
  UserCheck, 
  Cpu, 
  Flame, 
  Zap,
  Upload,
  ChevronDown,
  Command
} from 'lucide-react';
import { JUDGE_PERSONAS, loginWithPersona } from '../services/api';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPersona, setSelectedPersona] = useState<string>('Standard Student');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [userEmail, setUserEmail] = useState<string>('demo@EchoScholar.ai');
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      const match = JUDGE_PERSONAS.find(p => p.email === savedEmail);
      if (match) setSelectedPersona(match.role);
    }
  }, []);

  const handleSwitchPersona = async (persona: typeof JUDGE_PERSONAS[0]) => {
    try {
      await loginWithPersona(persona.email, persona.password);
      setSelectedPersona(persona.role);
      setUserEmail(persona.email);
      setIsPersonaOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Brain },
    { name: 'Upload RAG', path: '/upload', icon: Upload },
    { name: 'Voice Professor', path: '/professor', icon: Mic },
    { name: 'Podcasts', path: '/podcasts', icon: Headphones },
    { name: 'Concept DAG', path: '/graph', icon: Network },
    { name: 'Placement', path: '/placement', icon: Briefcase },
    { name: 'Gamification', path: '/gamification', icon: Award },
    { name: 'Profile Persona', path: '/profile', icon: UserCheck },
  ];

  return (
    <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto">
      
      {/* Apple Floating Glass Dock Bar */}
      <div className="apple-dock rounded-3xl px-4 py-2.5 flex items-center justify-between transition-all">
        
        {/* Apple Logo & Branding */}
        <Link to="/" className="flex items-center gap-3 group apple-btn">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-black/80 rounded-[14px] flex items-center justify-center">
              <Command className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">EchoScholar</span>
              <span className="bg-white/10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white/20">X</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium tracking-wide">Designed for macOS & visionOS</p>
          </div>
        </Link>

        {/* Floating Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all apple-btn ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-inner shadow-white/20 border border-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-300' : ''}`} />
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Apple Dynamic Controls (Model & Judge Persona) */}
        <div className="flex items-center gap-2">
          
          {/* Streak & XP Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>5 Days</span>
            <span className="text-white/20">|</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>1,450 XP</span>
          </div>

          {/* 1-Click Judge Persona Quick Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-400/30 hover:border-purple-400/60 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-semibold apple-btn shadow-lg"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline text-slate-300">Persona:</span>
              <strong className="text-white">{selectedPersona}</strong>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Apple Style Glass Dropdown */}
            {isPersonaOpen && (
              <div className="absolute right-0 mt-3 w-80 apple-glass rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">⚖️ Hackathon Judge Quick Switcher</p>
                  <p className="text-[10px] text-slate-400">Instantly test pre-seeded candidate profiles</p>
                </div>

                <div className="space-y-1">
                  {JUDGE_PERSONAS.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => handleSwitchPersona(p)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all apple-btn flex flex-col gap-1 ${
                        selectedPersona === p.role
                          ? 'bg-white/15 border border-white/20 text-white'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{p.role}</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded-md border border-purple-400/30">{p.badge}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};
