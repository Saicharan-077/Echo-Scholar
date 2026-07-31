import React from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from '../../../shared/ui/Badge';

export interface VoxHeaderProps {
  status?: string;
}

export const VoxHeader: React.FC<VoxHeaderProps> = ({ status = 'Active' }) => {
  return (
    <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-gray-900 leading-none">Vox AI</h3>
          <p className="text-[10px] font-medium text-gray-500 mt-0.5 uppercase tracking-widest">Cognitive Mentor</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{status}</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
      </div>
    </div>
  );
};
