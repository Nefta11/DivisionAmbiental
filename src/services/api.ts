import { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS, INTERCEPTOR_CONFIG } from '../config/api';
import { ApiResponse, PaginatedResponse, ApiError } from '../types';

// Clase para manejar errores de API
export class ApiErrorClass extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Función para obtener el token de autenticación
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Función para manejar la respuesta de la API
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  let data;
  if (isJson) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = data?.message || getErrorMessage(response.status);
    const errorCode = data?.code || response.status.toString();
    throw new ApiErrorClass(errorMessage, errorCode, data);
  }

  return data;
};

// Función para obtener mensajes de error por código de estado
const getErrorMessage = (status: number): string => {
  switch (status) {
    case 401:
      return INTERCEPTOR_CONFIG.RESPONSE.UNAUTHORIZED_MESSAGE;
    case 403:
      return INTERCEPTOR_CONFIG.RESPONSE.FORBIDDEN_MESSAGE;
    case 404:
      return INTERCEPTOR_CONFIG.RESPONSE.NOT_FOUND_MESSAGE;
    case 500:
    case 502:
    case 503:
    case 504:
      return INTERCEPTOR_CONFIG.RESPONSE.SERVER_ERROR_MESSAGE;
    default:
      return 'Ha ocurrido un error inesperado';
  }
};

// Función para realizar peticiones con reintentos
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<Response> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0 && error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiErrorClass(INTERCEPTOR_CONFIG.REQUEST.TIMEOUT_MESSAGE, 'TIMEOUT');
      }
      
      // Reintento con delay exponencial
      await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.RETRY_DELAY * (API_CONFIG.RETRY_ATTEMPTS - retries + 1))
      );
      return fetchWithRetry(url, options, retries - 1);
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiErrorClass(INTERCEPTOR_CONFIG.REQUEST.TIMEOUT_MESSAGE, 'TIMEOUT');
    }
    
    throw new ApiErrorClass(INTERCEPTOR_CONFIG.REQUEST.NETWORK_ERROR_MESSAGE, 'NETWORK_ERROR');
  }
};

// Clase principal para manejar las peticiones a la API
export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Método privado para construir headers
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...DEFAULT_HEADERS };
    
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  // Método privado para construir URL con parámetros
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    return url.toString();
  }

  // Método GET
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    return handleResponse<T>(response);
  }

  // Método POST
  async post<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(customHeaders);

    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    // Si es FormData, no establecer Content-Type (el navegador lo hará automáticamente)
    if (data instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers,
      body,
    });

    return handleResponse<T>(response);
  }

  // Método PUT
  async put<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(customHeaders);

    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    if (data instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetchWithRetry(url, {
      method: 'PUT',
      headers,
      body,
    });

    return handleResponse<T>(response);
  }

  // Método PATCH
  async patch<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(customHeaders);

    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    if (data instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetchWithRetry(url, {
      method: 'PATCH',
      headers,
      body,
    });

    return handleResponse<T>(response);
  }

  // Método DELETE
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders();

    const response = await fetchWithRetry(url, {
      method: 'DELETE',
      headers,
    });

    return handleResponse<T>(response);
  }

  // Método para subir archivos
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    return this.post<T>(endpoint, formData);
  }

  // Método para descargar archivos
  async downloadFile(endpoint: string): Promise<Blob> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.message || getErrorMessage(response.status);
      throw new ApiErrorClass(errorMessage, response.status.toString(), errorData);
    }

    return response.blob();
  }
}

// Instancia singleton del servicio de API
export const apiService = new ApiService();

// Funciones de utilidad para manejo de errores
export const isApiError = (error: any): error is ApiErrorClass => {
  return error instanceof ApiErrorClass;
};

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

export const isNetworkError = (error: any): boolean => {
  return isApiError(error) && error.code === 'NETWORK_ERROR';
};

export const isTimeoutError = (error: any): boolean => {
  return isApiError(error) && error.code === 'TIMEOUT';
};

export const isUnauthorizedError = (error: any): boolean => {
  return isApiError(error) && error.code === '401';
};