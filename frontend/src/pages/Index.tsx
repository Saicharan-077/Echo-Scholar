import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Headphones, 
  Network, 
  ArrowRight, 
  Upload, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Zap,
  Globe
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
    <div className="min-h-screen bg-gray-50/60 text-gray-900 font-sans space-y-24 lg:space-y-32 pb-24">
      
      {/* 1. HERO SECTION (Above the Fold) */}
      <section className="bg-white border-b border-gray-200/80 py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>EchoScholar X — Cognitive Twin AI Learning Companion</span>
          </div>

          {/* Scannable, High-Impact Headline (72–80px, Weight 800, Line Height 1.05, Max-Width 900px) */}
          <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-extrabold text-gray-900 tracking-tight leading-[1.05] max-w-4xl mx-auto">
            The AI That Learns <br />
            <span className="text-indigo-600">How You Learn.</span>
          </h1>

          {/* Concise Subhead (20–22px, Line Height 1.7, Max Width 700–760px) */}
          <p className="text-lg sm:text-[21px] text-gray-600 max-w-3xl mx-auto leading-[1.7] font-normal">
            Your personal Cognitive Twin that adapts every explanation, podcast, quiz, and interview to your unique learning style.
          </p>

          {/* Primary CTA Buttons (16px, Weight 600, Premium Padding) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/dashboard" className="btn-primary px-7 py-3.5 text-base font-semibold rounded-lg shadow-sm hover:shadow-md transition-all gap-2.5">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link to="/upload" className="btn-secondary bg-indigo-50/80 text-indigo-700 border-indigo-200 hover:bg-indigo-100 px-7 py-3.5 text-base font-semibold rounded-lg gap-2.5">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span>Upload Your First PDF</span>
            </Link>

            <a href="#demo-section" className="btn-secondary px-7 py-3.5 text-base font-medium rounded-lg">
              <span>Watch Demo</span>
            </a>
          </div>

          {/* Clean Trust Badges (14-15px) */}
          <div className="pt-12 border-t border-gray-100 flex flex-wrap items-center justify-center gap-10 text-sm sm:text-base text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> AI Powered
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" /> Research Ready
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> University Ready
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Enterprise Secure
            </div>
          </div>

        </div>
      </section>

      {/* 2. KEY VALUE PROPOSITIONS (3 Columns with 32px Internal Card Padding) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="badge-accent text-sm px-4 py-1.5">Workflow-Driven Platform</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.15]">
            Built for Active Learning & Technical Mastery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-[1.7]">
            Designed to minimize cognitive load while maximizing long-term retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="saas-card p-8 space-y-5 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Cognitive Twin DNA</h3>
            <p className="text-base text-gray-600 leading-[1.7]">
              Tracks memory decay rates ($\lambda$), vernacular preferences (*Teluglish/Hinglish*), and active misconception points in real-time.
            </p>
          </div>

          <div className="saas-card p-8 space-y-5 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Interruptible AI Podcasts</h3>
            <p className="text-base text-gray-600 leading-[1.7]">
              Dual AI co-hosts (*Prabhat & Neerja*) with mid-audio interruption portal and active recall pop quizzes.
            </p>
          </div>

          <div className="saas-card p-8 space-y-5 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Knowledge Map DAG</h3>
            <p className="text-base text-gray-600 leading-[1.7]">
              Parses research documents into directed prerequisite graphs, highlighting knowledge gaps in red before exams.
            </p>
          </div>

        </div>
      </section>

      {/* 3. JUDGE PERSONAS LAUNCHER SECTION */}
      <section id="demo-section" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
        <div className="saas-panel p-8 lg:p-10 bg-white border border-gray-200/80 rounded-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="badge-warning text-sm px-4 py-1.5">⚖️ Hackathon Evaluation Suite</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">1-Click Judge Persona Quick Switcher</h2>
              <p className="text-base text-gray-600 mt-1">Instantly authenticate pre-seeded student accounts to test Cognitive Twin features.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {JUDGE_PERSONAS.map((p) => (
              <button
                key={p.role}
                onClick={() => handlePersonaLaunch(p)}
                className="text-left saas-card p-6 hover:border-indigo-400 space-y-3 transition-all rounded-xl group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-base">{p.role}</span>
                  <span className="badge-accent text-xs px-2.5 py-1">{p.badge}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                <div className="pt-3 flex items-center justify-between text-sm font-semibold text-indigo-600 border-t border-gray-100">
                  <span>{p.email}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Launch ▶</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ENTERPRISE PRICING TIERS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="badge-accent text-sm px-4 py-1.5">Simple Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.15]">Transparent Plans for Every Learner</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="saas-card p-8 space-y-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
              <p className="text-base text-gray-600">For individual students exploring papers.</p>
              <div className="text-4xl font-extrabold text-gray-900 pt-2">$0 <span className="text-base text-gray-500 font-normal">/ month</span></div>
              <ul className="space-y-3 text-sm text-gray-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Up to 5 PDF Uploads / month</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Basic RAG Document Q&A</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Standard Audio Podcasts</li>
              </ul>
            </div>
            <Link to="/upload" className="btn-secondary w-full text-center py-3 font-semibold text-base">Get Started Free</Link>
          </div>

          <div className="saas-card p-8 space-y-6 rounded-2xl border-2 border-indigo-600 relative flex flex-col justify-between shadow-lg">
            <div className="absolute -top-3.5 right-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-950">Pro Scholar</h3>
              <p className="text-base text-gray-600">For researchers and active developers.</p>
              <div className="text-4xl font-extrabold text-gray-900 pt-2">$19 <span className="text-base text-gray-500 font-normal">/ month</span></div>
              <ul className="space-y-3 text-sm text-gray-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-indigo-600 shrink-0" /> Unlimited PDF Ingestion</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-indigo-600 shrink-0" /> Interruptible Dual Co-Host Podcasts</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-indigo-600 shrink-0" /> Persistent Cognitive Twin DNA</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-indigo-600 shrink-0" /> Knowledge Map Gap Radar Alerts</li>
              </ul>
            </div>
            <Link to="/upload" className="btn-primary w-full text-center py-3.5 font-semibold text-base shadow-md">Start Pro Trial</Link>
          </div>

          <div className="saas-card p-8 space-y-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">University & L&D</h3>
              <p className="text-base text-gray-600">For departments and engineering teams.</p>
              <div className="text-4xl font-extrabold text-gray-900 pt-2">Custom</div>
              <ul className="space-y-3 text-sm text-gray-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Multi-Tenant SSO & Role Access</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Multi-Model Router (Featherless, Groq)</li>
                <li className="flex items-center gap-2.5"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Placement Interview Simulator API</li>
              </ul>
            </div>
            <Link to="/dashboard" className="btn-secondary w-full text-center py-3 font-semibold text-base">Contact Sales</Link>
          </div>

        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="max-w-6xl mx-auto px-6 text-center">
        <div className="saas-panel p-12 lg:p-16 bg-indigo-900 text-white space-y-8 rounded-3xl shadow-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Transform How You Learn Complex Technical Concepts</h2>
          <p className="text-indigo-200 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Experience active AI learning powered by persistent memory decay tracking and interactive audio dialogs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/dashboard" className="btn-primary bg-white text-indigo-950 hover:bg-gray-100 px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2.5 shadow-md">
              <span>Launch Command Center</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/upload" className="btn-secondary bg-indigo-800/90 text-white border-indigo-700/80 hover:bg-indigo-700 px-8 py-4 rounded-xl text-base font-semibold">
              Upload Your First PDF
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
