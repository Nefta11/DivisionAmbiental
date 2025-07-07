import { useState, useEffect, useCallback } from 'react';

// Hook para manejar localStorage de forma reactiva
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Función para obtener el valor inicial
  const getInitialValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // Estado local
  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // Función para actualizar el valor
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en el estado local
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar evento personalizado para sincronizar entre pestañas
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Error al escribir en localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Función para eliminar el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value: null }
      }));
    } catch (error) {
      console.error(`Error al eliminar localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Escuchar cambios en localStorage (para sincronizar entre pestañas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error al parsear localStorage key "${key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
      }
    };

    // Escuchar eventos nativos de storage (cambios desde otras pestañas)
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar eventos personalizados (cambios desde la misma pestaña)
    window.addEventListener('localStorage-change', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook para manejar múltiples valores de localStorage
export const useMultipleLocalStorage = <T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
) => {
  const [values, setValues] = useState<T>(() => {
    const result = {} as T;
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(key as string);
        result[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        console.error(`Error al leer localStorage key "${key as string}":`, error);
        result[key] = initialValues[key];
      }
    });
    return result;
  });

  const setValue = useCallback((key: keyof T, value: T[keyof T] | ((val: T[keyof T]) => T[keyof T])) => {
    try {
      const valueToStore = value instanceof Function ? value(values[key]) : value;
      
      setValues(prev => ({ ...prev, [key]: valueToStore }));
      window.localStorage.setItem(key as string, JSON.stringify(valueToStore));
      
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Error al escribir en localStorage key "${key as string}":`, error);
    }
  }, [values]);

  const removeValue = useCallback((key: keyof T) => {
    try {
      setValues(prev => ({ ...prev, [key]: initialValues[key] }));
      window.localStorage.removeItem(key as string);
      
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value: null }
      }));
    } catch (error) {
      console.error(`Error al eliminar localStorage key "${key as string}":`, error);
    }
  }, [initialValues]);

  const clearAll = useCallback(() => {
    keys.forEach(key => {
      try {
        window.localStorage.removeItem(key as string);
      } catch (error) {
        console.error(`Error al eliminar localStorage key "${key as string}":`, error);
      }
    });
    setValues(initialValues);
  }, [keys, initialValues]);

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (keys.includes(e.key as keyof T) && e.newValue !== null) {
        try {
          setValues(prev => ({
            ...prev,
            [e.key as keyof T]: JSON.parse(e.newValue!)
          }));
        } catch (error) {
          console.error(`Error al parsear localStorage key "${e.key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (keys.includes(e.detail.key as keyof T)) {
        setValues(prev => ({
          ...prev,
          [e.detail.key]: e.detail.value ?? initialValues[e.detail.key as keyof T]
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange as EventListener);
    };
  }, [keys, initialValues]);

  return {
    values,
    setValue,
    removeValue,
    clearAll,
  };
};

// Hook para manejar configuraciones de usuario
export const useUserPreferences = () => {
  return useMultipleLocalStorage(
    ['theme', 'language', 'notifications', 'sidebarCollapsed'],
    {
      theme: 'light' as 'light' | 'dark',
      language: 'es' as string,
      notifications: true as boolean,
      sidebarCollapsed: false as boolean,
    }
  );
};

// Hook para manejar filtros persistentes
export const usePersistentFilters = <T extends Record<string, any>>(
  key: string,
  initialFilters: T
) => {
  const [filters, setFilters, clearFilters] = useLocalStorage(key, initialFilters);

  const updateFilter = useCallback((filterKey: keyof T, value: T[keyof T]) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [setFilters, initialFilters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    clearFilters,
  };
};