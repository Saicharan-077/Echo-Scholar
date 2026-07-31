import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Brain, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 animate-pulse">
          <Brain className="w-6 h-6 text-indigo-100" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
          <span>Verifying EchoXScholar Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
