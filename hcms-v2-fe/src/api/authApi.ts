/**
 * Auth API client - handles login requests to backend
 */

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
  expiresAt: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: string;
  traceId?: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies if using httpOnly
      body: JSON.stringify(request),
    });

    // Parse response body
    const data = await response.json();

    if (!response.ok) {
      // Handle error responses
      const error: AuthError = {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Login failed. Please try again.',
        details: data.details,
        traceId: data.traceId,
      };

      if (response.status === 429) {
        error.message = 'Too many login attempts. Please try again later.';
      } else if (response.status === 401) {
        error.message = 'Invalid email or password.';
      } else if (response.status === 400) {
        error.message = data.message || 'Invalid input. Please check your email and password.';
      }

      throw error;
    }

    return data as LoginResponse;
  } catch (error) {
    // Network or parsing error
    if (error instanceof TypeError) {
      throw {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your connection.',
      } as AuthError;
    }

    // Re-throw if already an AuthError
    if (error instanceof Object && 'code' in error) {
      throw error;
    }

    throw {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    } as AuthError;
  }
}
