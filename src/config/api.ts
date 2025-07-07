// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Reportes
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: string) => `/reports/${id}`,
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    UPLOAD_FILE: (id: string) => `/reports/${id}/upload`,
    DOWNLOAD_FILE: (id: string, fileType: string) => `/reports/${id}/download/${fileType}`,
    EXPORT: '/reports/export',
    STATS: '/reports/stats',
  },
  
  // Mensajes y Chat
  MESSAGES: {
    LIST: '/messages',
    CREATE: '/messages',
    GET: (id: string) => `/messages/${id}`,
    UPDATE: (id: string) => `/messages/${id}`,
    DELETE: (id: string) => `/messages/${id}`,
    MARK_READ: (id: string) => `/messages/${id}/read`,
  },
  
  // Contactos
  CONTACTS: {
    LIST: '/contacts',
    CREATE: '/contacts',
    GET: (id: string) => `/contacts/${id}`,
    UPDATE: (id: string) => `/contacts/${id}`,
    DELETE: (id: string) => `/contacts/${id}`,
    ARCHIVE: (id: string) => `/contacts/${id}/archive`,
  },
  
  // Usuarios
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  
  // Archivos
  FILES: {
    UPLOAD: '/files/upload',
    DELETE: (id: string) => `/files/${id}`,
    GET: (id: string) => `/files/${id}`,
  },
  
  // Dashboard y estadísticas
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
    NOTIFICATIONS: '/dashboard/notifications',
  },
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Configuración de interceptores
export const INTERCEPTOR_CONFIG = {
  REQUEST: {
    TIMEOUT_MESSAGE: 'La solicitud ha tardado demasiado tiempo',
    NETWORK_ERROR_MESSAGE: 'Error de conexión. Verifica tu conexión a internet',
  },
  RESPONSE: {
    UNAUTHORIZED_MESSAGE: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
    FORBIDDEN_MESSAGE: 'No tienes permisos para realizar esta acción',
    NOT_FOUND_MESSAGE: 'El recurso solicitado no fue encontrado',
    SERVER_ERROR_MESSAGE: 'Error interno del servidor. Intenta nuevamente más tarde',
  },
};