import React from 'react';

export interface WorkspaceToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({ children, className = '' }) => {
  return (
    <div className={`h-14 border-b border-gray-200/80 px-6 flex items-center justify-between shrink-0 bg-gray-50/80 backdrop-blur-xs select-none gap-4 overflow-x-auto ${className}`}>
      {children}
    </div>
  );
};
