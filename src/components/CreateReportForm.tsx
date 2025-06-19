import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, User, Phone, Globe, FileText, AlertTriangle, Users, Wrench, FlaskConical, FileCheck, Gavel, Recycle, Megaphone, CheckCircle, XCircle } from 'lucide-react';

interface CreateReportFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    agente: '',
    nombreReportante: '',
    telefonoReportante: '',
    canalOrigen: '',
    urlReferencia: '',
    descripcion: '',
    ubicacion: '',
    categoriaDelito: '',
    prioridad: '',
    dependenciasInvolucradas: [] as string[],
    responsableOperativo: '',
    equipoEspecial: '',
    estudiosLaboratorio: '',
    resultadosEstudios: null as File | null,
    inspeccionRealizada: '',
    medidasSancion: [] as string[],
    evidenciaSancion: null as File | null,
    remediacionEjecutada: [] as string[],
    altamenteMediatizable: '',
    comunicadoPublicado: '',
    ticketFinalizadoSatisfactoriamente: '',
    ticketFinalizadoNoSatisfactoriamente: ''
  });

  const canalesOrigen = [
    'Teléfono',
    'Correo electrónico',
    'Redes sociales',
    'Presencial',
    'Página web',
    'Aplicación móvil',
    'Otro'
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
    'Otro'
  ];

  const prioridades = [
    'Baja',
    'Media',
    'Alta',
    'Crítica'
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
    'SEMAR',
    'Guardia Nacional',
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              <h2 className="text-2xl font-bold">Crear Nuevo Reporte</h2>
              <p className="text-emerald-100">Complete la información del incidente ambiental</p>
            </div>
          </div>
          <button
            onClick={onClose}
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
                <div></div> {/* Empty div to maintain grid layout */}
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
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200"
              >
                Crear Reporte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReportForm;