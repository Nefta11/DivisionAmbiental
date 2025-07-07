import React, { useState } from 'react';
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
    'Fuerza Civil',
    'Agua y Drenaje',
    'PROFEPA',
    'Procuraduría Ambiental',
    'Guardia Nacional',
    'Secretaría de Medio Ambiente',
    'Protección Civil',
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

  const categoriasDelito = [
    'Contaminación del agua',
    'Contaminación del aire',
    'Contaminación del suelo',
    'Ruido excesivo',
    'Manejo inadecuado de residuos',
    'Deforestación',
    'Caza ilegal',
    'Pesca ilegal',
    'Construcción irregular',
    'Vertido de químicos',
    'Incendio',
    'Otro'
  ];

  const prioridades = [
    'Baja',
    'Media',
    'Alta',
    'Crítica'
  ];

  const estados = [
    'Pendiente',
    'En proceso',
    'Completado',
    'Cancelado'
  ];

  const dependencias = [
    'SIMEPRODE',
    'FIDEURB',
    'FIDEFIFA',
    'LIMPIALEÓN',
    'Servicios Públicos del Municipio',
    'PEMA',
    'Fuerza Civil',
    'Agua y Drenaje',
    'Bomberos',
    'Protección Civil',
    'Guardia Forestal',
  ];

  const equiposEspeciales = [
    'Maquinaria pesada',
    'Reparación de drenaje',
    'Contención química',
    'Equipo de buceo',
    'Drones',
    'Laboratorio móvil',
    'Equipo de rescate',
    'Vehículos especializados'
  ];

  const estudiosLab = [
    'Agua',
    'Suelo',
    'Aire',
    'Sangre',
    'Flora',
    'Fauna',
    'Toxinas',
    'Metales pesados',
    'Hidrocarburos',
    'Pesticidas'
  ];

  const medidasSanciones = [
    'Clausura total',
    'Clausura parcial',
    'Multa',
    'Prisión',
    'Trabajo comunitario',
    'Suspensión de actividades',
    'Decomiso'
  ];

  const remediaciones = [
    'Limpieza',
    'Reforestación',
    'Donación',
    'Restauración de ecosistema',
    'Tratamiento de suelos',
    'Filtración de agua',
    'Monitoreo continuo'
  ];

  const operadores = Array.from({ length: 15 }, (_, i) => `Operador${i + 1}`);

  const handleInputChange = (field: keyof Report, value: any) => {
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

    // Prepara los datos para enviar al backend
    const dataToSend = {
      ...formData,
      dependenciasInvolucradas: Array.isArray(formData.dependenciasInvolucradas)
        ? formData.dependenciasInvolucradas
        : [],
      medidasSancion: Array.isArray(formData.medidasSancion)
        ? formData.medidasSancion
        : [],
      remediacionEjecutada: Array.isArray(formData.remediacionEjecutada)
        ? formData.remediacionEjecutada
        : [],
      equipoEspecial: Array.isArray(formData.equipoEspecial)
        ? formData.equipoEspecial
        : (formData.equipoEspecial
            ? formData.equipoEspecial.split(',').map(s => s.trim()).filter(Boolean)
            : []),
      estudiosLaboratorio: Array.isArray(formData.estudiosLaboratorio)
        ? formData.estudiosLaboratorio
        : (formData.estudiosLaboratorio
            ? formData.estudiosLaboratorio.split(',').map(s => s.trim()).filter(Boolean)
            : []),
      resultadosEstudios: formData.resultadosEstudios instanceof File
        ? formData.resultadosEstudios.name
        : null,
      evidenciaSancion: formData.evidenciaSancion instanceof File
        ? formData.evidenciaSancion.name
        : null,
    };

    // TEMPORAL: Comentado para evitar conexión a API y funcionar en modo offline
    /*
    try {
      const response = await fetch(`/api/reportes/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Error al actualizar el reporte');
        return;
      }

      const updated = await response.json();
      onSave({ ...formData, ...updated.report });
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
    */

    // TEMPORAL: Actualización solo local
    try {
      // Crear el reporte actualizado con todos los datos
      const updatedReport = {
        ...formData,
        ...dataToSend
      };
      
      onSave(updatedReport);
    } catch {
      alert('Error al actualizar el reporte');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-50 p-4 overflow-y-auto modal-scroll">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8 border border-emerald-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Editar Reporte</h2>
              <p className="text-emerald-100">ID: {report.id}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-3 hover:bg-white/20 rounded-2xl transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto modal-scroll">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Información Básica */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Canal de origen *
                  </label>
                  <select
                    required
                    value={formData.canalOrigen}
                    onChange={(e) => handleInputChange('canalOrigen', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  >
                    <option value="">Seleccionar canal</option>
                    {canalesOrigen.map(canal => (
                      <option key={canal} value={canal}>{canal}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Estado del reporte
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value as any)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  >
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Globe className="w-4 h-4 inline mr-2 text-emerald-600" />
                    URL de referencia
                  </label>
                  <input
                    type="url"
                    value={formData.urlReferencia}
                    onChange={(e) => handleInputChange('urlReferencia', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>
            </section>

            {/* Detalles del Reporte */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Detalles del Reporte
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Descripción del reporte *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Describe detalladamente el incidente..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2 text-emerald-600" />
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Dirección o enlace de Google Maps"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Categoría del delito *
                    </label>
                    <select
                      required
                      value={formData.categoriaDelito}
                      onChange={(e) => handleInputChange('categoriaDelito', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categoriasDelito.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <AlertTriangle className="w-4 h-4 inline mr-2 text-emerald-600" />
                      Prioridad *
                    </label>
                    <select
                      required
                      value={formData.prioridad}
                      onChange={(e) => handleInputChange('prioridad', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    >
                      <option value="">Seleccionar prioridad</option>
                      {prioridades.map(prioridad => (
                        <option key={prioridad} value={prioridad}>{prioridad}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Operativo */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Operativo
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Dependencias involucradas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dependencias.map(dep => (
                      <label key={dep} className="flex items-center space-x-3 p-4 border-2 border-emerald-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dependenciasInvolucradas.includes(dep)}
                          onChange={() => handleMultiSelectChange('dependenciasInvolucradas', dep)}
                          className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded-lg"
                        />
                        <span className="text-sm font-medium">{dep}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    <Wrench className="w-4 h-4 inline mr-2 text-emerald-600" />
                    Equipo especial necesario
                  </label>
                  <textarea
                    rows={4}
                    value={formData.equipoEspecial}
                    onChange={(e) => handleInputChange('equipoEspecial', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Describe el equipo especial necesario..."
                  />
                </div>
              </div>
            </section>

            {/* Estudios y Análisis */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                Estudios y Análisis
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Estudios de laboratorio requeridos
                  </label>
                  <textarea
                    rows={4}
                    value={formData.estudiosLaboratorio}
                    onChange={(e) => handleInputChange('estudiosLaboratorio', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Describe los estudios de laboratorio requeridos..."
                  />
                </div>

              </div>
            </section>



            {/* Buttons */}
            <div className="flex justify-end space-x-6 pt-8 border-t-2 border-emerald-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
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
  );
};

export default EditReportModal;