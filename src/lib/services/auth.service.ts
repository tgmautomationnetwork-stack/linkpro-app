// Auth API Service
export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
  expires_in?: number;
  dev_otp?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    full_name: string;
    subscription_plan: string;
  };
}

export interface SendOtpRequest {
  whatsapp_number: string;
  action: 'signup' | 'login';
}

export interface VerifyOtpRequest {
  whatsapp_number: string;
  code: string;
  username?: string;
  full_name?: string;
}

export class AuthService {
  private static baseUrl = '/api/auth';

  static async sendOtp(data: SendOtpRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de l\'envoi du code',
        };
      }

      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  static async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la vérification',
        };
      }

      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('linkpro_token', result.token);
        localStorage.setItem('linkpro_user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('linkpro_token');
    localStorage.removeItem('linkpro_user');
    window.location.href = '/';
  }

  static getToken(): string | null {
    return localStorage.getItem('linkpro_token');
  }

  static getUser(): any | null {
    const user = localStorage.getItem('linkpro_user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
