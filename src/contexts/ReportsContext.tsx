import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { reportsService } from '../services/reportsService';
import { 
  Report, 
  CreateReportData, 
  UpdateReportData, 
  ReportFilters, 
  ReportsState 
} from '../types';
import { getErrorMessage } from '../services/api';

// Tipos para las acciones del reducer
type ReportsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REPORTS'; payload: { reports: Report[]; pagination: any } }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_REPORT'; payload: Report }
  | { type: 'DELETE_REPORT'; payload: string }
  | { type: 'SET_CURRENT_REPORT'; payload: Report | null }
  | { type: 'SET_FILTERS'; payload: ReportFilters }
  | { type: 'CLEAR_REPORTS' }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: ReportsState = {
  reports: [],
  currentReport: null,
  filters: {
    page: 1,
    limit: 10,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

// Reducer para manejar el estado de reportes
const reportsReducer = (state: ReportsState, action: ReportsAction): ReportsState => {
  switch (action.type) {
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

    case 'SET_REPORTS':
      return {
        ...state,
        reports: action.payload.reports,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case 'ADD_REPORT':
      return {
        ...state,
        reports: [action.payload, ...state.reports],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };

    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id ? action.payload : report
        ),
        currentReport: state.currentReport?.id === action.payload.id 
          ? action.payload 
          : state.currentReport,
      };

    case 'DELETE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(report => report.id !== action.payload),
        currentReport: state.currentReport?.id === action.payload 
          ? null 
          : state.currentReport,
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1),
        },
      };

    case 'SET_CURRENT_REPORT':
      return {
        ...state,
        currentReport: action.payload,
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };

    case 'CLEAR_REPORTS':
      return {
        ...state,
        reports: [],
        currentReport: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
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
interface ReportsContextType extends ReportsState {
  // Operaciones CRUD
  fetchReports: (filters?: ReportFilters) => Promise<void>;
  fetchMyReports: (filters?: Omit<ReportFilters, 'userId'>) => Promise<void>;
  fetchReport: (id: string) => Promise<void>;
  createReport: (reportData: CreateReportData) => Promise<Report>;
  updateReport: (id: string, updateData: UpdateReportData) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  
  // Operaciones específicas
  changeReportStatus: (id: string, status: Report['estado']) => Promise<void>;
  assignResponsible: (id: string, responsableOperativo: string) => Promise<void>;
  uploadFile: (reportId: string, file: File, fileType: 'resultadosEstudios' | 'evidenciaSancion') => Promise<void>;
  downloadFile: (reportId: string, fileType: string) => Promise<void>;
  exportReports: (format: 'excel' | 'pdf' | 'csv', filters?: ReportFilters) => Promise<void>;
  
  // Utilidades
  setFilters: (filters: ReportFilters) => void;
  clearError: () => void;
  clearReports: () => void;
  setCurrentReport: (report: Report | null) => void;
}

// Crear el contexto
const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Props del proveedor
interface ReportsProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de reportes
export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reportsReducer, initialState);

  // Obtener lista de reportes
  const fetchReports = async (filters?: ReportFilters): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const finalFilters = { ...state.filters, ...filters };
      dispatch({ type: 'SET_FILTERS', payload: finalFilters });
      
      const response = await reportsService.getReports(finalFilters);
      
      dispatch({ 
        type: 'SET_REPORTS', 
        payload: { 
          reports: response.data, 
          pagination: response.pagination 
        } 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Obtener mis reportes
  const fetchMyReports = async (filters?: Omit<ReportFilters, 'userId'>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const finalFilters = { ...state.filters, ...filters };
      dispatch({ type: 'SET_FILTERS', payload: finalFilters });
      
      const response = await reportsService.getMyReports(finalFilters);
      
      dispatch({ 
        type: 'SET_REPORTS', 
        payload: { 
          reports: response.data, 
          pagination: response.pagination 
        } 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Obtener un reporte específico
  const fetchReport = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const report = await reportsService.getReport(id);
      dispatch({ type: 'SET_CURRENT_REPORT', payload: report });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Crear un nuevo reporte
  const createReport = async (reportData: CreateReportData): Promise<Report> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newReport = await reportsService.createReport(reportData);
      dispatch({ type: 'ADD_REPORT', payload: newReport });
      return newReport;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Actualizar un reporte
  const updateReport = async (id: string, updateData: UpdateReportData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedReport = await reportsService.updateReport(id, updateData);
      dispatch({ type: 'UPDATE_REPORT', payload: updatedReport });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Eliminar un reporte
  const deleteReport = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await reportsService.deleteReport(id);
      dispatch({ type: 'DELETE_REPORT', payload: id });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Cambiar estado de un reporte
  const changeReportStatus = async (id: string, status: Report['estado']): Promise<void> => {
    try {
      const updatedReport = await reportsService.changeReportStatus(id, status);
      dispatch({ type: 'UPDATE_REPORT', payload: updatedReport });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Asignar responsable
  const assignResponsible = async (id: string, responsableOperativo: string): Promise<void> => {
    try {
      const updatedReport = await reportsService.assignResponsible(id, responsableOperativo);
      dispatch({ type: 'UPDATE_REPORT', payload: updatedReport });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Subir archivo
  const uploadFile = async (
    reportId: string, 
    file: File, 
    fileType: 'resultadosEstudios' | 'evidenciaSancion'
  ): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await reportsService.uploadFile(reportId, file, fileType);
      
      // Refrescar el reporte para obtener la información actualizada del archivo
      await fetchReport(reportId);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Descargar archivo
  const downloadFile = async (reportId: string, fileType: string): Promise<void> => {
    try {
      const blob = await reportsService.downloadFile(reportId, fileType);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${reportId}_${fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Exportar reportes
  const exportReports = async (
    format: 'excel' | 'pdf' | 'csv', 
    filters?: ReportFilters
  ): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const blob = await reportsService.exportReports(format, filters);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reportes_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Establecer filtros
  const setFilters = (filters: ReportFilters): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Limpiar errores
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Limpiar reportes
  const clearReports = (): void => {
    dispatch({ type: 'CLEAR_REPORTS' });
  };

  // Establecer reporte actual
  const setCurrentReport = (report: Report | null): void => {
    dispatch({ type: 'SET_CURRENT_REPORT', payload: report });
  };

  // Valor del contexto
  const contextValue: ReportsContextType = {
    ...state,
    fetchReports,
    fetchMyReports,
    fetchReport,
    createReport,
    updateReport,
    deleteReport,
    changeReportStatus,
    assignResponsible,
    uploadFile,
    downloadFile,
    exportReports,
    setFilters,
    clearError,
    clearReports,
    setCurrentReport,
  };

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

// Hook para usar el contexto de reportes
export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports debe ser usado dentro de un ReportsProvider');
  }
  return context;
};