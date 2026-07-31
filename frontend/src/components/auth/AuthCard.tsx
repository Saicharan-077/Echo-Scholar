import React, { useState } from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { JUDGE_PERSONAS } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Shield, UserCheck, AlertCircle, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface AuthCardProps {
  onSuccessRedirect?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccessRedirect }) => {
  const { loginWithCredentials, isLoading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter your email and password.');
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    try {
      await loginWithCredentials(email, password);
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (err: any) {
      setLocalError(err.message || 'Invalid email or password.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handlePersonaSelect = async (personaEmail: string) => {
    if (!personaEmail) return;
    const persona = JUDGE_PERSONAS.find(p => p.email === personaEmail);
    if (!persona) return;

    setSelectedPersona(personaEmail);
    setEmail(persona.email);
    setPassword(persona.password);
    setLocalLoading(true);
    setLocalError(null);

    try {
      await loginWithCredentials(persona.email, persona.password);
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (e: any) {
      setLocalError(e.message || 'Failed to login with persona');
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = localLoading || authLoading;
  const activeError = localError || authError;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      
      {/* Light Enterprise Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-7 sm:p-9 shadow-sm">
        
        {/* Header */}
        <div className="text-center space-y-1.5 mb-7">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Sign in to EchoScholar

          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Welcome back! Access your Cognitive Twin AI workspace.
          </p>
        </div>

        {/* Global Error Banner */}
        {activeError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="flex-1">{activeError}</p>
          </div>
        )}

        {/* 1. Primary Google OAuth Sign-In */}
        <div className="w-full">
          <GoogleLoginButton onSuccessRedirect={onSuccessRedirect} disabled={isLoading} />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/80" />
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="bg-white px-3 text-gray-400 font-medium uppercase tracking-wider">
              or continue with email
            </span>
          </div>
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-gray-700">Password</label>
              <a href="#" className="text-indigo-600 hover:underline text-[11px] font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Email Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In with Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 3. Demo Persona Shortcuts */}
        <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Demo Student Profiles</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {JUDGE_PERSONAS.slice(0, 3).map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => handlePersonaSelect(p.email)}
                disabled={isLoading}
                className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedPersona === p.email
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                    : 'bg-gray-50/60 hover:bg-gray-100/80 border-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-xs">{p.role}</span>
                </div>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                  1-Click Sign In
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Security Badge & Terms */}
        <div className="mt-7 text-center pt-5 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Google OAuth 2.0</span>
          </div>
          <p className="text-[10px] text-gray-400">
            By continuing, you agree to EchoScholar's{' '}

            <a href="#" className="text-gray-600 hover:underline font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gray-600 hover:underline font-medium">Privacy Policy</a>.
          </p>
        </div>

      </div>

    </div>
  );
};
