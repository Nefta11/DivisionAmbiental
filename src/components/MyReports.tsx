import React, { useState } from 'react';
import { FileText, Eye, Edit, Trash2, Calendar, MapPin, User, Phone, AlertTriangle, CheckCircle, XCircle, Filter, Search, Clock, Home } from 'lucide-react';
import EditReportModal from './EditReportModal';

interface Report {
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
  equipoEspecial: string;
  estudiosLaboratorio: string;
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
}

interface MyReportsProps {
  reports: Report[];
  onDeleteReport?: (id: string) => void;
  onUpdateReport?: (report: Report) => void;
  onGoToDashboard?: () => void;
}

const MyReports: React.FC<MyReportsProps> = ({ reports, onDeleteReport, onUpdateReport, onGoToDashboard }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
  };

  const handleSaveEdit = (updatedReport: Report) => {
    console.log('Guardando reporte editado:', updatedReport); // Para debug
    console.log('Reporte original:', editingReport); // Para debug
    if (onUpdateReport) {
      onUpdateReport(updatedReport);
    }
    setEditingReport(null);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'crítica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'En proceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDeleteReport = (id: string) => {
    if (onDeleteReport) {
      onDeleteReport(id);
    }
    setDeleteConfirm(null);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.nombreReportante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.categoriaDelito.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || report.prioridad === filterPriority;
    const matchesStatus = !filterStatus || report.estado === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (reports.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large floating orbs */}
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-radial from-emerald-200/40 via-emerald-300/20 to-transparent rounded-full animate-float-1 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-radial from-teal-200/50 via-teal-300/25 to-transparent rounded-full animate-float-2 blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-radial from-green-200/35 via-green-300/20 to-transparent rounded-full animate-float-3 blur-3xl"></div>
          
          {/* Medium floating elements */}
          <div className="absolute top-1/6 right-1/4 w-48 h-48 bg-gradient-radial from-emerald-300/30 via-emerald-400/15 to-transparent rounded-full animate-wave-slow blur-xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-gradient-radial from-teal-300/40 via-teal-400/20 to-transparent rounded-full animate-wave-medium blur-2xl"></div>
          <div className="absolute top-2/3 left-1/2 w-40 h-40 bg-gradient-radial from-green-300/35 via-green-400/18 to-transparent rounded-full animate-wave-fast blur-xl"></div>
          
          {/* Small accent elements */}
          <div className="absolute top-1/3 left-1/5 w-24 h-24 bg-gradient-radial from-emerald-400/50 via-emerald-500/25 to-transparent rounded-full animate-morph-1 blur-lg"></div>
          <div className="absolute bottom-1/5 right-1/5 w-32 h-32 bg-gradient-radial from-teal-400/45 via-teal-500/22 to-transparent rounded-full animate-morph-2 blur-lg"></div>
          <div className="absolute top-3/4 right-2/3 w-20 h-20 bg-gradient-radial from-green-400/40 via-green-500/20 to-transparent rounded-full animate-morph-3 blur-md"></div>
          
          {/* Flowing wave effects */}
          <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-emerald-200/20 to-transparent animate-wave-flow-1 blur-sm"></div>
          <div className="absolute bottom-1/3 right-0 w-full h-24 bg-gradient-to-l from-transparent via-teal-200/25 to-transparent animate-wave-flow-2 blur-sm"></div>
          
          {/* Subtle light beams */}
          <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-transparent via-emerald-300/30 to-transparent animate-beam-1"></div>
          <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-teal-300/40 to-transparent animate-beam-2"></div>
          <div className="absolute top-0 left-2/3 w-2 h-full bg-gradient-to-b from-transparent via-green-300/25 to-transparent animate-beam-3"></div>
          
          {/* Particle effects */}
          <div className="absolute bottom-0 left-1/6 w-2 h-2 bg-emerald-400/60 rounded-full animate-particle-1"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-teal-400/70 rounded-full animate-particle-2"></div>
          <div className="absolute bottom-0 right-1/6 w-3 h-3 bg-green-400/50 rounded-full animate-particle-3"></div>
          <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-particle-4"></div>
          <div className="absolute bottom-0 right-1/3 w-2.5 h-2.5 bg-teal-500/55 rounded-full animate-particle-5"></div>
          
          {/* Spiral elements */}
          <div className="absolute top-1/5 left-1/8 w-16 h-16 bg-gradient-radial from-emerald-400/40 to-transparent rounded-full animate-spiral-1"></div>
          <div className="absolute bottom-1/4 right-1/8 w-12 h-12 bg-gradient-radial from-teal-400/45 to-transparent rounded-full animate-spiral-2"></div>
          <div className="absolute top-2/3 left-3/4 w-20 h-20 bg-gradient-radial from-green-400/35 to-transparent rounded-full animate-spiral-3"></div>
        </div>
        
        {/* Overlay for better content readability */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]"></div>
        
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center px-8 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-xl border-2 border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-200">
            <FileText className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-2 tracking-wide">
            No tienes reportes aún
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed font-medium max-w-md">
            Los reportes que crees aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white rounded-t-3xl shadow-lg">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">Mis Reportes</h1>
              <p className="text-emerald-100 text-sm">{reports.length} reporte{reports.length !== 1 ? 's' : ''} total{reports.length !== 1 ? 'es' : ''}</p>
            </div>
            
            {/* Dashboard Button - Right Side */}
            <button
              onClick={onGoToDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-white font-semibold"
              title="Ir al Dashboard"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Mi dashboard</span>
            </button>
          </div>
          
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-b-3xl border-x border-b border-emerald-100">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white border-2 border-emerald-100 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:scale-[1.01] min-h-[280px] flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {report.categoriaDelito}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(report.prioridad)}`}>
                      {report.prioridad}
                    </span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.estado)}`}>
                    {report.estado}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 ml-3">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditReport(report)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(report.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start text-gray-700 bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-sm">Ubicación</span>
                      <span className="text-gray-600 text-sm line-clamp-2">{report.ubicacion}</span>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-700 bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <Clock className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-sm">Fecha de Creación</span>
                      <span className="text-gray-600 text-sm">{report.fechaCreacion}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-800 block mb-1 text-sm">Descripción</span>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                  {report.descripcion}
                  </p>
                </div>
                
                {report.dependenciasInvolucradas.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-gray-800 text-xs block">Dependencias Involucradas</span>
                    <div className="flex flex-wrap gap-2">
                      {report.dependenciasInvolucradas.slice(0, 2).map((dep, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-bold border border-indigo-200">
                        {dep}
                        </span>
                      ))}
                      {report.dependenciasInvolucradas.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-bold border border-gray-200">
                        +{report.dependenciasInvolucradas.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-red-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Eliminar Reporte
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                ¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteReport(deleteConfirm)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {editingReport && (
        <EditReportModal
          report={editingReport}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-emerald-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Detalles del Reporte</h2>
                <p className="text-emerald-100 mt-1">ID: {selectedReport.id}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-3 hover:bg-white/20 rounded-2xl transition-colors duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 space-y-8 modal-scroll">
              {/* Basic Information */}
              <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Canal de origen</label>
                    <p className="text-gray-900 font-medium">{selectedReport.canalOrigen}</p>
                  </div>
                  {selectedReport.urlReferencia && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">URL de referencia</label>
                      <a href={selectedReport.urlReferencia} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 underline font-medium">
                        {selectedReport.urlReferencia}
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Report Details */}
              <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Detalles del Reporte
                </h3>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <p className="text-gray-900 leading-relaxed">{selectedReport.descripcion}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                      <p className="text-gray-900 font-medium">{selectedReport.ubicacion}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría del delito</label>
                      <p className="text-gray-900 font-medium">{selectedReport.categoriaDelito}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Prioridad</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${getPriorityColor(selectedReport.prioridad)}`}>
                        {selectedReport.prioridad}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Operational Details */}
              {(selectedReport.dependenciasInvolucradas.length > 0 || selectedReport.responsableOperativo || selectedReport.equipoEspecial) && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Operativo
                  </h3>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-6">
                    {selectedReport.dependenciasInvolucradas.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Dependencias involucradas</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.dependenciasInvolucradas.map((dep, index) => (
                            <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-medium border border-blue-200">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedReport.responsableOperativo && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Responsable del operativo</label>
                        <p className="text-gray-900 font-medium">{selectedReport.responsableOperativo}</p>
                      </div>
                    )}
                    {selectedReport.equipoEspecial && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Equipo especial necesario</label>
                        <p className="text-gray-900 font-medium">{selectedReport.equipoEspecial}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Laboratory Studies */}
              {selectedReport.estudiosLaboratorio && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Estudios de Laboratorio
                  </h3>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <p className="text-gray-900 font-medium">{selectedReport.estudiosLaboratorio}</p>
                  </div>
                </section>
              )}

              {/* Remediation */}
              {selectedReport.remediacionEjecutada.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Remediación
                  </h3>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.remediacionEjecutada.map((rem, index) => (
                        <span key={index} className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm rounded-full font-medium border border-emerald-200">
                          {rem}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyReports;