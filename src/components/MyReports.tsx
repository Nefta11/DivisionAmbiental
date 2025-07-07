import React, { useState, useEffect } from 'react';
import { FileText, Eye, Edit, Trash2, MapPin, Phone, Clock, Home, Users, AlertTriangle } from 'lucide-react';
import EditReportModal from './EditReportModal';

interface Report {
  id: string;
  fuenteReporte: string;
  descripcion: string;
  telefonoContacto: string;
  peticionReportante: string;
  fotosVideos: File | null;
  ubicacion: string;
  dependenciasInvolucradas: string[];
  operadorAsignado: string;
  fechaCreacion: string;
  estado: 'Pendiente' | 'En proceso' | 'Completado' | 'Cancelado';
}

interface MyReportsProps {
  reports: Report[];
  onDeleteReport?: (id: string) => void;
  onGoToDashboard?: () => void;
}

const MyReports: React.FC<MyReportsProps> = ({ reports, onDeleteReport, onGoToDashboard }) => {
  const [localReports, setLocalReports] = useState<Report[]>(reports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Actualizar reportes locales cuando cambien las props
  useEffect(() => {
    setLocalReports(reports);
  }, [reports]);

  // Manejar scroll del body cuando se abre/cierra el modal
  useEffect(() => {
    if (selectedReport || editingReport || deleteConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedReport, editingReport, deleteConfirm]);

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
  };

  // Actualiza el reporte editado en el estado local después de editar exitosamente
  const handleSaveEdit = (updatedReport: Report) => {
    setLocalReports(prev =>
      prev.map(r => (r.id === updatedReport.id ? { ...r, ...updatedReport } : r))
    );
    setEditingReport(null);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
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

  // TEMPORAL: Eliminar reporte solo localmente
  const handleDeleteReport = async (id: string) => {
    try {
      setLocalReports(prev => prev.filter(report => report.id !== id));
      if (onDeleteReport) onDeleteReport(id);
    } catch {
      alert('Error al eliminar el reporte');
    }
    setDeleteConfirm(null);
  };

  const filteredReports = localReports.filter(report => {
    const matchesSearch = report.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.fuenteReporte.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || report.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (localReports.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-white">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center px-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl border-2 border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-200">
            <FileText className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-6 tracking-wide">
            No tienes reportes aún
          </h2>
          <p className="text-gray-700 text-2xl leading-relaxed font-medium max-w-md">
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
              <p className="text-emerald-100 text-sm">{localReports.length} reporte{localReports.length !== 1 ? 's' : ''} total{localReports.length !== 1 ? 'es' : ''}</p>
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
                      Reporte #{report.id}
                    </h3>
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
                      <span className="text-gray-600 text-sm line-clamp-2">{report.ubicacion || 'Sin especificar'}</span>
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
                
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="font-bold text-gray-800 block mb-1 text-sm">Fuente del Reporte</span>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-1">
                    {report.fuenteReporte}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl my-4 sm:my-8 border border-emerald-100 overflow-hidden min-h-[90vh] sm:min-h-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl sticky top-0 z-10 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Detalles del Reporte</h2>
                  <p className="text-emerald-100 text-sm mt-1">ID: {selectedReport.id}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-2xl leading-none"
                  title="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 pb-8 space-y-4 max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto modal-scroll relative">
              {/* Información General */}
              <section className="scroll-mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center sticky top-0 bg-white pt-2 pb-2 z-5">
                  <AlertTriangle className="w-5 h-5 mr-2 text-emerald-600" />
                  Información General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Fuente del Reporte</span>
                    <p className="text-gray-900 font-medium break-words">{selectedReport.fuenteReporte}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Estado</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(selectedReport.estado)}`}>
                      {selectedReport.estado}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Fecha de Creación</span>
                    <p className="text-gray-900 font-medium">{selectedReport.fechaCreacion}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Ubicación</span>
                    <p className="text-gray-900 font-medium break-words">{selectedReport.ubicacion || 'Sin especificar'}</p>
                  </div>
                </div>
              </section>

              {/* Descripción */}
              <section className="scroll-mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 sticky top-0 bg-white pt-2 pb-2 z-5">Descripción</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-900 leading-relaxed break-words">{selectedReport.descripcion}</p>
                </div>
              </section>

              {/* Información de Contacto */}
              <section className="scroll-mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center sticky top-0 bg-white pt-2 pb-2 z-5">
                  <Phone className="w-5 h-5 mr-2 text-emerald-600" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Teléfono de Contacto</span>
                    <p className="text-gray-900 font-medium break-words">{selectedReport.telefonoContacto || 'Sin especificar'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Petición del Reportante</span>
                    <p className="text-gray-900 font-medium break-words">{selectedReport.peticionReportante || 'Sin especificar'}</p>
                  </div>
                </div>
              </section>

              {/* Dependencias y Operador */}
              {(selectedReport.dependenciasInvolucradas.length > 0 || selectedReport.operadorAsignado) && (
                <section className="scroll-mt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center sticky top-0 bg-white pt-2 pb-2 z-5">
                    <Users className="w-5 h-5 mr-2 text-emerald-600" />
                    Asignación y Dependencias
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReport.dependenciasInvolucradas.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-gray-700 block mb-2">Dependencias Involucradas</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.dependenciasInvolucradas.map((dep, index) => (
                            <span key={index} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedReport.operadorAsignado && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-gray-700 block mb-2">Operador Asignado</span>
                        <p className="text-gray-900 font-medium break-words">{selectedReport.operadorAsignado}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Confirmar eliminación?</h3>
              <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteReport(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyReports;