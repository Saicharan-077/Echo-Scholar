import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'icon' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs gap-2',
    lg: 'px-6 py-3 text-sm gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs border border-transparent',
    secondary: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 shadow-xs',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent',
    outline: 'bg-transparent border border-indigo-200 text-indigo-600 hover:bg-indigo-50',
    icon: 'p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-transparent'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
