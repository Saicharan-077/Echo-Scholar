import React from 'react';

export const PageTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight ${className}`}>
    {children}
  </h1>
);

export const Heading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight ${className}`}>
    {children}
  </h2>
);

export const SubHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight ${className}`}>
    {children}
  </h3>
);

export const Body: React.FC<{ children: React.ReactNode; className?: string; serif?: boolean }> = ({ children, className = '', serif = false }) => (
  <p className={`${serif ? 'font-serif text-[19px] leading-[1.85]' : 'font-sans text-base leading-relaxed'} text-gray-800 ${className}`}>
    {children}
  </p>
);

export const Caption: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-xs text-gray-500 font-medium ${className}`}>
    {children}
  </span>
);

export const Muted: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-xs text-gray-400 font-mono ${className}`}>
    {children}
  </span>
);

export const CodeText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <code className={`font-mono text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 ${className}`}>
    {children}
  </code>
);
