import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Headphones, 
  Mic, 
  Network, 
  Briefcase, 
  Award, 
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { JUDGE_PERSONAS, loginWithPersona } from '../services/api';

export const Index: React.FC = () => {
  const navigate = useNavigate();

  const handlePersonaLaunch = async (persona: typeof JUDGE_PERSONAS[0]) => {
    try {
      await loginWithPersona(persona.email, persona.password);
      navigate('/dashboard');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-24 px-4 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-xs font-semibold glow-purple">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>EchoScholar X • Cognitive Twin AI Personal Learning Companion</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
          The AI That <span className="gradient-text">Learns You</span><br />
          Before It Teaches You.
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          NotebookLM is passive. <strong>EchoScholar X</strong> is an active, interruptible AI personal companion driven by persistent Cognitive Twin memory decay tracking, 3D prerequisite DAG graphs, and multi-model LLM routing.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <span>Launch EchoScholar X Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#judge-personas"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span>1-Click Hackathon Judge Persona Credentials</span>
          </a>
        </div>

      </section>

      {/* JUDGE PERSONA CREDENTIALS LAUNCHER CARD SECTION */}
      <section id="judge-personas" className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-400">
            ⚖️ Hackathon Judge Demo Launcher
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Instantly Launch Pre-Seeded Student Personas
          </h2>
          <p className="text-xs text-slate-400">
            Click any candidate below to log in immediately with realistic learning history, memory decay metrics, and scorecards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {JUDGE_PERSONAS.map((p) => (
            <button
              key={p.role}
              onClick={() => handlePersonaLaunch(p)}
              className="text-left glass-card rounded-2xl p-6 space-y-3 border border-purple-500/20 hover:border-purple-500/60 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-base group-hover:text-purple-300 transition-colors">
                  {p.role}
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                  {p.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">{p.desc}</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Email: {p.email}</span>
                <span className="group-hover:translate-x-1 transition-transform">Launch Persona ▶</span>
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
