// Constantes de la aplicación
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'División Ambiental',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB por defecto
  ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png,mp4,mp3').split(','),
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  ALLOWED_DOCUMENT_TYPES: ['pdf', 'doc', 'docx', 'txt'],
  ALLOWED_VIDEO_TYPES: ['mp4', 'avi', 'mov', 'wmv'],
  ALLOWED_AUDIO_TYPES: ['mp3', 'wav', 'ogg', 'm4a'],
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  ENABLED: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true',
  VAPID_PUBLIC_KEY: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  DEFAULT_DURATION: 5000,
  POSITION: 'top-right' as const,
};

// Estados de reportes
export const REPORT_STATUSES = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
} as const;

// Prioridades de reportes
export const REPORT_PRIORITIES = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
} as const;

// Categorías de delitos ambientales
export const ENVIRONMENTAL_CATEGORIES = {
  WATER_POLLUTION: 'Contaminación del agua',
  AIR_POLLUTION: 'Contaminación del aire',
  SOIL_POLLUTION: 'Contaminación del suelo',
  NOISE_POLLUTION: 'Ruido excesivo',
  WASTE_MANAGEMENT: 'Manejo inadecuado de residuos',
  DEFORESTATION: 'Deforestación',
  ILLEGAL_HUNTING: 'Caza ilegal',
  ILLEGAL_FISHING: 'Pesca ilegal',
  IRREGULAR_CONSTRUCTION: 'Construcción irregular',
  CHEMICAL_SPILL: 'Vertido de químicos',
  FIRE: 'Incendio',
  OTHER: 'Otro',
} as const;

// Canales de origen
export const ORIGIN_CHANNELS = {
  PHONE: 'Teléfono',
  EMAIL: 'Correo electrónico',
  SOCIAL_MEDIA: 'Redes sociales',
  IN_PERSON: 'Presencial',
  WEBSITE: 'Página web',
  MOBILE_APP: 'Aplicación móvil',
  OTHER: 'Otro',
} as const;

// Dependencias disponibles
export const DEPENDENCIES = {
  FUERZA_CIVIL: 'Fuerza Civil',
  PROCURADURIA_AMBIENTAL: 'Procuraduría Ambiental',
  AGUA_Y_DRENAJE: 'Agua y Drenaje',
  BOMBEROS: 'Bomberos',
  PROTECCION_CIVIL: 'Protección Civil',
  SEMAR: 'SEMAR',
  SEDENA: 'SEDENA',
  GUARDIA_NACIONAL: 'Guardia Nacional',
  POLICIA_MUNICIPAL: 'Policía Municipal',
  PROFEPA: 'PROFEPA',
} as const;

// Equipos especiales
export const SPECIAL_EQUIPMENT = {
  HEAVY_MACHINERY: 'Maquinaria pesada',
  DRAINAGE_REPAIR: 'Reparación de drenaje',
  CHEMICAL_CONTAINMENT: 'Contención química',
  DIVING_EQUIPMENT: 'Equipo de buceo',
  DRONES: 'Drones',
  MOBILE_LAB: 'Laboratorio móvil',
  RESCUE_EQUIPMENT: 'Equipo de rescate',
  SPECIALIZED_VEHICLES: 'Vehículos especializados',
  MEASUREMENT_EQUIPMENT: 'Equipos de medición',
  CLEANING_MATERIALS: 'Material de limpieza',
} as const;

// Estudios de laboratorio
export const LAB_STUDIES = {
  WATER: 'Agua',
  SOIL: 'Suelo',
  AIR: 'Aire',
  BLOOD: 'Sangre',
  FLORA: 'Flora',
  FAUNA: 'Fauna',
  TOXINS: 'Toxinas',
  HEAVY_METALS: 'Metales pesados',
  HYDROCARBONS: 'Hidrocarburos',
  PESTICIDES: 'Pesticidas',
} as const;

// Medidas de sanción
export const SANCTION_MEASURES = {
  TOTAL_CLOSURE: 'Clausura total',
  PARTIAL_CLOSURE: 'Clausura parcial',
  FINE: 'Multa',
  PRISON: 'Prisión',
  COMMUNITY_SERVICE: 'Trabajo comunitario',
  ACTIVITY_SUSPENSION: 'Suspensión de actividades',
  CONFISCATION: 'Decomiso',
} as const;

// Medidas de remediación
export const REMEDIATION_MEASURES = {
  CLEANING: 'Limpieza',
  REFORESTATION: 'Reforestación',
  DONATION: 'Donación',
  ECOSYSTEM_RESTORATION: 'Restauración de ecosistema',
  SOIL_TREATMENT: 'Tratamiento de suelos',
  WATER_FILTRATION: 'Filtración de agua',
  CONTINUOUS_MONITORING: 'Monitoreo continuo',
} as const;

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  OPERATOR: 'operator',
} as const;

// Configuración de validación
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: false,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  URL_REGEX: /^https?:\/\/.+/,
};

// Configuración de tiempo
export const TIME_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos antes de expirar
  DEBOUNCE_DELAY: 300, // 300ms para búsquedas
  TOAST_DURATION: 5000, // 5 segundos
  LOADING_DELAY: 200, // Delay antes de mostrar loading
};

// Configuración de colores para estados
export const STATUS_COLORS = {
  [REPORT_STATUSES.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  [REPORT_STATUSES.IN_PROGRESS]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  [REPORT_STATUSES.COMPLETED]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  [REPORT_STATUSES.CANCELLED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

// Configuración de colores para prioridades
export const PRIORITY_COLORS = {
  [REPORT_PRIORITIES.LOW]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  [REPORT_PRIORITIES.MEDIUM]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  [REPORT_PRIORITIES.HIGH]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
  },
  [REPORT_PRIORITIES.CRITICAL]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  TIMEOUT_ERROR: 'La solicitud ha tardado demasiado tiempo.',
  UNAUTHORIZED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande.',
  FILE_TYPE_NOT_ALLOWED: 'Tipo de archivo no permitido.',
  REQUIRED_FIELD: 'Este campo es obligatorio.',
  INVALID_EMAIL: 'El formato del correo electrónico no es válido.',
  INVALID_PHONE: 'El formato del teléfono no es válido.',
  INVALID_URL: 'El formato de la URL no es válido.',
  PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} caracteres.`,
  PASSWORD_REQUIREMENTS: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Sesión iniciada correctamente.',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
  REPORT_CREATED: 'Reporte creado exitosamente.',
  REPORT_UPDATED: 'Reporte actualizado exitosamente.',
  REPORT_DELETED: 'Reporte eliminado exitosamente.',
  MESSAGE_SENT: 'Mensaje enviado correctamente.',
  FILE_UPLOADED: 'Archivo subido exitosamente.',
  SETTINGS_SAVED: 'Configuración guardada correctamente.',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente.',
  EMAIL_SENT: 'Correo enviado correctamente.',
};

// Configuración de URLs externas
export const EXTERNAL_URLS = {
  GOOGLE_MAPS_API: 'https://maps.googleapis.com/maps/api/js',
  GOOGLE_MAPS_EMBED: 'https://www.google.com/maps/embed/v1',
  TERMS_OF_SERVICE: '/terms',
  PRIVACY_POLICY: '/privacy',
  SUPPORT_EMAIL: 'soporte@divisionambiental.gob.mx',
  SUPPORT_PHONE: '+52 664 123 4567',
};

// Configuración de formato de fechas
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  RELATIVE: 'relative', // Para fechas relativas como "hace 2 horas"
};

// Configuración de idiomas
export const LANGUAGE_CONFIG = {
  DEFAULT: 'es',
  SUPPORTED: ['es', 'en'],
  FALLBACK: 'es',
};