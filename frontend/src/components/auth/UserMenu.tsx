import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  Shield, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
      >
        <span>Sign In</span>
      </Link>
    );
  }

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'EX';
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-gray-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-200/80 flex items-center justify-center text-white font-bold text-xs shadow-xs overflow-hidden shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || 'User Profile'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span>{getInitials(user.full_name, user.email)}</span>
          )}
        </div>

        <div className="hidden md:block text-left pr-1">
          <span className="font-semibold text-xs text-gray-800 block leading-tight truncate max-w-[120px]">
            {user.full_name || user.username || user.email.split('@')[0]}
          </span>
          <span className="text-[10px] text-gray-400 block leading-none font-medium capitalize">
            {user.role || 'Scholar'}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(user.full_name, user.email)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-gray-900 truncate">
                  {user.full_name || user.username || 'Scholar'}
                </h4>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span className="capitalize">{user.role || 'Student'} Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="py-1">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600 transition-colors font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/workspace"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600 transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              <span>Research Workspace</span>
            </Link>

            <Link
              to="/professor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600 transition-colors font-medium"
            >
              <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              <span>Voice AI Professor</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600 transition-colors font-medium"
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              <span>Settings & DNA Profile</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 pt-1 mt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
