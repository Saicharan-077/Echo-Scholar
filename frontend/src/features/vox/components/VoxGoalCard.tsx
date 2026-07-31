import React from 'react';
import { Clock, Play, Zap, HelpCircle, ChevronRight } from 'lucide-react';

export interface VoxGoalCardProps {
  goalTitle: string;
  estTime: string;
  onContinueReading: () => void;
  onRecap: () => void;
  onQuiz: () => void;
}

export const VoxGoalCard: React.FC<VoxGoalCardProps> = ({
  goalTitle,
  estTime,
  onContinueReading,
  onRecap,
  onQuiz,
}) => {
  return (
    <div className="p-5 border-b border-gray-100 space-y-4 shrink-0 bg-white">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <Zap className="w-3 h-3 text-amber-500" /> Today's Focus
        </span>
        <h4 className="font-semibold text-sm text-gray-900 leading-snug">{goalTitle}</h4>
        <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {estTime} Session
        </p>
      </div>

      <div className="space-y-2 pt-2">
        <button 
          onClick={onContinueReading} 
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group text-left border border-transparent hover:border-gray-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
              <Play className="w-3 h-3 text-indigo-600 fill-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Resume Reading</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>

        <button 
          onClick={onRecap} 
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group text-left border border-transparent hover:border-gray-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
              <Zap className="w-3 h-3 text-amber-500" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">5-Minute Recap</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>

        <button 
          onClick={onQuiz} 
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group text-left border border-transparent hover:border-gray-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
              <HelpCircle className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Concept Quiz</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>
      </div>
    </div>
  );
};
