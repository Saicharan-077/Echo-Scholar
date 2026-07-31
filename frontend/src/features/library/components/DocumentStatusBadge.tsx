import React from 'react';
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { DocumentLifecycleStatus } from '../types/library';

export interface DocumentStatusBadgeProps {
  status: DocumentLifecycleStatus;
}

export const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'UPLOADING':
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
          <span>Processing Text...</span>
        </span>
      );

    case 'VECTORIZED':
    case 'READY_TO_LEARN':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Vector Indexed</span>
        </span>
      );

    case 'LEARNING_GENERATED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Session Active</span>
        </span>
      );

    case 'ARCHIVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
          <AlertCircle className="w-3 h-3 text-gray-400" />
          <span>Archived</span>
        </span>
      );

    default:
      return null;
  }
};
