import { useState, useCallback } from 'react';
import { getErrorMessage, isNetworkError, isTimeoutError } from '../services/api';

// Interfaz para el estado de la API
interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isError: boolean;
}

// Interfaz para las opciones del hook
interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}

// Hook personalizado para manejar llamadas a la API
export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
  });

  // Función para ejecutar una llamada a la API
  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      }));

      const result = await apiCall();

      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        isSuccess: true,
        isError: false,
      }));

      // Callback de éxito
      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isSuccess: false,
        isError: true,
      }));

      // Callback de error
      if (options.onError) {
        options.onError(error);
      }

      // Re-lanzar el error para que pueda ser manejado por el componente
      throw error;
    }
  }, [options]);

  // Función para limpiar el estado
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  }, []);

  // Función para limpiar solo el error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      isError: false,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
    isNetworkError: state.error ? isNetworkError({ message: state.error }) : false,
    isTimeoutError: state.error ? isTimeoutError({ message: state.error }) : false,
  };
};

// Hook específico para operaciones CRUD
export const useCrudApi = <T = any>(options: UseApiOptions = {}) => {
  const createApi = useApi<T>(options);
  const readApi = useApi<T>(options);
  const updateApi = useApi<T>(options);
  const deleteApi = useApi<void>(options);

  return {
    create: createApi,
    read: readApi,
    update: updateApi,
    delete: deleteApi,
    
    // Estado combinado
    isLoading: createApi.isLoading || readApi.isLoading || updateApi.isLoading || deleteApi.isLoading,
    hasError: createApi.isError || readApi.isError || updateApi.isError || deleteApi.isError,
    
    // Función para limpiar todos los estados
    resetAll: () => {
      createApi.reset();
      readApi.reset();
      updateApi.reset();
      deleteApi.reset();
    },
    
    // Función para limpiar todos los errores
    clearAllErrors: () => {
      createApi.clearError();
      readApi.clearError();
      updateApi.clearError();
      deleteApi.clearError();
    },
  };
};

// Hook para manejar paginación
export const usePaginatedApi = <T = any>(options: UseApiOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const api = useApi<{ data: T[]; pagination: typeof pagination }>(options);

  const fetchPage = useCallback(async (
    apiCall: (page: number, limit: number) => Promise<{ data: T[]; pagination: typeof pagination }>,
    page: number = pagination.page,
    limit: number = pagination.limit
  ) => {
    const result = await api.execute(() => apiCall(page, limit));
    
    if (result) {
      setPagination(result.pagination);
    }
    
    return result;
  }, [api, pagination.page, pagination.limit]);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      return fetchPage(
        (page, limit) => api.execute(() => Promise.resolve({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } })),
        pagination.page + 1
      );
    }
  }, [pagination.page, pagination.totalPages, fetchPage, api]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      return fetchPage(
        (page, limit) => api.execute(() => Promise.resolve({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } })),
        pagination.page - 1
      );
    }
  }, [pagination.page, fetchPage, api]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      return fetchPage(
        (page, limit) => api.execute(() => Promise.resolve({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } })),
        page
      );
    }
  }, [pagination.totalPages, fetchPage, api]);

  return {
    ...api,
    pagination,
    fetchPage,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1,
  };
};

// Hook para manejar búsquedas con debounce
export const useSearchApi = <T = any>(
  searchFunction: (query: string) => Promise<T[]>,
  debounceMs: number = 300,
  options: UseApiOptions = {}
) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const api = useApi<T[]>(options);

  // Debounce del query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Ejecutar búsqueda cuando cambie el query con debounce
  React.useEffect(() => {
    if (debouncedQuery.trim()) {
      api.execute(() => searchFunction(debouncedQuery));
    } else {
      api.reset();
    }
  }, [debouncedQuery, searchFunction, api]);

  return {
    ...api,
    query,
    setQuery,
    debouncedQuery,
    isSearching: api.isLoading,
    results: api.data || [],
  };
};

// Hook para manejar uploads de archivos
export const useFileUpload = (options: UseApiOptions = {}) => {
  const [progress, setProgress] = useState(0);
  const api = useApi<{ url: string; filename: string }>(options);

  const upload = useCallback(async (
    uploadFunction: (file: File, onProgress?: (progress: number) => void) => Promise<{ url: string; filename: string }>,
    file: File
  ) => {
    setProgress(0);
    
    return api.execute(() => 
      uploadFunction(file, (progress) => setProgress(progress))
    );
  }, [api]);

  return {
    ...api,
    upload,
    progress,
    isUploading: api.isLoading,
  };
};