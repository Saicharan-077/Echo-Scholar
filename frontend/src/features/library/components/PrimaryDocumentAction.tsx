import React from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { DocumentLifecycleStatus } from '../types/library';
import { Button } from '../../../shared/ui/Button';

export interface PrimaryDocumentActionProps {
  status: DocumentLifecycleStatus;
  onGenerateLearning: () => void;
  onResumeLearning: () => void;
}

export const PrimaryDocumentAction: React.FC<PrimaryDocumentActionProps> = ({
  status,
  onGenerateLearning,
  onResumeLearning,
}) => {
  if (status === 'UPLOADING' || status === 'PROCESSING') {
    return (
      <Button variant="secondary" size="sm" disabled className="flex-1 justify-center opacity-70">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
        <span>Processing...</span>
      </Button>
    );
  }

  if (status === 'LEARNING_GENERATED') {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={onResumeLearning}
        className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
      >
        <span>Resume Learning</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    );
  }

  // Default: VECTORIZED or READY_TO_LEARN
  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onGenerateLearning}
      className="flex-1 justify-center bg-indigo-600 hover:bg-indigo-700 font-bold"
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      <span>Generate Learning</span>
    </Button>
  );
};
