import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { User, LoginCredentials, AuthResponse, ApiResponse } from '../types';

export class AuthService {
  // Claves para localStorage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const authData = response.data;
      
      // Guardar tokens y usuario en localStorage
      this.setTokens(authData.token, authData.refreshToken);
      this.setUser(authData.user);

      return authData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      // Intentar cerrar sesión en el servidor
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
      // Continuar con el logout local aunque falle el servidor
    } finally {
      // Limpiar datos locales
      this.clearAuthData();
    }
  }

  // Refrescar token
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await apiService.post<ApiResponse<{ token: string; refreshToken: string }>>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Actualizar tokens
      this.setTokens(token, newRefreshToken);

      return token;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Si falla el refresh, limpiar datos y redirigir al login
      this.clearAuthData();
      throw error;
    }
  }

  // Obtener información del usuario actual
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
      const user = response.data;
      
      // Actualizar usuario en localStorage
      this.setUser(user);
      
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  }

  // Registrar nuevo usuario (si está habilitado)
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      const authData = response.data;
      
      // Guardar tokens y usuario en localStorage
      this.setTokens(authData.token, authData.refreshToken);
      this.setUser(authData.user);

      return authData;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Solicitar restablecimiento de contraseña
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiService.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      throw error;
    }
  }

  // Restablecer contraseña
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  }

  // Métodos para manejar tokens y usuario en localStorage
  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al parsear usuario desde localStorage:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Verificar si el token está expirado (opcional, requiere decodificar JWT)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decodificar JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }

  // Método para verificar y refrescar token automáticamente
  async ensureValidToken(): Promise<string | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    if (this.isTokenExpired()) {
      try {
        return await this.refreshToken();
      } catch (error) {
        console.error('Error al refrescar token automáticamente:', error);
        return null;
      }
    }

    return token;
  }
}

// Instancia singleton del servicio de autenticación
export const authService = new AuthService();