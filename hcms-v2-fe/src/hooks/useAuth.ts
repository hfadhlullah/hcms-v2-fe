/**
 * Custom hook for auth state
 * Provides easy access to auth state and actions from components
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';

export function useAuth() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    user,
    token,
    loading,
    error,
    login: authLogin,
    logout: authLogout,
    clearError,
  } = useAuthStore();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    await authLogin(email, password, rememberMe);
    // Navigate to dashboard on successful login
    navigate('/dashboard');
  };

  const logout = () => {
    authLogout();
    // Navigate to login on logout
    navigate('/login');
  };

  return {
    isLoggedIn,
    user,
    token,
    loading,
    error,
    login,
    logout,
    clearError,
  };
}
