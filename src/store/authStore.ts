/**
 * Auth store - Zustand state management for authentication
 * Manages user auth state, login/logout, and token persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, type LoginResponse, type AuthError } from '@/api';
import { setToken, clearToken } from '@/utils';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      loading: false,
      error: null,

      /**
       * Login user with email and password
       */
      login: async (email: string, password: string, rememberMe: boolean = false) => {
        set({ loading: true, error: null });

        try {
          const response: LoginResponse = await loginApi({ email, password, rememberMe });

          // Store token separately for backwards compatibility
          setToken(response.token, rememberMe);

          // Update state (will be persisted automatically)
          set({
            isLoggedIn: true,
            user: response.user,
            token: response.token,
            loading: false,
            error: null,
          });
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoggedIn: false,
            user: null,
            token: null,
            loading: false,
            error: authError.message || 'Login failed. Please try again.',
          });

          throw authError;
        }
      },

      /**
       * Logout user
       */
      logout: () => {
        clearToken();
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          error: null,
        });
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'hcms-auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

