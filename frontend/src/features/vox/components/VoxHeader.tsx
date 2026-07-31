import React from 'react';
import { Brain } from 'lucide-react';
import { Badge } from '../../../shared/ui/Badge';

export interface VoxHeaderProps {
  status?: string;
}

export const VoxHeader: React.FC<VoxHeaderProps> = ({ status = 'Active' }) => {
  return (
    <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shrink-0 shadow-xs rounded-t-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-700 flex items-center justify-center font-bold">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-xs">Professor Vox</h3>
          <p className="text-[10px] text-indigo-100">Cognitive Twin Mentor</p>
        </div>
      </div>
      <Badge variant="accent" size="sm" className="bg-indigo-700 text-white border-indigo-500">
        {status}
      </Badge>
    </div>
  );
};
