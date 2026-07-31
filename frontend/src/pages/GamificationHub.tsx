import React from 'react';
import { 
  Award, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Star,
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Gamification & Rewards Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            Gamification & <span className="gradient-text">Mastery Rewards</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Earn XP, unlock study coins, build streak fire, and claim achievement badges.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Coins className="w-5 h-5" />
            <span>450 Study Coins</span>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* XP Level Card */}
        <div className="glass-card rounded-2xl p-6 space-y-3 border border-purple-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Scholar Progression</span>
            <span className="text-purple-300 font-bold">Level 4</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">1,450</span>
            <span className="text-xs text-slate-400">/ 2,000 XP</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full w-[72.5%]"></div>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">550 XP remaining to unlock Level 5 Scholar</p>
        </div>

        {/* Daily Streak Card */}
        <div className="glass-card rounded-2xl p-6 space-y-3 border border-amber-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Daily Active Streak</span>
            <span className="text-amber-400 font-bold">🔥 5 Days Active</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">5 Days</span>
            <span className="text-xs text-slate-400">Streak Fire</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div
                key={idx}
                className={`flex-1 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center border ${
                  idx < 5
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm shadow-amber-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Global Leaderboard Rank */}
        <div className="glass-card rounded-2xl p-6 space-y-3 border border-cyan-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Global Student Rank</span>
            <span className="text-cyan-300 font-bold">Top 5%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400">#42</span>
            <span className="text-xs text-slate-400">Global Leaderboard</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Outperforming 95% of active AI learners this week</p>
        </div>

      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Achievement Badges Showcase</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-5 border flex items-center gap-4 transition-all ${
                badge.unlocked
                  ? 'border-purple-500/30 bg-purple-950/20'
                  : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {badge.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{badge.title}</h3>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
