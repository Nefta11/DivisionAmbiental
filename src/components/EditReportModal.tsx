import React, { useState, useEffect } from 'react';
import { X, Save, Upload, MapPin, Phone, FileText, AlertTriangle, Users } from 'lucide-react';

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

interface EditReportModalProps {
  report: Report;
  onSave: (report: Report) => void;
  onCancel: () => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({ report, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Report>({ ...report });

  // Bloquear scroll del fondo cuando el modal esté abierto
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const fuentesReporte = [
    'Llamada de teléfono a la Guardia Forestal',
    'Mensaje por instagram a PVSNL',
    'Mensaje por instagram a la Guardia Forestal',
    'Mensaje a Dirección de Enlaces por Instagram',
    'Mensaje a Dirección de Enlaces por grupos de Whatsapp',
    'Redes de GAVZ',
    '070',
    'Canalización de SMA',
    'Canalización de Agua y Drenaje',
    'Patrullaje',
    'Reporte a colaborador de PVSNL'
  ];

  const dependenciasDisponibles = [
    'SIMEPRODE',
    'FIDEURB',
    'FIDEFIFA',
    'LIMPIALEÓN',
    'Fuerza Civil',
    'Agua y Drenaje',
    'Servicios Públicos del Municipio',
    'Protección Civil',
    'PEMA',
    'Guardia Nacional',
    'Secretaría de Medio Ambiente',
    'Bomberos',
    'Cruz Roja'
  ];

  const operadoresDisponibles = [
    'Limpieza de ríos',
    'Tiraderos en zonas silvestres',
    'Manejo de fauna',
    'ANPs',
    'Varios'
  ];

  const handleInputChange = (field: keyof Report, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: keyof Report, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.fuenteReporte) {
      alert('Por favor selecciona la fuente del reporte');
      return;
    }
    if (!formData.descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    // TEMPORAL: Guardar solo localmente
    try {
      onSave(formData);
    } catch {
      alert('Error al actualizar el reporte');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] border border-emerald-100 overflow-hidden flex flex-col">
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 flex items-center justify-between rounded-t-3xl flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Editar Reporte</h2>
              <p className="text-emerald-100">Modifica la información del reporte</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto modal-scroll">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Fuente del Reporte */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                Fuente del Reporte
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fuente del reporte *
                  </label>
                  <select
                    value={formData.fuenteReporte}
                    onChange={(e) => handleInputChange('fuenteReporte', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    required
                  >
                    <option value="">Seleccionar fuente</option>
                    {fuentesReporte.map(fuente => (
                      <option key={fuente} value={fuente}>{fuente}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Descripción */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Descripción
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Descripción del reporte *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Describe detalladamente el incidente ambiental..."
                    required
                  />
                </div>
              </div>
            </section>

            {/* Contacto y Petición */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Teléfono de contacto del reportante
                  </label>
                  <input
                    type="tel"
                    value={formData.telefonoContacto}
                    onChange={(e) => handleInputChange('telefonoContacto', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="+52 81 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Qué pide el reportante?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.peticionReportante}
                    onChange={(e) => handleInputChange('peticionReportante', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Petición o solicitud del reportante..."
                  />
                </div>
              </div>
            </section>

            {/* Fotos/Videos y Ubicación */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Evidencia y Ubicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Upload className="w-4 h-4 inline mr-2 text-emerald-600" />
                    Fotos o videos
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileChange('fotosVideos', e.target.files ? e.target.files[0] : null)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2 text-emerald-600" />
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Ubicación específica del incidente"
                  />
                </div>
              </div>
            </section>

            {/* Dependencias y Operador */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Asignación y Dependencias
              </h3>
              <div className="space-y-6">
                
                {/* Dependencias Involucradas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Dependencias involucradas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dependenciasDisponibles.map((dep) => (
                      <label key={dep} className="flex items-center space-x-2 p-3 border border-emerald-200 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.dependenciasInvolucradas.includes(dep)}
                          onChange={() => handleMultiSelectChange('dependenciasInvolucradas', dep)}
                          className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{dep}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Operador Asignado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Operador asignado
                  </label>
                  <select
                    value={formData.operadorAsignado}
                    onChange={(e) => handleInputChange('operadorAsignado', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  >
                    <option value="">Seleccionar operador</option>
                    {operadoresDisponibles.map(operador => (
                      <option key={operador} value={operador}>{operador}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Estado */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Estado del Reporte</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value as Report['estado'])}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReportModal;
