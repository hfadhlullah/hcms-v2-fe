/**
 * LoginPage component - Refactored with atomic design components
 * Displays email/password form with error handling and loading state
 */

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks';
import '@/styles/LoginPage.css';

// Atomic design components
import { Button, Input, Checkbox } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import { ErrorAlert } from '@/components/organisms';

export const LoginPage: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isInitialized = useRef(false);

  // Load saved credentials on component mount
  useEffect(() => {
    if (!isInitialized.current) {
      const savedEmail = localStorage.getItem('hcms_remember_email');
      const savedRememberMe = localStorage.getItem('hcms_remember_me') === 'true';

      if (savedEmail && savedRememberMe) {
        // Batch state updates
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmail(savedEmail);
        setRememberMe(true);
      }
      isInitialized.current = true;
    }
  }, []);

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearError();
    if (validationErrors.email) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    clearError();
    if (validationErrors.password) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 1) {
      newErrors.password = 'Password is required';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Save or clear remember me credentials
      if (rememberMe) {
        localStorage.setItem('hcms_remember_email', email.trim().toLowerCase());
        localStorage.setItem('hcms_remember_me', 'true');
      } else {
        localStorage.removeItem('hcms_remember_email');
        localStorage.removeItem('hcms_remember_me');
      }

      await login(email.trim().toLowerCase(), password, rememberMe);
      // On success, auth state will redirect to dashboard
      // Password cleared after submission (handled in login function)
      setPassword('');
    } catch {
      // Error is handled by useAuth hook and displayed below
      // Clear password on auth error for security
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1 className="app-title">HCMS</h1>
          <p className="app-subtitle">Time & Attendance</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Error Alert */}
          {error && <ErrorAlert message={error} onDismiss={clearError} />}

          {/* Email Field */}
          <FormField label="Email Address" error={validationErrors.email}>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              autoComplete="email"
              error={!!validationErrors.email}
            />
          </FormField>

          {/* Password Field */}
          <FormField label="Password" error={validationErrors.password}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              autoComplete="current-password"
              error={!!validationErrors.password}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          </FormField>

          {/* Remember Me Checkbox */}
          <div className="form-group">
            <Checkbox
              id="remember-me"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => {
                setRememberMe(e.target.checked);
                if (!e.target.checked) {
                  // Clear saved credentials when unchecking
                  localStorage.removeItem('hcms_remember_email');
                  localStorage.removeItem('hcms_remember_me');
                }
              }}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="login-footer">
          <a href="#forgot-password" className="link-forgot">
            Forgot password?
          </a>
        </div>

        {/* Copyright */}
        <div className="login-copyright">
          <p>&copy; 2025 HCMS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
