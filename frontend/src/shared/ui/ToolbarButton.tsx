import React from 'react';
import { Button } from './Button';

export interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
  disabled?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
  badgeCount,
  disabled = false,
}) => {
  return (
    <Button
      variant={isActive ? 'primary' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`h-9 px-3.5 rounded-xl font-bold transition-all duration-150 cursor-pointer select-none whitespace-nowrap ${
        isActive
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-semibold'
      }`}
    >
      <span className={`w-4 h-4 flex items-center justify-center shrink-0 ${isActive ? 'text-white' : 'text-indigo-600'}`}>
        {icon}
      </span>
      <span className="text-xs tracking-tight">{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className={`ml-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
          isActive ? 'bg-amber-400 text-indigo-950' : 'bg-indigo-100 text-indigo-700'
        }`}>
          {badgeCount}
        </span>
      )}
    </Button>
  );
};
