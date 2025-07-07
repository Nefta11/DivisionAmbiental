import React, { useState } from "react";
import {
  FileText,
  Plus,
  Upload,
  X,
} from "lucide-react";
import CreateReportForm from "./CreateReportForm";

interface ManagementDashboardProps {
  onGoBack: () => void;
  reports: Report[];
  onUpdateReport: (report: Report) => void;
  onCreateReport: (data: {
    fuenteReporte: string;
    descripcion: string;
    telefonoContacto: string;
    peticionReportante: string;
    fotosVideos: File | null;
    ubicacion: string;
    dependenciasInvolucradas: string[];
    operadorAsignado: string;
  }) => void;
}

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
  estado: "Pendiente" | "En proceso" | "Completado" | "Cancelado";
}

interface ReportRow {
  id: string;
  descripcionReporte: string;
  dependenciaReportante: string;
  dependenciaAsignada: string;
  responsableSeguimiento: string;
  requerimientosMateriales: string;
  mision: string;
  tiempoObjetivo: string;
  fechaReporte: string;
  estadoReporte: string;
  atencionReporte: string;
  categoria: string;
  pruebaAudiovisual: string;
  reportadoEnVivo: boolean;
  mediatizable: boolean;
  publicadoEnHistorias: boolean;
  sanciones: string;
  autoridadSancionadora: string;
  completado: boolean;
}

interface EditModalData {
  isOpen: boolean;
  rowId: string;
  field: keyof ReportRow;
  value: string;
  fieldLabel: string;
  fieldType: "text" | "select" | "date" | "file";
  options?: string[];
}

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  onGoBack,
  reports,
  onUpdateReport,
  onCreateReport,
}) => {
  const [completedRows, setCompletedRows] = useState<string[]>([]);
  const [dashboardReports, setDashboardReports] = useState<ReportRow[]>([]);

  // Convertir reportes a formato de dashboard cuando cambien los reportes
  React.useEffect(() => {
    const convertedReports: ReportRow[] = reports.map((report) => ({
      id: report.id,
      descripcionReporte: report.descripcion,
      dependenciaReportante: report.fuenteReporte,
      dependenciaAsignada:
        report.dependenciasInvolucradas.join(", ") || "Sin asignar",
      responsableSeguimiento: report.operadorAsignado || "Sin asignar",
      requerimientosMateriales: "Por definir",
      mision: "Por definir",
      tiempoObjetivo: "Por definir",
      fechaReporte: report.fechaCreacion,
      estadoReporte: report.estado,
      atencionReporte: report.estado,
      categoria: "Por definir",
      pruebaAudiovisual: report.fotosVideos ? report.fotosVideos.name : "Sin archivo",
      reportadoEnVivo: false,
      mediatizable: false,
      publicadoEnHistorias: false,
      sanciones: "Por definir",
      autoridadSancionadora: "Por definir",
      completado: report.estado === "Completado",
    }));

    setDashboardReports(convertedReports);

    // Actualizar filas completadas basado en el estado
    const completedIds = convertedReports
      .filter((report) => report.completado)
      .map((report) => report.id);
    setCompletedRows(completedIds);
  }, [reports]);

  const [editModal, setEditModal] = useState<EditModalData>({
    isOpen: false,
    rowId: "",
    field: "descripcionReporte",
    value: "",
    fieldLabel: "",
    fieldType: "text",
    options: [],
  });

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

  const categorias = [
    "Contaminación del agua",
    "Contaminación del aire",
    "Contaminación del suelo",
    "Ruido excesivo",
    "Manejo inadecuado de residuos",
    "Deforestación",
    "Caza ilegal",
    "Pesca ilegal",
    "Construcción irregular",
    "Vertido de químicos",
    "Incendio",
  ];

  const responsables = Array.from({ length: 15 }, (_, i) => `Operador${i + 1}`);

  const estadosReporte = ["Pendiente", "En proceso", "Completado", "Cancelado"];

  const autoridadesSancionadoras = [
    "PROFEPA",
    "SEMARNAT",
    "Procuraduría Ambiental",
    "Municipio",
    "CONAGUA",
    "CONANP",
    "Fiscalía General",
    "Otra",
  ];
  const handleRowComplete = (rowId: string) => {
    setCompletedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );

    // Actualizar el estado del reporte automáticamente en dashboard
    setDashboardReports((prev) =>
      prev.map((report) =>
        report.id === rowId
          ? {
              ...report,
              completado: !completedRows.includes(rowId),
              estadoReporte: !completedRows.includes(rowId)
                ? "Completado"
                : "En proceso",
            }
          : report
      )
    );

    // Actualizar el reporte original
    const originalReport = reports.find((r) => r.id === rowId);
    if (originalReport && onUpdateReport) {
      const updatedReport = {
        ...originalReport,
        estado: (!completedRows.includes(rowId)
          ? "Completado"
          : "En proceso") as
          | "Pendiente"
          | "En proceso"
          | "Completado"
          | "Cancelado",
      };
      onUpdateReport(updatedReport);
    }
  };

  const handleCompleteAll = () => {
    if (completedRows.length === dashboardReports.length) {
      setCompletedRows([]);
      setDashboardReports((prev) =>
        prev.map((report) => ({
          ...report,
          completado: false,
          estadoReporte: "En proceso",
        }))
      );
    } else {
      setCompletedRows(dashboardReports.map((report) => report.id));
      setDashboardReports((prev) =>
        prev.map((report) => ({
          ...report,
          completado: true,
          estadoReporte: "Completado",
        }))
      );
    }
  };

  const openEditModal = (
    rowId: string,
    field: keyof ReportRow,
    fieldLabel: string
  ) => {
    // No permitir editar si el reporte está completado
    if (completedRows.includes(rowId)) {
      return;
    }

    const report = dashboardReports.find((r) => r.id === rowId);
    if (!report) return;

    let fieldType: "text" | "select" | "date" | "file" = "text";
    let options: string[] = [];
    let fieldValue = report[field];

    // Convertir valor booleano a string si es necesario
    if (typeof fieldValue === "boolean") {
      fieldValue = fieldValue.toString();
    }

    // Determinar el tipo de campo y opciones
    switch (field) {
      case "dependenciaReportante":
      case "dependenciaAsignada":
        fieldType = "select";
        options = dependenciasDisponibles;
        break;
      case "responsableSeguimiento":
        fieldType = "select";
        options = responsables;
        break;
      case "categoria":
        fieldType = "select";
        options = categorias;
        break;
      case "estadoReporte":
      case "atencionReporte":
        fieldType = "select";
        options = estadosReporte;
        break;
      case "autoridadSancionadora":
        fieldType = "select";
        options = autoridadesSancionadoras;
        break;
      case "fechaReporte":
        fieldType = "date";
        break;
      case "pruebaAudiovisual":
        fieldType = "file";
        break;
      default:
        fieldType = "text";
    }

    setEditModal({
      isOpen: true,
      rowId,
      field,
      value: fieldValue as string,
      fieldLabel,
      fieldType,
      options,
    });
  };

  const handleModalSave = () => {
    setDashboardReports((prev) =>
      prev.map((report) =>
        report.id === editModal.rowId
          ? { ...report, [editModal.field]: editModal.value }
          : report
      )
    );

    // También actualizar el reporte original si es necesario
    const originalReport = reports.find((r) => r.id === editModal.rowId);
    if (originalReport && onUpdateReport) {
      // Mapear campos del dashboard a campos del reporte original
      const fieldMapping: Record<string, keyof Report> = {
        descripcionReporte: "descripcion",
        dependenciaReportante: "fuenteReporte",
        estadoReporte: "estado",
        atencionReporte: "estado",
        responsableSeguimiento: "operadorAsignado",
        // Agregar más mapeos según sea necesario
      };

      const originalField = fieldMapping[editModal.field as string];
      if (originalField) {
        const updatedReport = {
          ...originalReport,
          [originalField]: editModal.value,
        };
        onUpdateReport(updatedReport);
      }
    }

    closeEditModal();
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      rowId: "",
      field: "descripcionReporte",
      value: "",
      fieldLabel: "",
      fieldType: "text",
      options: [],
    });
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setEditModal((prev) => ({ ...prev, value: file.name }));
    }
  };

  const columns = [
    {
      key: "descripcionReporte",
      label: "Descripción del reporte",
      width: "w-64",
    },
    {
      key: "dependenciaReportante",
      label: "Dependencia reportante",
      width: "w-48",
    },
    {
      key: "dependenciaAsignada",
      label: "Dependencia asignada",
      width: "w-48",
    },
    {
      key: "responsableSeguimiento",
      label: "Responsable de seguimiento",
      width: "w-48",
    },
    {
      key: "requerimientosMateriales",
      label: "Requerimientos materiales",
      width: "w-48",
    },
    { key: "mision", label: "Misión", width: "w-40" },
    { key: "tiempoObjetivo", label: "Tiempo objetivo", width: "w-32" },
    { key: "fechaReporte", label: "Fecha de reporte", width: "w-32" },
    { key: "estadoReporte", label: "Estado del reporte", width: "w-32" },
    { key: "atencionReporte", label: "Atención del reporte", width: "w-40" },
    { key: "categoria", label: "Categoría", width: "w-32" },
    { key: "pruebaAudiovisual", label: "Prueba audiovisual", width: "w-40" },
    { key: "reportadoEnVivo", label: "Reportado en vivo", width: "w-32" },
    { key: "mediatizable", label: "¿Mediatizable?", width: "w-32" },
    {
      key: "publicadoEnHistorias",
      label: "Publicado en historias",
      width: "w-40",
    },
    { key: "sanciones", label: "Sanciones", width: "w-48" },
    {
      key: "autoridadSancionadora",
      label: "Autoridad Sancionadora",
      width: "w-40",
    },
  ];

  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const handleCreateReport = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleSubmitReport = (data: {
    fuenteReporte: string;
    descripcion: string;
    telefonoContacto: string;
    peticionReportante: string;
    fotosVideos: File | null;
    ubicacion: string;
    dependenciasInvolucradas: string[];
    operadorAsignado: string;
  }) => {
    onCreateReport(data);
    setShowCreateForm(false);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 shadow-lg relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onGoBack}
                className="p-3 hover:bg-white/20 rounded-2xl transition-colors duration-200"
              >
                <FileText className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Dashboard de Gestión</h1>
                <p className="text-emerald-100 mt-1">
                  Sistema integral de seguimiento y control
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCreateReport}
                className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-white font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Agregar reporte</span>
              </button>
            </div>
          </div>
        </div>

        {/* Excel-style Table */}
        <div className="p-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
            {/* Scroll Container with Custom Scrollbar */}
            <div
              className="overflow-x-auto max-w-full custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#10b981 #f3f4f6",
              }}
            >
              <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white whitespace-nowrap">
                    {/* Checkbox Column */}
                    <th className="w-12 p-3 text-center border-r border-emerald-500 sticky left-0 bg-gradient-to-r from-emerald-600 to-emerald-700 z-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                        onChange={handleCompleteAll}
                        checked={
                          completedRows.length === reports.length &&
                          reports.length > 0
                        }
                      />
                    </th>

                    {/* Column Headers */}
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`${column.width} p-3 text-left text-sm font-bold border-r border-emerald-500 last:border-r-0 min-w-0`}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {dashboardReports.map((report, rowIndex) => (
                    <tr
                      key={report.id}
                      className={`border-b border-gray-200 hover:bg-emerald-50 transition-colors duration-200 whitespace-nowrap ${
                        completedRows.includes(report.id)
                          ? "bg-emerald-100/70 shadow-lg shadow-emerald-200/50 border-emerald-300"
                          : rowIndex % 2 === 0
                          ? "bg-white hover:bg-emerald-50"
                          : "bg-gray-50 hover:bg-emerald-50"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center border-r border-gray-200 sticky left-0 bg-white z-10">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                          checked={completedRows.includes(report.id)}
                          onChange={() => handleRowComplete(report.id)}
                        />
                      </td>

                      {/* Data Cells */}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`p-2 border-r border-gray-200 last:border-r-0 min-w-0 ${
                            completedRows.includes(report.id)
                              ? "opacity-75"
                              : ""
                          }`}
                        >
                          {column.key === "reportadoEnVivo" ||
                          column.key === "mediatizable" ||
                          column.key === "publicadoEnHistorias" ? (
                            <div className="flex justify-center">
                              <input
                                type="checkbox"
                                checked={
                                  report[
                                    column.key as keyof ReportRow
                                  ] as boolean
                                }
                                onChange={(e) => {
                                  if (!completedRows.includes(report.id)) {
                                    setDashboardReports((prev) =>
                                      prev.map((r) =>
                                        r.id === report.id
                                          ? {
                                              ...r,
                                              [column.key]: e.target.checked,
                                            }
                                          : r
                                      )
                                    );
                                  }
                                }}
                                className={`w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded ${
                                  completedRows.includes(report.id)
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                disabled={completedRows.includes(report.id)}
                              />
                            </div>
                          ) : column.key === "pruebaAudiovisual" ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  openEditModal(
                                    report.id,
                                    column.key as keyof ReportRow,
                                    column.label
                                  )
                                }
                                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-200 ${
                                  completedRows.includes(report.id)
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 cursor-pointer"
                                }`}
                                disabled={completedRows.includes(report.id)}
                              >
                                <Upload className="w-3 h-3" />
                                <span className="text-xs">Subir</span>
                              </button>
                              {report[column.key as keyof ReportRow] && (
                                <span
                                  className="text-xs text-emerald-600 truncate max-w-20"
                                  title={String(report[column.key as keyof ReportRow])}
                                >
                                  {String(report[column.key as keyof ReportRow])}
                                </span>
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={String(report[column.key as keyof ReportRow])}
                              onClick={() =>
                                openEditModal(
                                  report.id,
                                  column.key as keyof ReportRow,
                                  column.label
                                )
                              }
                              readOnly
                              className={`w-full px-2 py-1 text-xs border rounded transition-colors duration-200 min-w-0 ${
                                completedRows.includes(report.id)
                                  ? "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600"
                                  : "border-gray-300 cursor-pointer hover:bg-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                              }`}
                              placeholder={`Ingrese ${column.label.toLowerCase()}`}
                              disabled={completedRows.includes(report.id)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {dashboardReports.length} fila
                    {dashboardReports.length !== 1 ? "s" : ""} total
                    {dashboardReports.length !== 1 ? "es" : ""}
                  </span>
                  {completedRows.length > 0 && (
                    <span className="ml-4 font-medium text-emerald-600">
                      {completedRows.length} completada
                      {completedRows.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 sm:self-center">
                    <span className="animate-pulse">⬅️➡️</span>
                    <span className="font-medium">
                      Desliza horizontalmente para ver más campos
                    </span>
                  </div>
                  <button
                    onClick={onGoBack}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 text-sm w-full sm:w-auto"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-emerald-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-xl font-bold">{editModal.fieldLabel}</h3>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {editModal.fieldLabel}
                </label>

                {editModal.fieldType === "text" && (
                  <textarea
                    value={editModal.value}
                    onChange={(e) =>
                      setEditModal((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 resize-none"
                    rows={3}
                    placeholder={`Ingrese ${editModal.fieldLabel.toLowerCase()}`}
                  />
                )}

                {editModal.fieldType === "select" && (
                  <select
                    value={editModal.value}
                    onChange={(e) =>
                      setEditModal((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  >
                    <option value="">Seleccionar opción</option>
                    {editModal.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {editModal.fieldType === "date" && (
                  <input
                    type="date"
                    value={editModal.value}
                    onChange={(e) =>
                      setEditModal((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  />
                )}

                {editModal.fieldType === "file" && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors duration-300">
                      <input
                        type="file"
                        accept="video/*,audio/*,image/*"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                          <Upload className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Subir archivo
                          </p>
                          <p className="text-xs text-gray-500">
                            Video, audio o imagen
                          </p>
                        </div>
                      </label>
                    </div>
                    {editModal.value && (
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <p className="text-sm font-medium text-emerald-800">
                          Archivo seleccionado:
                        </p>
                        <p className="text-sm text-emerald-600">
                          {editModal.value}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleModalSave}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateForm && (
        <CreateReportForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitReport}
        />
      )}
    </>
  );
};

export default ManagementDashboard;
