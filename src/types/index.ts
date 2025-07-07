// Tipos principales de la aplicación
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'operator';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Report {
  id: string;
  agente: string;
  nombreReportante: string;
  telefonoReportante: string;
  canalOrigen: string;
  urlReferencia: string;
  descripcion: string;
  ubicacion: string;
  categoriaDelito: string;
  prioridad: string;
  dependenciasInvolucradas: string[];
  responsableOperativo: string;
  equipoEspecial: string[];
  estudiosLaboratorio: string[];
  resultadosEstudios: File | null;
  inspeccionRealizada: string;
  medidasSancion: string[];
  evidenciaSancion: File | null;
  remediacionEjecutada: string[];
  altamenteMediatizable: string;
  comunicadoPublicado: string;
  ticketFinalizadoSatisfactoriamente: string;
  ticketFinalizadoNoSatisfactoriamente: string;
  fechaCreacion: string;
  estado: 'Pendiente' | 'En proceso' | 'Completado' | 'Cancelado';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  agente: string;
  nombreReportante: string;
  telefonoReportante: string;
  canalOrigen: string;
  urlReferencia?: string;
  descripcion: string;
  ubicacion: string;
  categoriaDelito: string;
  prioridad: string;
  dependenciasInvolucradas: string[];
  responsableOperativo?: string;
  equipoEspecial: string[];
  estudiosLaboratorio: string[];
  inspeccionRealizada?: string;
  medidasSancion: string[];
  remediacionEjecutada: string[];
  altamenteMediatizable?: string;
  comunicadoPublicado?: string;
  ticketFinalizadoSatisfactoriamente?: string;
  ticketFinalizadoNoSatisfactoriamente?: string;
}

export interface UpdateReportData extends Partial<CreateReportData> {
  estado?: 'Pendiente' | 'En proceso' | 'Completado' | 'Cancelado';
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  status: 'sent' | 'delivered' | 'read';
  userId: string;
  contactId: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  status?: string;
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Tipos para filtros y búsquedas
export interface ReportFilters {
  search?: string;
  priority?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface MessageFilters {
  contactId?: string;
  page?: number;
  limit?: number;
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState extends LoadingState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ReportsState extends LoadingState {
  reports: Report[];
  currentReport: Report | null;
  filters: ReportFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MessagesState extends LoadingState {
  messages: Message[];
  contacts: Contact[];
  currentContact: Contact | null;
  filters: MessageFilters;
}