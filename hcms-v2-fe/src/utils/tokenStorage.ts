/**
 * Token storage utilities
 * Handles secure storage and retrieval of JWT tokens
 * Uses httpOnly cookies when available, falls back to localStorage
 */

const TOKEN_KEY = 'hcms_auth_token';
const COOKIE_NAME = 'hcms_token';
const REMEMBER_ME_KEY = 'hcms_remember_session';
const USER_KEY = 'hcms_auth_user';

/**
 * Store authentication token
 * Attempts to use httpOnly cookie (via server Set-Cookie header)
 * Falls back to localStorage if not set by server
 * @param token - JWT token to store
 * @param rememberMe - whether to persist session across browser close
 */
export function setToken(token: string, rememberMe: boolean = false): void {
  try {
    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    // Prefer httpOnly cookie (set by server)
    // If not available, fall back to localStorage
    const existingToken = getCookie(COOKIE_NAME);
    if (!existingToken) {
      // Server didn't set httpOnly cookie, use localStorage
      localStorage.setItem(TOKEN_KEY, token);
    }
    // If httpOnly cookie exists, we don't need to do anything
    // The browser will automatically include it in requests
  } catch (error) {
    console.warn('Failed to store token:', error);
    // Fall back to localStorage
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      }
    } catch (localStorageError) {
      console.error('Failed to store token in localStorage:', localStorageError);
    }
  }
}

/**
 * Retrieve authentication token
 * @returns JWT token or null if not found
 */
export function getToken(): string | null {
  try {
    // First check httpOnly cookie (via backend)
    const cookieToken = getCookie(COOKIE_NAME);
    if (cookieToken) {
      return cookieToken;
    }

    // Fall back to localStorage
    const localToken = localStorage.getItem(TOKEN_KEY);
    return localToken;
  } catch (error) {
    console.warn('Failed to retrieve token:', error);
    return null;
  }
}

/**
 * Clear authentication token and user data
 * Removes token from both cookie and localStorage
 */
export function clearToken(): void {
  try {
    // Clear from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(USER_KEY);

    // Clear cookie by setting expiry to past
    deleteCookie(COOKIE_NAME);
  } catch (error) {
    console.warn('Failed to clear token:', error);
  }
}

/**
 * Check if user is authenticated (token exists)
 * @returns true if token exists
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Store user data in localStorage
 * @param user - User object to store
 */
export function setUser(user: unknown): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn('Failed to store user data:', error);
  }
}

/**
 * Retrieve user data from localStorage
 * @returns User object or null if not found
 */
export function getUser(): unknown | null {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Failed to retrieve user data:', error);
    return null;
  }
}

/**
 * Clear user data from localStorage
 */
export function clearUser(): void {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.warn('Failed to clear user data:', error);
  }
}

/**
 * Get cookie value by name
 * @param name - cookie name
 * @returns cookie value or empty string
 */
function getCookie(name: string): string {
  try {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
  } catch (error) {
    console.warn('Failed to read cookie:', error);
  }
  return '';
}

/**
 * Delete cookie by setting expiry to past
 * @param name - cookie name
 */
function deleteCookie(name: string): void {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.warn('Failed to delete cookie:', error);
  }
}
