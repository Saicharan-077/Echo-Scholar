import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { AlertCircle, Loader2, Info } from 'lucide-react';

interface GoogleLoginButtonProps {
  onSuccessRedirect?: () => void;
  disabled?: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccessRedirect,
  disabled = false,
}) => {
  const { loginWithGoogle, loginWithCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [originHelp, setOriginHelp] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isConfigured = Boolean(
    googleClientId &&
    !googleClientId.includes('your-google-client-id') &&
    googleClientId.length > 5
  );

  const handleGoogleSuccess = async (token: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle(token);
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (err: any) {
      console.error('Backend Google verification error:', err);
      setErrorMsg(err.message || 'Failed to authenticate with backend server.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleSuccess(tokenResponse.access_token);
    },
    onError: (errorResponse) => {
      console.warn('Google Sign-In Error:', errorResponse);
      setOriginHelp(true);
      setErrorMsg('Google OAuth Origin Error: http://localhost:2679 needs to be added to Authorized JavaScript Origins in Google Cloud Console.');
      setLoading(false);
    },
  });

  const handleClick = () => {
    if (loading || disabled) return;
    setErrorMsg(null);

    if (!isConfigured) {
      setErrorMsg('VITE_GOOGLE_CLIENT_ID is not configured in .env. Click below for instant Demo Login.');
      return;
    }

    try {
      setLoading(true);
      triggerGoogleLogin();
    } catch (err: any) {
      console.error('Google trigger exception:', err);
      setErrorMsg('Could not launch Google Sign-in popup.');
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithCredentials('demo@EchoXScholar.ai', 'Demo@123');
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (e: any) {
      setErrorMsg(e.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Primary Google Sign-In Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        aria-label="Continue with Google"
        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-gray-700 bg-white border border-gray-300 shadow-2xs hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer ${
          loading || disabled ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="font-semibold text-gray-800">
          {loading ? 'Signing in...' : 'Continue with Google'}
        </span>
      </button>

      {/* Origin Configuration Help Notification if Google 403 Origin Error happens */}
      {originHelp && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-2">
          <div className="flex items-start gap-2 font-semibold text-amber-800">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Google Cloud Origin Setup Required</span>
          </div>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            In Google Cloud Console, add <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">http://localhost:2679</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">http://localhost:5173</code> to <strong>Authorized JavaScript origins</strong> for your OAuth Client ID.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <p>{errorMsg}</p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-xs font-bold text-indigo-600 hover:underline block cursor-pointer"
            >
              ⚡ Instant 1-Click Demo Login (Continue to App) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
