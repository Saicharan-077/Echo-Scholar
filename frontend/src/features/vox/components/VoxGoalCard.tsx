import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

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
    <div className="p-4 bg-indigo-50/50 border-b border-gray-200/80 space-y-3 shrink-0">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Today's Goal</span>
        <h4 className="font-bold text-sm text-gray-900">{goalTitle}</h4>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>Est. Time: {estTime}</span>
        </p>
      </div>

      <div className="space-y-2 pt-1">
        <Button variant="primary" fullWidth onClick={onContinueReading} className="justify-between">
          <span>✓ Continue Reading</span>
          <span>→</span>
        </Button>

        <Button variant="secondary" fullWidth onClick={onRecap} className="justify-between">
          <span>⚡ 5-Min Recap</span>
          <span>→</span>
        </Button>

        <Button variant="secondary" fullWidth onClick={onQuiz} className="justify-between">
          <span>🎯 Take Quick Quiz</span>
          <span>→</span>
        </Button>
      </div>
    </div>
  );
};
