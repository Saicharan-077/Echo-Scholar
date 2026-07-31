import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'interactive' | 'compact';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-2xl border transition-all duration-150';
  
  const variantClasses = {
    default: 'p-6 border-gray-200/80 shadow-xs',
    outlined: 'p-6 border-gray-200 shadow-none',
    elevated: 'p-6 border-gray-100 shadow-md',
    interactive: 'p-6 border-gray-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md cursor-pointer',
    compact: 'p-4 border-gray-200/80 shadow-xs'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
