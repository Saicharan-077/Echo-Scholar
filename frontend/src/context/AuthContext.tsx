import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: authService.getToken(),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Auto-login / verify session on mount
  const initAuth = useCallback(async () => {
    const token = authService.getToken();
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null }));
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn('Session verification failed, clearing tokens:', err?.message);
      authService.clearTokens();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const loginWithGoogle = async (credential: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user, tokens } = await authService.loginWithGoogle(credential);
      setState({
        user,
        token: tokens.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Google Authentication failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: msg,
      }));
      throw new Error(msg);
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user, tokens } = await authService.loginWithCredentials(email, password);
      setState({
        user,
        token: tokens.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: msg,
      }));
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const refetchUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setState(prev => ({ ...prev, user }));
    } catch (e) {
      console.error('Failed to refetch user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginWithGoogle,
        loginWithCredentials,
        logout,
        clearError,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
