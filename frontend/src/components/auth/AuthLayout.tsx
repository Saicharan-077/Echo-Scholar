import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between items-center p-4 sm:p-6 font-sans text-gray-900 selection:bg-indigo-600 selection:text-white">
      
      {/* Simple Top Brand Header */}
      <header className="w-full max-w-md pt-6 flex justify-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">
            EchoScholar
          </span>
        </Link>
      </header>

      {/* Main Centered Login Content */}
      <main className="w-full max-w-md my-auto py-8">
        {children}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full max-w-md pb-6 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} EchoScholar. All rights reserved.</p>
      </footer>


    </div>
  );
};
