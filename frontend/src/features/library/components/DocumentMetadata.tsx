import React from 'react';

export interface DocumentMetadataProps {
  chunks: number;
  size: string;
  indexedAt: string;
  sessionsCount?: number;
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({
  chunks,
  size,
  indexedAt,
  sessionsCount = 0,
}) => {
  return (
    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-mono">
      <div className="flex items-center gap-2">
        <span>📄 {chunks} Chunks</span>
        <span>•</span>
        <span>💾 {size}</span>
        <span>•</span>
        <span>📅 {indexedAt}</span>
      </div>
      {sessionsCount > 0 && (
        <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-sans">
          {sessionsCount} {sessionsCount === 1 ? 'Session' : 'Sessions'}
        </span>
      )}
    </div>
  );
};
