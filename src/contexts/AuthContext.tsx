import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, LoginCredentials, AuthState } from '../types';
import { getErrorMessage, isUnauthorizedError } from '../services/api';

// Tipos para las acciones del reducer
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer para manejar el estado de autenticación
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...initialState,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Interfaz del contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar estado de autenticación al cargar la aplicación
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user && authService.isAuthenticated()) {
        // Verificar si el token es válido
        const validToken = await authService.ensureValidToken();
        
        if (validToken) {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token: validToken } 
          });
        } else {
          // Token inválido, limpiar datos
          await authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const authData = await authService.login(credentials);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: authData.user, 
          token: authData.token 
        } 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar logout local aunque falle el servidor
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Función para refrescar información del usuario
  const refreshUser = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      
      // Si es error de autorización, cerrar sesión
      if (isUnauthorizedError(error)) {
        await logout();
      } else {
        const errorMessage = getErrorMessage(error);
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para limpiar errores
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Valor del contexto
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Hook para verificar si el usuario está autenticado
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Hook para obtener el usuario actual
export const useCurrentUser = (): User | null => {
  const { user } = useAuth();
  return user;
};

// Hook para verificar roles
export const useHasRole = (role: string): boolean => {
  const { user } = useAuth();
  return user?.role === role;
};

// Hook para verificar múltiples roles
export const useHasAnyRole = (roles: string[]): boolean => {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
};