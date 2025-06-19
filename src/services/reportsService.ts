import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { 
  Report, 
  CreateReportData, 
  UpdateReportData, 
  ReportFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

export class ReportsService {
  // Obtener lista de reportes con filtros y paginación
  async getReports(filters?: ReportFilters): Promise<PaginatedResponse<Report>> {
    try {
      const response = await apiService.get<PaginatedResponse<Report>>(
        API_ENDPOINTS.REPORTS.LIST,
        filters
      );
      return response;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  }

  // Obtener un reporte específico por ID
  async getReport(id: string): Promise<Report> {
    try {
      const response = await apiService.get<ApiResponse<Report>>(
        API_ENDPOINTS.REPORTS.GET(id)
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reporte ${id}:`, error);
      throw error;
    }
  }

  // Crear un nuevo reporte
  async createReport(reportData: CreateReportData): Promise<Report> {
    try {
      const response = await apiService.post<ApiResponse<Report>>(
        API_ENDPOINTS.REPORTS.CREATE,
        reportData
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear reporte:', error);
      throw error;
    }
  }

  // Actualizar un reporte existente
  async updateReport(id: string, updateData: UpdateReportData): Promise<Report> {
    try {
      const response = await apiService.put<ApiResponse<Report>>(
        API_ENDPOINTS.REPORTS.UPDATE(id),
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar reporte ${id}:`, error);
      throw error;
    }
  }

  // Actualizar parcialmente un reporte
  async patchReport(id: string, updateData: Partial<UpdateReportData>): Promise<Report> {
    try {
      const response = await apiService.patch<ApiResponse<Report>>(
        API_ENDPOINTS.REPORTS.UPDATE(id),
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar parcialmente reporte ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un reporte
  async deleteReport(id: string): Promise<void> {
    try {
      await apiService.delete<ApiResponse<void>>(
        API_ENDPOINTS.REPORTS.DELETE(id)
      );
    } catch (error) {
      console.error(`Error al eliminar reporte ${id}:`, error);
      throw error;
    }
  }

  // Subir archivo para un reporte
  async uploadFile(
    reportId: string, 
    file: File, 
    fileType: 'resultadosEstudios' | 'evidenciaSancion'
  ): Promise<{ url: string; filename: string }> {
    try {
      const response = await apiService.uploadFile<ApiResponse<{ url: string; filename: string }>>(
        API_ENDPOINTS.REPORTS.UPLOAD_FILE(reportId),
        file,
        { fileType }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al subir archivo para reporte ${reportId}:`, error);
      throw error;
    }
  }

  // Descargar archivo de un reporte
  async downloadFile(reportId: string, fileType: string): Promise<Blob> {
    try {
      const blob = await apiService.downloadFile(
        API_ENDPOINTS.REPORTS.DOWNLOAD_FILE(reportId, fileType)
      );
      return blob;
    } catch (error) {
      console.error(`Error al descargar archivo del reporte ${reportId}:`, error);
      throw error;
    }
  }

  // Exportar reportes
  async exportReports(
    format: 'excel' | 'pdf' | 'csv',
    filters?: ReportFilters
  ): Promise<Blob> {
    try {
      const params = { ...filters, format };
      const blob = await apiService.downloadFile(
        `${API_ENDPOINTS.REPORTS.EXPORT}?${new URLSearchParams(params).toString()}`
      );
      return blob;
    } catch (error) {
      console.error('Error al exportar reportes:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reportes
  async getReportsStats(filters?: Partial<ReportFilters>): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    recentActivity: Array<{
      date: string;
      count: number;
    }>;
  }> {
    try {
      const response = await apiService.get<ApiResponse<any>>(
        API_ENDPOINTS.REPORTS.STATS,
        filters
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de reportes:', error);
      throw error;
    }
  }

  // Cambiar estado de un reporte
  async changeReportStatus(
    id: string, 
    status: 'Pendiente' | 'En proceso' | 'Completado' | 'Cancelado'
  ): Promise<Report> {
    try {
      return await this.patchReport(id, { estado: status });
    } catch (error) {
      console.error(`Error al cambiar estado del reporte ${id}:`, error);
      throw error;
    }
  }

  // Asignar responsable a un reporte
  async assignResponsible(id: string, responsableOperativo: string): Promise<Report> {
    try {
      return await this.patchReport(id, { responsableOperativo });
    } catch (error) {
      console.error(`Error al asignar responsable al reporte ${id}:`, error);
      throw error;
    }
  }

  // Obtener reportes del usuario actual
  async getMyReports(filters?: Omit<ReportFilters, 'userId'>): Promise<PaginatedResponse<Report>> {
    try {
      const response = await apiService.get<PaginatedResponse<Report>>(
        `${API_ENDPOINTS.REPORTS.LIST}/my`,
        filters
      );
      return response;
    } catch (error) {
      console.error('Error al obtener mis reportes:', error);
      throw error;
    }
  }

  // Duplicar un reporte
  async duplicateReport(id: string): Promise<Report> {
    try {
      const response = await apiService.post<ApiResponse<Report>>(
        `${API_ENDPOINTS.REPORTS.GET(id)}/duplicate`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al duplicar reporte ${id}:`, error);
      throw error;
    }
  }

  // Obtener historial de cambios de un reporte
  async getReportHistory(id: string): Promise<Array<{
    id: string;
    action: string;
    changes: Record<string, any>;
    userId: string;
    userName: string;
    timestamp: string;
  }>> {
    try {
      const response = await apiService.get<ApiResponse<any>>(
        `${API_ENDPOINTS.REPORTS.GET(id)}/history`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener historial del reporte ${id}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio de reportes
export const reportsService = new ReportsService();