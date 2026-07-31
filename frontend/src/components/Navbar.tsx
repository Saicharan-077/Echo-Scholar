import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Command, 
  Sun, 
  Moon
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { UserMenu } from './auth/UserMenu';

interface NavbarProps {
  onOpenSearch?: () => void;
}


export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'Discover', path: '/discover' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Upload PDF', path: '/upload' },
    { label: 'My Research', path: '/research' },
    { label: 'Community', path: '/community' },
    { label: 'Profile', path: '/profile' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-all">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
            EchoScholar
          </span>

        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/discover' && location.pathname === '/');
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Icon Toggle, Persona Switcher, Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Theme Toggle Button: ONLY Icon (Sun/Moon), NO text label */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>



          {/* User Profile Menu */}
          <UserMenu />


        </div>

      </div>
    </header>
  );
};
