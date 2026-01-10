/**
 * API interceptor - attaches JWT token to all API requests
 * Handles 401 responses by clearing auth and redirecting to login
 */

import { getToken, clearToken } from './tokenStorage';
import { useAuthStore } from '@/store';

/**
 * Intercept fetch calls to add Authorization header
 * Call this in App initialization
 */
export function setupApiInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    const [resource, config] = args;
    const fetchConfig = { ...config } as RequestInit;

    // Add Authorization header if token exists
    const token = getToken();
    if (token) {
      if (!fetchConfig.headers) {
        fetchConfig.headers = {};
      }

      const headers = fetchConfig.headers as Record<string, string>;
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Call original fetch
    return originalFetch(resource, fetchConfig).then((response) => {
      // Handle 401 Unauthorized - token may be expired
      // Only redirect if we had a token (meaning we were logged in)
      if (response.status === 401 && token) {
        clearToken();
        useAuthStore.setState({
          isLoggedIn: false,
          user: null,
          token: null,
        });

        // Redirect to login (window.location since this is outside React)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      return response;
    });
  };
}

/**
 * Helper function to make authenticated API calls
 * @param url - API endpoint
 * @param options - fetch options
 * @returns fetch response
 */
export async function apiCall(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = (options.headers || {}) as Record<string, string>;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  return fetch(url, { ...options, headers });
}
