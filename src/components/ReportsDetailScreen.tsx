import React from 'react';
import { ArrowLeft, FileText, Calendar, Clock, User, MapPin, AlertTriangle } from 'lucide-react';
import { globalReportsManager, GlobalReport } from '../utils/globalStorage';

interface ReportsDetailScreenProps {
  cardType: string;
  cardTitle: string;
  onGoBack: () => void;
}

const ReportsDetailScreen: React.FC<ReportsDetailScreenProps> = ({ 
  cardType, 
  cardTitle, 
  onGoBack 
}) => {
  const reports = globalReportsManager.getDashboardReportsByCardType(cardType);

  const getPolo = (createdBy: string) => {
    if (createdBy === 'Polo Oriente') return 'Polo Oriente';
    if (createdBy === 'Polo Poniente') return 'Polo Poniente';
    return createdBy;
  };

  const renderReportCard = (report: GlobalReport) => {
    return (
      <div key={report.id} className="bg-white border-2 border-emerald-100 rounded-xl p-4 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:scale-[1.01]">
        {/* Header del reporte */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  {getPolo(report.createdBy)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido específico por tipo de card */}
        <div className="space-y-3">
          
          {/* Campos específicos según el tipo de card */}
          {(cardType === 'rio-santa-catarina' || cardType === 'manejos-fauna') && (
            <>
              {report.abstracto && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="font-bold text-gray-800 block mb-1 text-xs">Abstracto:</span>
                  <p className="text-gray-700 text-xs leading-relaxed">{report.abstracto}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                {report.horaReporte && (
                  <div className="flex items-start text-gray-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                    <Clock className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Hora:</span>
                      <span className="text-gray-600 text-xs">{report.horaReporte}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start text-gray-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                  <Calendar className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 block text-xs">Fecha:</span>
                    <span className="text-gray-600 text-xs">{report.fechaCreacion}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {report.rangerReportante && (
                  <div className="flex items-start text-gray-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <User className="w-3 h-3 mr-1 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Ranger:</span>
                      <span className="text-gray-600 text-xs">{report.rangerReportante}</span>
                    </div>
                  </div>
                )}
                
                {report.responsableSeguimiento && (
                  <div className="flex items-start text-gray-700 bg-orange-50 p-2 rounded-lg border border-orange-100">
                    <User className="w-3 h-3 mr-1 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Responsable:</span>
                      <span className="text-gray-600 text-xs">{report.responsableSeguimiento}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {cardType === 'proteccion-anps' && (
            <>
              {report.abstracto && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="font-bold text-gray-800 block mb-1 text-xs">Abstracto:</span>
                  <p className="text-gray-700 text-xs leading-relaxed">{report.abstracto}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                {report.horaReporte && (
                  <div className="flex items-start text-gray-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                    <Clock className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Hora:</span>
                      <span className="text-gray-600 text-xs">{report.horaReporte}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start text-gray-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                  <Calendar className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 block text-xs">Fecha:</span>
                    <span className="text-gray-600 text-xs">{report.fechaCreacion}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {report.rangerReportante && (
                  <div className="flex items-start text-gray-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <User className="w-3 h-3 mr-1 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Ranger:</span>
                      <span className="text-gray-600 text-xs">{report.rangerReportante}</span>
                    </div>
                  </div>
                )}
                
                {report.responsableSeguimiento && (
                  <div className="flex items-start text-gray-700 bg-orange-50 p-2 rounded-lg border border-orange-100">
                    <User className="w-3 h-3 mr-1 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Responsable:</span>
                      <span className="text-gray-600 text-xs">{report.responsableSeguimiento}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {report.anpInvolucrada && (
                <div className="flex items-start text-gray-700 bg-green-50 p-2 rounded-lg border border-green-100">
                  <MapPin className="w-3 h-3 mr-1 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 block text-xs">ANP:</span>
                    <span className="text-gray-600 text-xs">{report.anpInvolucrada}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {(cardType === 'parques-estatales' || cardType === 'turismo') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {report.horaReporte && (
                  <div className="flex items-start text-gray-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                    <Clock className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Hora:</span>
                      <span className="text-gray-600 text-xs">{report.horaReporte}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start text-gray-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                  <Calendar className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 block text-xs">Fecha:</span>
                    <span className="text-gray-600 text-xs">{report.fechaCreacion}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {report.parqueEstatal && (
                  <div className="flex items-start text-gray-700 bg-green-50 p-2 rounded-lg border border-green-100">
                    <MapPin className="w-3 h-3 mr-1 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Parque:</span>
                      <span className="text-gray-600 text-xs">{report.parqueEstatal}</span>
                    </div>
                  </div>
                )}
                
                {report.nombreEvento && (
                  <div className="flex items-start text-gray-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                    <FileText className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Evento:</span>
                      <span className="text-gray-600 text-xs">{report.nombreEvento}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {report.asistentes && (
                  <div className="flex items-start text-gray-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <User className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Asistentes:</span>
                      <span className="text-gray-600 text-xs">{report.asistentes}</span>
                    </div>
                  </div>
                )}
                
                {report.corteCaja && (
                  <div className="flex items-start text-gray-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <AlertTriangle className="w-3 h-3 mr-1 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block text-xs">Corte de Caja:</span>
                      <span className="text-gray-600 text-xs font-semibold">{report.corteCaja}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onGoBack}
              className="p-3 hover:bg-white/20 rounded-2xl transition-colors duration-200"
              title="Volver al dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Reportes de {cardTitle}</h1>
              <p className="text-emerald-100 mt-1">
                {reports.length} reporte{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reports.map(renderReportCard)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No hay reportes disponibles
            </h2>
            <p className="text-gray-600 text-lg">
              No se encontraron reportes para {cardTitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDetailScreen;