import React from 'react';

export interface BadgeProps {
  variant?: 'accent' | 'warning' | 'success' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'accent',
  size = 'md',
  children,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-semibold border select-none';
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs'
  };

  const variantClasses = {
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    outline: 'bg-transparent text-gray-600 border-gray-300'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
