import React, { useState } from 'react';
import { X, Save, MapPin, Phone, FileText, AlertTriangle, Users, Calendar, Clock } from 'lucide-react';

interface RIRReportFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  cardType: 'rio-santa-catarina' | 'manejos-fauna' | 'proteccion-anps' | 'parques-estatales' | 'turismo';
}

const RIRReportForm: React.FC<RIRReportFormProps> = ({ onClose, onSubmit, cardType }) => {
  const [formData, setFormData] = useState<any>({
    // Todos los campos empiezan vacíos
  });

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas según el tipo de card
    if (!validateForm()) {
      return;
    }
    
    // La hora del reporte se establece automáticamente al momento de crear el reporte
    const currentTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    const reportData = {
      ...formData,
      cardType,
      horaReporte: currentTime, // Hora automática
      fuenteReporte: 'RIR - Reporte Interno',
      operadorAsignado: 'RIR',
      dependenciasInvolucradas: getDefaultDependencies(cardType),
      estado: 'Pendiente' as const
    };

    onSubmit(reportData);
  };

  const validateForm = (): boolean => {
    switch (cardType) {
      case 'rio-santa-catarina':
      case 'manejos-fauna':
        if (!formData.abstracto?.trim()) {
          alert('El campo Abstracto es obligatorio');
          return false;
        }
        if (!formData.fechaReporte) {
          alert('La fecha del reporte es obligatoria');
          return false;
        }
        if (!formData.rangerReportante?.trim()) {
          alert('El campo Ranger reportante es obligatorio');
          return false;
        }
        if (!formData.responsableSeguimiento?.trim()) {
          alert('El campo Responsable del seguimiento es obligatorio');
          return false;
        }
        break;
      
      case 'proteccion-anps':
        if (!formData.abstracto?.trim()) {
          alert('El campo Abstracto es obligatorio');
          return false;
        }
        if (!formData.anpInvolucrada) {
          alert('Debe seleccionar una ANP');
          return false;
        }
        if (!formData.fechaReporte) {
          alert('La fecha del reporte es obligatoria');
          return false;
        }
        if (!formData.rangerReportante?.trim()) {
          alert('El campo Ranger reportante es obligatorio');
          return false;
        }
        if (!formData.responsableSeguimiento?.trim()) {
          alert('El campo Responsable del seguimiento es obligatorio');
          return false;
        }
        break;
      
      case 'parques-estatales':
        if (!formData.parqueEstatal) {
          alert('Debe seleccionar un parque estatal');
          return false;
        }
        if (!formData.asistentes?.trim()) {
          alert('El campo Asistentes es obligatorio');
          return false;
        }
        if (!formData.corteCaja?.trim()) {
          alert('El campo Corte de caja es obligatorio');
          return false;
        }
        break;
      
      case 'turismo':
        if (!formData.nombreEvento?.trim()) {
          alert('El nombre del evento es obligatorio');
          return false;
        }
        if (!formData.asistentes?.trim()) {
          alert('El campo Asistentes es obligatorio');
          return false;
        }
        if (!formData.corteCaja?.trim()) {
          alert('El campo Corte de caja es obligatorio');
          return false;
        }
        break;
    }
    
    return true;
  };

  const getDefaultDependencies = (type: string): string[] => {
    switch (type) {
      case 'rio-santa-catarina':
        return ['SIMEPRODE', 'Agua y Drenaje', 'PEMA'];
      case 'manejos-fauna':
        return ['PEMA', 'Protección Civil'];
      case 'proteccion-anps':
        return ['PEMA', 'Guardia Nacional'];
      case 'parques-estatales':
        return ['PEMA', 'Servicios Públicos del Municipio'];
      case 'turismo':
        return ['PEMA', 'Protección Civil', 'Servicios Públicos del Municipio'];
      default:
        return ['PEMA'];
    }
  };

  const getFormTitle = (): string => {
    switch (cardType) {
      case 'rio-santa-catarina':
        return 'Nuevo Reporte - Río Santa Catarina';
      case 'manejos-fauna':
        return 'Nuevo Reporte - Manejos de Fauna';
      case 'proteccion-anps':
        return 'Nuevo Reporte - Protección de ANPs';
      case 'parques-estatales':
        return 'Nuevo Reporte - Parques Estatales';
      case 'turismo':
        return 'Nuevo Reporte - Turismo';
      default:
        return 'Nuevo Reporte';
    }
  };

  const renderSpecificFields = () => {
    switch (cardType) {
      case 'rio-santa-catarina':
      case 'manejos-fauna':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Abstracto *
              </label>
              <textarea
                rows={3}
                value={formData.abstracto || ''}
                onChange={(e) => handleInputChange('abstracto', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Resumen del reporte..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2 text-emerald-600" />
                Fecha del reporte *
              </label>
              <input
                type="date"
                value={formData.fechaReporte || ''}
                onChange={(e) => handleInputChange('fechaReporte', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ranger reportante *
              </label>
              <input
                type="text"
                value={formData.rangerReportante || ''}
                onChange={(e) => handleInputChange('rangerReportante', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Nombre del ranger"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Responsable del seguimiento *
              </label>
              <input
                type="text"
                value={formData.responsableSeguimiento || ''}
                onChange={(e) => handleInputChange('responsableSeguimiento', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Nombre del responsable"
                required
              />
            </div>
          </>
        );

      case 'proteccion-anps':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Abstracto *
              </label>
              <textarea
                rows={3}
                value={formData.abstracto || ''}
                onChange={(e) => handleInputChange('abstracto', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Resumen del reporte..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ANP involucrada *
              </label>
              <select
                value={formData.anpInvolucrada || ''}
                onChange={(e) => handleInputChange('anpInvolucrada', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                required
              >
                <option value="">Seleccionar ANP</option>
                <option value="La Huasteca">La Huasteca</option>
                <option value="Cerro de la Silla">Cerro de la Silla</option>
                <option value="Cumbres de Monterrey">Cumbres de Monterrey</option>
                <option value="El Cerrito">El Cerrito</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2 text-emerald-600" />
                Fecha del reporte *
              </label>
              <input
                type="date"
                value={formData.fechaReporte || ''}
                onChange={(e) => handleInputChange('fechaReporte', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ranger reportante *
              </label>
              <input
                type="text"
                value={formData.rangerReportante || ''}
                onChange={(e) => handleInputChange('rangerReportante', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Nombre del ranger"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Responsable del seguimiento *
              </label>
              <input
                type="text"
                value={formData.responsableSeguimiento || ''}
                onChange={(e) => handleInputChange('responsableSeguimiento', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Nombre del responsable"
                required
              />
            </div>
          </>
        );

      case 'parques-estatales':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Parque Estatal *
              </label>
              <select
                value={formData.parqueEstatal || ''}
                onChange={(e) => handleInputChange('parqueEstatal', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                required
              >
                <option value="">Seleccionar Parque</option>
                <option value="El Cuchillo">Parque Estatal El Cuchillo</option>
                <option value="La Huasteca">Parque Estatal La Huasteca</option>
                <option value="Cerro de la Silla">Parque Estatal Cerro de la Silla</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Asistentes *
              </label>
              <input
                type="number"
                value={formData.asistentes || ''}
                onChange={(e) => handleInputChange('asistentes', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Número de asistentes"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Corte de caja *
              </label>
              <input
                type="text"
                value={formData.corteCaja || ''}
                onChange={(e) => handleInputChange('corteCaja', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Monto del corte de caja (ej: $85,000)"
                required
              />
            </div>
          </>
        );

      case 'turismo':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nombre del evento *
              </label>
              <input
                type="text"
                value={formData.nombreEvento || ''}
                onChange={(e) => handleInputChange('nombreEvento', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Nombre del evento turístico"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Asistentes *
              </label>
              <input
                type="number"
                value={formData.asistentes || ''}
                onChange={(e) => handleInputChange('asistentes', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Número de asistentes"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Corte de caja *
              </label>
              <input
                type="text"
                value={formData.corteCaja || ''}
                onChange={(e) => handleInputChange('corteCaja', e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                placeholder="Monto del corte de caja (ej: $150,000)"
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{getFormTitle()}</h2>
              <p className="text-emerald-100">Completa la información del reporte</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campos Específicos por Tipo */}
            <section>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                Información del Reporte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSpecificFields()}
              </div>
            </section>


            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Crear Reporte</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RIRReportForm;