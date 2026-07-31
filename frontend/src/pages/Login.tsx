import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthCard } from '../components/auth/AuthCard';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine return URL from location state
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleSuccessRedirect = () => {
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout>
      <AuthCard onSuccessRedirect={handleSuccessRedirect} />
    </AuthLayout>
  );
};

export default Login;
