import React from 'react';
import { Check } from 'lucide-react';
import { LearningModeDefinition } from '../types/studio';

export interface LearningModeCardProps {
  mode: LearningModeDefinition;
  isSelected: boolean;
  onSelect: (modeId: LearningModeDefinition['id']) => void;
}

export const LearningModeCard: React.FC<LearningModeCardProps> = ({
  mode,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(mode.id)}
      className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer select-none relative ${
        isSelected
          ? 'bg-indigo-50/70 border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
          : 'bg-white border-gray-200/80 hover:border-indigo-300 hover:shadow-xs'
      }`}
    >
      <div className="space-y-4">
        {/* Top Icon & Selection Indicator */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
            <span>{mode.emoji}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {mode.badge}
            </span>

            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'
            }`}>
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Mode Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-gray-900 text-xl tracking-tight leading-snug">
            {mode.title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-normal">
            {mode.fullDesc}
          </p>
        </div>
      </div>

      {/* Participants Footer Tag */}
      <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500 font-mono">
        <span>Format: {mode.participants}</span>
        <span className={isSelected ? 'text-indigo-700 font-bold' : 'text-gray-400'}>
          {isSelected ? 'Selected ✓' : 'Click to Select'}
        </span>
      </div>
    </div>
  );
};
