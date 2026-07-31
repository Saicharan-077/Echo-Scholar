import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Learning Journey</p>
        <span className="text-xs font-bold text-indigo-600">{progress}%</span>
      </div>

      <div className="space-y-1 font-sans">
        {sections.map((sec) => {
          const isCompleted = sec.id < activeStep;
          const isActive = sec.id === activeStep;

          return (
            <button
              key={sec.id}
              onClick={() => onSelectStep(sec.id)}
              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-start gap-2.5 ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-200/80 shadow-2xs'
                  : isCompleted
                  ? 'text-gray-400 hover:text-gray-700'
                  : 'text-gray-600 hover:bg-gray-100/60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : isActive ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                )}
              </div>
              <span className="leading-snug">{sec.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
