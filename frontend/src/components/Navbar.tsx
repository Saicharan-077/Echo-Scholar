import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Command, 
  Sun, 
  Moon, 
  UserCheck, 
  ChevronDown 
} from 'lucide-react';
import { JUDGE_PERSONAS, loginWithPersona } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [selectedPersona, setSelectedPersona] = useState<string>('Standard Student');
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
      const match = JUDGE_PERSONAS.find(p => p.email === savedEmail);
      if (match) setSelectedPersona(match.role);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsPersonaOpen(false);
  }, [location.pathname]);

  const handleSwitchPersona = async (persona: typeof JUDGE_PERSONAS[0]) => {
    try {
      await loginWithPersona(persona.email, persona.password);
      setSelectedPersona(persona.role);
      setIsPersonaOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

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
            EchoXScholar <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">X</span>
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

          {/* Persona Switcher */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="px-2.5 py-1.5 text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="hidden sm:inline text-gray-400 dark:text-gray-500">Persona:</span>
              <strong className="font-medium text-gray-800 dark:text-gray-200">{selectedPersona}</strong>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2.5 z-50 animate-in fade-in duration-150">
                <div className="px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-700 mb-1.5">
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Demo Persona Switcher
                  </p>
                </div>
                <div className="space-y-1">
                  {JUDGE_PERSONAS.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => handleSwitchPersona(p)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                        selectedPersona === p.role
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-medium'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{p.role}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">{p.badge}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Action Button */}
          <Link 
            to="/profile" 
            className="btn-primary text-xs px-3.5 py-1.5 font-semibold shadow-xs"
          >
            Profile
          </Link>

        </div>

      </div>
    </header>
  );
};
