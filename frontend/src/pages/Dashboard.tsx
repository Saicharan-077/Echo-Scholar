import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Flame, 
  Zap, 
  Headphones, 
  Mic, 
  Network, 
  Briefcase, 
  AlertTriangle, 
  ArrowRight,
  Activity,
  Award,
  Star,
  CheckCircle2,
  Medal,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const [learningDna, setLearningDna] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dnaRes, gamRes] = await Promise.all([
          api.get('/learning-dna/'),
          api.get('/gamification/')
        ]);
        setLearningDna(dnaRes.data.learning_dna);
        setGamification(gamRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Trigger achievement popup after a delay for demonstration
    setTimeout(() => {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 5000);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto transition-colors relative overflow-hidden">
      
      {/* Achievement Pop-up */}
      {showAchievement && (
        <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-top-10 fade-in duration-500">
          <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Achievement Unlocked!</p>
              <h4 className="font-bold text-gray-900 dark:text-white">Consistency King 👑</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">+500 XP • 7 Day Streak</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Title & Header */}
      <div className="saas-panel p-6 sm:p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-800">
            <span>Cognitive Twin System</span>
            <span>•</span>
            <span className="font-semibold">Enterprise Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Command Center Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time memory decay tracking, concept prerequisite DAG maps, and adaptive quiz diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/upload" className="btn-primary text-xs dark:bg-indigo-600 dark:hover:bg-indigo-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <span>Upload Research Paper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gamification Profile (XP & Levels) */}
        <div className="saas-card p-6 space-y-6 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-lg">Scholar Level</h2>
            </div>
            <div className="flex items-center gap-1.5 text-orange-500 font-bold text-sm bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full">
              <Flame className="w-4 h-4" /> 7 Day Streak
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset="56" className="text-indigo-600 dark:text-indigo-400" />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <span className="font-bold text-xl leading-none">{gamification?.level || 14}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Lvl</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white">Master Scholar</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{gamification?.xp || 1240} / 1,500 XP to Level {gamification ? gamification.level + 1 : 15}</p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[82%]"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Badges</h4>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-xl flex items-center justify-center flex-col gap-1 w-20 text-center" title="Transformer Ace">
                <Medal className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                <span className="text-[9px] font-bold text-yellow-700 dark:text-yellow-400 leading-tight">Transformer Ace</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl flex items-center justify-center flex-col gap-1 w-20 text-center" title="Quiz Master">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <span className="text-[9px] font-bold text-purple-700 dark:text-purple-400 leading-tight">Quiz Master</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center flex-col gap-1 w-20 text-center opacity-50" title="Locked: Study Group Pro">
                <Star className="w-6 h-6 text-gray-400" />
                <span className="text-[9px] font-bold text-gray-500 leading-tight">Locked</span>
              </div>
            </div>
          </div>

        </div>

        {/* 30-Day Learning Velocity Heatmap */}
        <div className="lg:col-span-2 saas-card p-6 space-y-5 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-lg">30-Day Study Velocity Heatmap</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700"></div> Low</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-500"></div> High</span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2.5 py-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const intensity = [0, 1, 2, 3, 2, 4, 3, 1, 4, 2, 0, 3, 4, 2, 1, 3, 4, 2, 4, 3, 1, 2, 3, 4, 2, 3, 4, 1, 2, 4][i];
              const styles = [
                'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/50 dark:border-gray-700',
                'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-400',
                'bg-indigo-200 text-indigo-800 border-indigo-300 dark:bg-indigo-800/60 dark:border-indigo-700 dark:text-indigo-300',
                'bg-indigo-500 text-white border-indigo-600 dark:bg-indigo-600 dark:border-indigo-500',
                'bg-indigo-700 text-white border-indigo-800 dark:bg-indigo-400 dark:border-indigo-300 dark:text-indigo-950 font-bold',
              ];
              return (
                <div
                  key={i}
                  className={`h-9 sm:h-10 rounded-md border flex items-center justify-center text-[10px] sm:text-xs transition-colors cursor-pointer hover:ring-2 ring-offset-1 ring-indigo-400 dark:ring-offset-gray-900 ${styles[intensity]}`}
                  title={`Day ${i + 1}: ${intensity * 45} mins`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Study Time</span>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">42.5 hrs</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Mastery Index</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">78.4%</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Quizzes Passed</span>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">12 / 15</p>
            </div>
          </div>
        </div>

      </div>

      {/* Core Action Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Core Learning Engines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link to="/podcasts" className="saas-card p-6 space-y-4 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 group transition-all rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                <span>Interruptible Podcast</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Dual AI co-hosts with real-time speech interruption.</p>
            </div>
          </Link>

          <Link to="/professor" className="saas-card p-6 space-y-4 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 group transition-all rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                <span>Voice Professor</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Socratic speech classroom in Teluglish / Hinglish.</p>
            </div>
          </Link>

          <Link to="/graph" className="saas-card p-6 space-y-4 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 group transition-all rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                <span>Concept DAG Tree</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Interactive prerequisite tree with RED gap alerts.</p>
            </div>
          </Link>

          <Link to="/placement" className="saas-card p-6 space-y-4 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 group transition-all rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                <span>Placement Mode</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Whiteboard interview practice & AI scorecards.</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
};

// Helper Icon for Trophy
function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
