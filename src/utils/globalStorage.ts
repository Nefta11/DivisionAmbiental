// Sistema de almacenamiento global para reportes
export interface GlobalReport {
  id: string;
  type: 'dashboard' | 'general';
  cardType?: string;
  createdBy: string;
  createdByUserId: string;
  fuenteReporte: string;
  descripcion: string;
  telefonoContacto?: string;
  peticionReportante?: string;
  fotosVideos?: File | null;
  ubicacion?: string;
  dependenciasInvolucradas: string[];
  operadorAsignado: string;
  fechaCreacion: string;
  horaReporte?: string;
  estado: 'Pendiente' | 'En proceso' | 'Completado' | 'Cancelado';
  
  // Campos específicos del dashboard
  abstracto?: string;
  rangerReportante?: string;
  responsableSeguimiento?: string;
  anpInvolucrada?: string;
  parqueEstatal?: string;
  nombreEvento?: string;
  asistentes?: string;
  corteCaja?: string;
}

class GlobalReportsManager {
  private readonly STORAGE_KEY = 'global_reports_system';
  private reports: GlobalReport[] = [];

  constructor() {
    this.loadReports();
    this.updateExistingReportsNames(); // Actualizar nombres existentes
    this.initializeDefaultReports();
  }

  private loadReports(): void {
    try {
      const savedReports = localStorage.getItem(this.STORAGE_KEY);
      if (savedReports) {
        this.reports = JSON.parse(savedReports);
      }
    } catch (error) {
      console.error('Error al cargar reportes globales:', error);
      this.reports = [];
    }
  }

  private saveReports(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('Error al guardar reportes globales:', error);
    }
  }

  // Método para actualizar reportes existentes con los nuevos nombres
  private updateExistingReportsNames(): void {
    let updated = false;
    
    this.reports = this.reports.map(report => {
      if (report.createdBy === 'RIR Oriente') {
        updated = true;
        return { ...report, createdBy: 'Polo Oriente' };
      }
      if (report.createdBy === 'RIR Poniente') {
        updated = true;
        return { ...report, createdBy: 'Polo Poniente' };
      }
      return report;
    });
    
    if (updated) {
      this.saveReports();
      console.log('Reportes actualizados con nuevos nombres Polo');
    }
  }

  private initializeDefaultReports(): void {
    // Solo inicializar si no hay reportes
    if (this.reports.length === 0) {
      const defaultReports: GlobalReport[] = [
        // Reportes generales existentes
        {
          id: "global-1",
          type: 'general',
          createdBy: 'Sistema',
          createdByUserId: 'system',
          fuenteReporte: "Llamada de teléfono a la Guardia Forestal",
          descripcion: "Se reporta vertido de aguas residuales sin tratamiento en el Río Tijuana, cerca del puente vehicular. El agua presenta coloración oscura y mal olor. Se observan peces muertos flotando en la superficie. Los vecinos reportan que esto ocurre desde hace 3 días de manera continua.",
          telefonoContacto: "+52 81 123 4567",
          peticionReportante: "Solicita limpieza inmediata del río y identificación del origen de la contaminación",
          ubicacion: "Río Tijuana, Puente Vehicular Zona Centro, Tijuana, B.C.",
          dependenciasInvolucradas: ["SIMEPRODE", "Agua y Drenaje", "PEMA"],
          operadorAsignado: "Limpieza de ríos",
          fechaCreacion: "15 de enero de 2025, 14:30",
          estado: "En proceso",
        },
        {
          id: "global-2",
          type: 'general',
          createdBy: 'Sistema',
          createdByUserId: 'system',
          fuenteReporte: "Mensaje por instagram a PVSNL",
          descripcion: "Empresa constructora está talando árboles centenarios sin permisos en zona protegida. Se han derribado aproximadamente 15 árboles de gran tamaño. La maquinaria pesada está operando sin autorización ambiental y está afectando el hábitat de especies locales.",
          telefonoContacto: "+52 81 987 6543",
          peticionReportante: "Detención inmediata de la tala y sanción a la empresa",
          ubicacion: "Zona Protegida Cerro Colorado, Playas de Tijuana, B.C.",
          dependenciasInvolucradas: ["PEMA", "Guardia Nacional"],
          operadorAsignado: "ANPs",
          fechaCreacion: "12 de enero de 2025, 09:15",
          estado: "Completado",
        },

        // Reportes del dashboard
        {
          id: 'dashboard-rsc-1',
          type: 'dashboard',
          cardType: 'rio-santa-catarina',
          createdBy: 'Polo Oriente',
          createdByUserId: 'rir_oriente',
          fuenteReporte: 'RIR - Reporte Interno',
          abstracto: 'Tiradero clandestino bajo Puente Multimodal',
          descripcion: 'Acumulación de residuos sólidos y líquidos contaminantes en el cauce del río.',
          ubicacion: 'Puente Multimodal, Río Santa Catarina',
          rangerReportante: 'Mauricio Hinojosa',
          responsableSeguimiento: 'Christian P.',
          dependenciasInvolucradas: ['SIMEPRODE', 'Agua y Drenaje', 'PEMA'],
          operadorAsignado: 'Limpieza de ríos',
          fechaCreacion: new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          horaReporte: '15:41',
          estado: 'En proceso'
        },

        {
          id: 'dashboard-mf-1',
          type: 'dashboard',
          cardType: 'manejos-fauna',
          createdBy: 'Polo Poniente',
          createdByUserId: 'rir_poniente',
          fuenteReporte: 'RIR - Reporte Interno',
          abstracto: 'Avistamiento de oso negro en Col. Altavista',
          descripcion: 'Oso negro adulto en zona residencial, requiere reubicación inmediata.',
          ubicacion: 'Colonia Altavista, Monterrey',
          rangerReportante: 'Ana García',
          responsableSeguimiento: 'Luis M.',
          dependenciasInvolucradas: ['PEMA', 'Protección Civil'],
          operadorAsignado: 'Manejo de fauna',
          fechaCreacion: new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric", 
            hour: "2-digit",
            minute: "2-digit",
          }),
          horaReporte: '08:30',
          estado: 'En proceso'
        },

        {
          id: 'dashboard-anp-1',
          type: 'dashboard',
          cardType: 'proteccion-anps',
          createdBy: 'Polo Oriente',
          createdByUserId: 'rir_oriente',
          fuenteReporte: 'RIR - Reporte Interno',
          abstracto: 'Construcción irregular en ANP La Huasteca',
          descripcion: 'Construcción sin permisos en zona protegida, requiere intervención inmediata.',
          ubicacion: 'ANP La Huasteca, sector oeste',
          anpInvolucrada: 'La Huasteca',
          rangerReportante: 'Carlos Mendoza',
          responsableSeguimiento: 'María S.',
          dependenciasInvolucradas: ['PEMA', 'Guardia Nacional'],
          operadorAsignado: 'ANPs',
          fechaCreacion: new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit", 
            minute: "2-digit",
          }),
          horaReporte: '12:15',
          estado: 'En proceso'
        },

        {
          id: 'dashboard-pe-1',
          type: 'dashboard',
          cardType: 'parques-estatales',
          createdBy: 'Polo Poniente',
          createdByUserId: 'rir_poniente',
          fuenteReporte: 'RIR - Reporte Interno',
          parqueEstatal: 'El Cuchillo',
          asistentes: '320',
          corteCaja: '$85,000',
          descripcion: 'Reporte diario de actividades del parque estatal.',
          dependenciasInvolucradas: ['PEMA', 'Servicios Públicos del Municipio'],
          operadorAsignado: 'Parques Estatales',
          fechaCreacion: new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          horaReporte: '18:00',
          estado: 'Completado'
        },

        {
          id: 'dashboard-tur-1',
          type: 'dashboard',
          cardType: 'turismo',
          createdBy: 'Polo Oriente',
          createdByUserId: 'rir_oriente',
          fuenteReporte: 'RIR - Reporte Interno',
          nombreEvento: 'Gran Carrera La Estanzuela',
          asistentes: '850',
          corteCaja: '$150,000',
          descripcion: 'Evento deportivo con gran participación ciudadana.',
          dependenciasInvolucradas: ['PEMA', 'Protección Civil', 'Servicios Públicos del Municipio'],
          operadorAsignado: 'Turismo',
          fechaCreacion: new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          horaReporte: '20:30',
          estado: 'Completado'
        }
      ];

      this.reports = defaultReports;
      this.saveReports();
    }
  }

  // Agregar un nuevo reporte
  addReport(reportData: Omit<GlobalReport, 'id'>): GlobalReport {
    const newReport: GlobalReport = {
      ...reportData,
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.reports.unshift(newReport); // Agregar al inicio
    this.saveReports();
    return newReport;
  }

  // Obtener todos los reportes
  getAllReports(): GlobalReport[] {
    return [...this.reports];
  }

  // Obtener reportes por tipo
  getReportsByType(type: 'dashboard' | 'general'): GlobalReport[] {
    return this.reports.filter(report => report.type === type);
  }

  // Obtener reportes del dashboard por tipo de card
  getDashboardReportsByCardType(cardType: string): GlobalReport[] {
    return this.reports.filter(report => 
      report.type === 'dashboard' && report.cardType === cardType
    );
  }

  // Obtener reportes generales (para Mis Reportes)
  getGeneralReports(): GlobalReport[] {
    return this.reports.filter(report => report.type === 'general');
  }

  // Contar reportes por tipo de card del dashboard
  countDashboardReports(cardType: string): number {
    return this.getDashboardReportsByCardType(cardType).length;
  }

  // Actualizar un reporte
  updateReport(id: string, updates: Partial<GlobalReport>): boolean {
    const index = this.reports.findIndex(report => report.id === id);
    if (index !== -1) {
      this.reports[index] = { ...this.reports[index], ...updates };
      this.saveReports();
      return true;
    }
    return false;
  }

  // Eliminar un reporte
  deleteReport(id: string): boolean {
    const initialLength = this.reports.length;
    this.reports = this.reports.filter(report => report.id !== id);
    
    if (this.reports.length < initialLength) {
      this.saveReports();
      return true;
    }
    return false;
  }

  // Limpiar todos los reportes (solo para desarrollo)
  clearAllReports(): void {
    this.reports = [];
    this.saveReports();
  }

  // Obtener estadísticas
  getStats() {
    const total = this.reports.length;
    const byStatus = this.reports.reduce((acc, report) => {
      acc[report.estado] = (acc[report.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = this.reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byStatus,
      byType,
      dashboard: this.getReportsByType('dashboard').length,
      general: this.getReportsByType('general').length
    };
  }
}

// Instancia singleton
export const globalReportsManager = new GlobalReportsManager();