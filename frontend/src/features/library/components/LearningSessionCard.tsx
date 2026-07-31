import React from 'react';
import { ArrowRight, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { LearningSession } from '../types/library';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { Card } from '../../../shared/ui/Card';

export interface LearningSessionCardProps {
  session: LearningSession;
  onResume: (sessionId: string) => void;
  onDelete?: (sessionId: string) => void;
  onRegenerate?: (sessionId: string) => void;
  onDuplicate?: (sessionId: string) => void;
}

export const LearningSessionCard: React.FC<LearningSessionCardProps> = ({
  session,
  onResume,
  onDelete,
  onRegenerate,
  onDuplicate,
}) => {
  return (
    <Card variant="default" className="p-5 space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Mode Badge & Session Status */}
        <div className="flex items-center justify-between">
          <Badge variant="accent" size="sm">
            <span>{session.emoji}</span>
            <span>{session.modeTitle}</span>
          </Badge>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            session.status === 'Completed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            {session.status}
          </span>
        </div>

        {/* Paper Title */}
        <h3 className="font-extrabold text-base text-gray-900 leading-snug line-clamp-2">
          {session.paperTitle}
        </h3>

        {/* Session Parameters Info */}
        <p className="text-xs text-gray-500 font-mono">
          {session.difficulty} • {session.language}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500">Progress</span>
            <span className="text-indigo-600">{session.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                session.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary CTA & Secondary Controls */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onResume(session.id)}
          className="flex-1 justify-center bg-indigo-600 hover:bg-indigo-700 font-bold"
        >
          <span>Resume</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>

        <div className="flex items-center gap-1">
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(session.id)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Regenerate Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={() => onDuplicate(session.id)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Duplicate Session"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(session.id)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Session"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
