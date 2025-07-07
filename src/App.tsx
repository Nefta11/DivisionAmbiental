import React, { useState } from "react";
import { useEffect } from "react";
import Layout from "./components/Layout";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import MyReports from "./components/MyReports";
import ManagementDashboard from "./components/ManagementDashboard";
import DirectoryLinks from "./components/DirectoryLinks";
import MiDashboard from "./components/MiDashboard";
import { globalReportsManager, GlobalReport } from "./utils/globalStorage";

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("reportes");
  const [showManagementDashboard, setShowManagementDashboard] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  // Cargar reportes globales al inicializar la app
  useEffect(() => {
    const loadGlobalReports = () => {
      const globalReports = globalReportsManager.getGeneralReports();
      const convertedReports: Report[] = globalReports.map(globalReport => ({
        id: globalReport.id,
        fuenteReporte: globalReport.fuenteReporte,
        descripcion: globalReport.descripcion,
        telefonoContacto: globalReport.telefonoContacto || '',
        peticionReportante: globalReport.peticionReportante || '',
        fotosVideos: globalReport.fotosVideos || null,
        ubicacion: globalReport.ubicacion || '',
        dependenciasInvolucradas: globalReport.dependenciasInvolucradas,
        operadorAsignado: globalReport.operadorAsignado,
        fechaCreacion: globalReport.fechaCreacion,
        estado: globalReport.estado,
      }));
      setReports(convertedReports);
    };

    loadGlobalReports();
  }, []);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveSection("reportes");
    setShowManagementDashboard(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleSectionChange = (section: string) => {
    console.log("App handleSectionChange:", section);
    setShowManagementDashboard(false);
    setActiveSection(section);
  };

  const handleCreateReport = (reportData: {
    fuenteReporte: string;
    descripcion: string;
    telefonoContacto: string;
    peticionReportante: string;
    fotosVideos: File | null;
    ubicacion: string;
    dependenciasInvolucradas: string[];
    operadorAsignado: string;
  }) => {
    try {
      // Crear reporte en el sistema global
      const globalReportData: Omit<GlobalReport, 'id'> = {
        type: 'general',
        createdBy: currentUser?.nombre || currentUser?.username || 'Usuario Anónimo',
        createdByUserId: currentUser?.id || 'unknown',
        ...reportData,
        fechaCreacion: new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        estado: "Pendiente",
      };

      const newGlobalReport = globalReportsManager.addReport(globalReportData);
      
      // Convertir a formato local para el estado
      const newLocalReport: Report = {
        id: newGlobalReport.id,
        fuenteReporte: newGlobalReport.fuenteReporte,
        descripcion: newGlobalReport.descripcion,
        telefonoContacto: newGlobalReport.telefonoContacto || '',
        peticionReportante: newGlobalReport.peticionReportante || '',
        fotosVideos: newGlobalReport.fotosVideos || null,
        ubicacion: newGlobalReport.ubicacion || '',
        dependenciasInvolucradas: newGlobalReport.dependenciasInvolucradas,
        operadorAsignado: newGlobalReport.operadorAsignado,
        fechaCreacion: newGlobalReport.fechaCreacion,
        estado: newGlobalReport.estado,
      };

      setReports((prev) => [newLocalReport, ...prev]);
      console.log("Reporte creado exitosamente:", newGlobalReport);
    } catch (error) {
      console.error("Error al crear el reporte:", error);
      alert("Error inesperado al crear el reporte");
    }
  };

  const handleDeleteReport = (id: string) => {
    // Eliminar del sistema global
    const deleted = globalReportsManager.deleteReport(id);
    
    if (deleted) {
      // Actualizar estado local
      setReports((prev) => prev.filter((report) => report.id !== id));
    }
  };

  const handleGoToManagementDashboard = () => {
    setShowManagementDashboard(true);
  };

  const handleBackFromManagementDashboard = () => {
    setShowManagementDashboard(false);
  };

  const handleUpdateReport = async (updatedReport: Report) => {
    try {
      // Actualizar en el sistema global
      const globalUpdates: Partial<GlobalReport> = {
        fuenteReporte: updatedReport.fuenteReporte,
        descripcion: updatedReport.descripcion,
        telefonoContacto: updatedReport.telefonoContacto,
        peticionReportante: updatedReport.peticionReportante,
        ubicacion: updatedReport.ubicacion,
        dependenciasInvolucradas: updatedReport.dependenciasInvolucradas,
        operadorAsignado: updatedReport.operadorAsignado,
        estado: updatedReport.estado,
      };
      
      const updated = globalReportsManager.updateReport(updatedReport.id, globalUpdates);
      
      if (updated) {
        // Actualizar estado local
        setReports((prev) =>
          prev.map((r) =>
            r.id === updatedReport.id ? { ...r, ...updatedReport } : r
          )
        );
      }
    } catch {
      alert("Error al actualizar el reporte");
    }
  };

  // Si no está logueado, mostrar pantalla de login
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    if (showManagementDashboard) {
      return (
        <ManagementDashboard
          onGoBack={handleBackFromManagementDashboard}
          reports={reports}
          onUpdateReport={handleUpdateReport}
          onCreateReport={handleCreateReport}
        />
      );
    }

    switch (activeSection) {
      case "mis-mensajes":
        return <Chat />;
      case "mis-reportes":
        return (
          <MyReports
            reports={reports}
            onDeleteReport={handleDeleteReport}
            onGoToDashboard={handleGoToManagementDashboard}
          />
        );
      case "directorio-enlaces":
        return <DirectoryLinks />;
      case "mi-dashboard":
        return <MiDashboard currentUser={currentUser} />;
      case "reportes":
      default:
        return <Dashboard onCreateReport={handleCreateReport} />;
    }
  };

  const getTitle = () => {
    if (showManagementDashboard) {
      return "Dashboard de Gestión";
    }

    switch (activeSection) {
      case "mis-mensajes":
        return "Mis Mensajes";
      case "mis-reportes":
        return "Mis Reportes";
      case "directorio-enlaces":
        return "Directorio de Enlaces";
      case "mi-dashboard":
        return "Mi dashboard";
      case "reportes":
      default:
        return "Reportes";
    }
  };

  return (
    <Layout
      activeItem={activeSection}
      onItemClick={handleSectionChange}
      onLogout={handleLogout}
      title={getTitle()}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;