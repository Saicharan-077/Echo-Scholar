import React from 'react';

export interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: '5xl' | '6xl' | '7xl' | 'full';
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth = '7xl',
  className = ''
}) => {
  const widthClasses = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'w-full'
  };

  return (
    <div className={`min-h-screen bg-gray-50/60 text-gray-900 p-6 sm:p-8 lg:p-12 space-y-10 ${widthClasses[maxWidth]} mx-auto ${className}`}>
      {children}
    </div>
  );
};
