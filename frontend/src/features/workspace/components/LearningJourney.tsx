import React from 'react';
import { CheckCircle2, Clock, Flame, BookOpen } from 'lucide-react';

export interface SectionStep {
  id: number;
  title: string;
}

export interface LearningJourneyProps {
  sections: SectionStep[];
  activeStep: number;
  progress: number;
  onSelectStep: (stepId: number) => void;
}

export const LearningJourney: React.FC<LearningJourneyProps> = ({
  sections,
  activeStep,
  progress,
  onSelectStep,
}) => {
  const remainingSections = sections.length - activeStep;
  const etaMinutes = Math.max(0, remainingSections * 15); // Rough estimate 15 mins per remaining section

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-gray-200/60 shadow-xs flex flex-col items-center justify-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="text-[11px] font-bold text-gray-700">{etaMinutes > 0 ? `${etaMinutes}m ETA` : 'Complete'}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-gray-200/60 shadow-xs flex flex-col items-center justify-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-[11px] font-bold text-gray-700">3 Day Streak</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Learning Roadmap
          </p>
          <span className="text-[10px] font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">{progress}%</span>
        </div>

        <div className="space-y-1 font-sans relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />
          
          {sections.map((sec, idx) => {
            const isCompleted = sec.id < activeStep;
            const isActive = sec.id === activeStep;

            return (
              <button
                key={sec.id}
                onClick={() => onSelectStep(sec.id)}
                className={`w-full text-left p-3 rounded-2xl text-[13px] font-semibold transition-all flex items-start gap-3.5 relative z-10 ${
                  isActive
                    ? 'bg-white text-indigo-900 border border-indigo-200/60 shadow-[0_2px_12px_-4px_rgba(79,70,229,0.12)]'
                    : isCompleted
                    ? 'text-gray-500 hover:text-gray-800 hover:bg-white/60 border border-transparent'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-white/60 border border-transparent'
                }`}
              >
                <div className="mt-[3px] shrink-0 bg-gray-50/50 rounded-full">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center bg-white shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white" />
                  )}
                </div>
                <span className="leading-snug">{sec.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
