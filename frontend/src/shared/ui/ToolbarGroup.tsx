import React from 'react';

export interface ToolbarGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 bg-white/95 p-1 rounded-2xl border border-gray-200/80 shadow-2xs overflow-x-auto max-w-full ${className}`}>
      {children}
    </div>
  );
};
