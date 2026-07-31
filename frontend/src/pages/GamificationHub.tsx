import React from 'react';
import { 
  Award, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Coins
} from 'lucide-react';

export const GamificationHub: React.FC = () => {
  const badges = [
    { title: 'Podcast Scholar', desc: 'Listened to 10+ AI audio overviews', unlocked: true, icon: '🎙️' },
    { title: 'Prerequisite Master', desc: 'Resolved 5 concept gap alerts in DAG tree', unlocked: true, icon: '🧬' },
    { title: 'Vernacular Pioneer', desc: 'Completed voice classroom in Teluglish', unlocked: true, icon: '🗣️' },
    { title: '5-Day Streak Flame', desc: 'Studied continuously for 5 days', unlocked: true, icon: '🔥' },
    { title: 'System Architect', desc: 'Achieved 90%+ in Placement Mock Interview', unlocked: true, icon: '💼' },
    { title: 'Grandmaster Scholar', desc: 'Reach 5,000 XP & Level 10 Mastery', unlocked: false, icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Gamification & Rewards Engine</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">Mastery & Rewards Hub</h1>
          <p className="small-text mt-1">
            Earn XP, build study streaks, and unlock achievement badges.
          </p>
        </div>

        <div className="p-2.5 px-4 rounded bg-gray-50 border border-gray-200 flex items-center gap-2 font-semibold text-xs text-gray-800">
          <Coins className="w-4 h-4 text-amber-500" />
          <span>450 Study Coins</span>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="saas-card p-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Scholar Progression</span>
            <span className="badge-accent">Level 4</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">1,450</span>
            <span className="text-xs text-gray-500">/ 2,000 XP</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[72.5%]"></div>
          </div>
          <p className="text-[11px] text-gray-500">550 XP remaining to unlock Level 5</p>
        </div>

        <div className="saas-card p-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Active Streak</span>
            <span className="badge-warning">🔥 5 Days Active</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">5 Days</span>
            <span className="text-xs text-gray-500">Streak Fire</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div
                key={idx}
                className={`flex-1 h-7 rounded text-[10px] font-bold flex items-center justify-center border ${
                  idx < 5
                    ? 'bg-amber-500 border-amber-600 text-white'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="saas-card p-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Global Student Rank</span>
            <span className="badge-accent">Top 5%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">#42</span>
            <span className="text-xs text-gray-500">Global Leaderboard</span>
          </div>
          <p className="text-[11px] text-gray-500">Outperforming 95% of active AI learners this week</p>
        </div>

      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="h2-title text-xl flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Achievement Badges</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`saas-card p-5 border flex items-center gap-4 ${
                badge.unlocked ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                {badge.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{badge.title}</h3>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
