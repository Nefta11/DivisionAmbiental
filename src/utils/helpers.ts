import { 
  FILE_CONFIG, 
  VALIDATION_CONFIG, 
  ERROR_MESSAGES,
  DATE_FORMATS,
  STATUS_COLORS,
  PRIORITY_COLORS 
} from './constants';

// Utilidades para validación
export const validateEmail = (email: string): boolean => {
  return VALIDATION_CONFIG.EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_CONFIG.PHONE_REGEX.test(phone);
};

export const validateURL = (url: string): boolean => {
  return VALIDATION_CONFIG.URL_REGEX.test(url);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }
  
  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula.');
  }
  
  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula.');
  }
  
  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número.');
  }
  
  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    
    errors.push('La contraseña debe contener al menos un símbolo especial.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Utilidades para archivos
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Verificar tamaño
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.FILE_TOO_LARGE} Tamaño máximo: ${formatFileSize(FILE_CONFIG.MAX_SIZE)}.`,
    };
  }
  
  // Verificar tipo
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !FILE_CONFIG.ALLOWED_TYPES.includes(fileExtension)) {
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.FILE_TYPE_NOT_ALLOWED} Tipos permitidos: ${FILE_CONFIG.ALLOWED_TYPES.join(', ')}.`,
    };
  }
  
  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (FILE_CONFIG.ALLOWED_IMAGE_TYPES.includes(extension || '')) {
    return '🖼️';
  } else if (FILE_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(extension || '')) {
    return '📄';
  } else if (FILE_CONFIG.ALLOWED_VIDEO_TYPES.includes(extension || '')) {
    return '🎥';
  } else if (FILE_CONFIG.ALLOWED_AUDIO_TYPES.includes(extension || '')) {
    return '🎵';
  }
  
  return '📎';
};

// Utilidades para fechas
export const formatDate = (date: string | Date, format: string = DATE_FORMATS.DISPLAY): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  if (format === DATE_FORMATS.RELATIVE) {
    return formatRelativeDate(dateObj);
  }
  
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case DATE_FORMATS.DISPLAY:
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      break;
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
    default:
      return dateObj.toLocaleDateString('es-ES');
  }
  
  return dateObj.toLocaleDateString('es-ES', options);
};

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Hace unos segundos';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else {
    return formatDate(date, DATE_FORMATS.DISPLAY);
  }
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// Utilidades para texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const removeAccents = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const slugify = (text: string): string => {
  return removeAccents(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Utilidades para números
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'MXN'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Utilidades para colores
export const getStatusColors = (status: string) => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  };
};

export const getPriorityColors = (priority: string) => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  };
};

// Utilidades para URLs
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

// Utilidades para arrays
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Utilidades para objetos
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// Utilidades para localStorage
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error al leer localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error al escribir localStorage:', error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error al eliminar localStorage:', error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  },
};

// Utilidades para debugging
export const logger = {
  info: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

// Utilidades para performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Utilidades para dispositivos
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTablet = (): boolean => {
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
};

export const isDesktop = (): boolean => {
  return !isMobile() && !isTablet();
};

// Utilidades para notificaciones del navegador
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return Notification.permission;
};

export const showNotification = (title: string, options?: NotificationOptions): Notification | null => {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
  
  return null;
};