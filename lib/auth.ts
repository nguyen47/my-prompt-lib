export interface User {
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'promptlib_user';

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const user = localStorage.getItem(this.STORAGE_KEY);
    return !!user;
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.STORAGE_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // Login with email and password using API
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success && result.user) {
        // Store user in localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(result.user));
        return {
          success: true,
          user: result.user
        };
      } else {
        return {
          success: false,
          error: result.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  // Logout
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
