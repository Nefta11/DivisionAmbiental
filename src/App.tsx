import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MyReports from './components/MyReports';
import ManagementDashboard from './components/ManagementDashboard';

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

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('reportes');
  const [showManagementDashboard, setShowManagementDashboard] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      console.log('Login successful:', { email, password });
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setActiveSection('reportes');
  };

  const handleSectionChange = (section: string) => {
    console.log('App handleSectionChange:', section); // Para debug
    // Asegurar que salimos del management dashboard cuando navegamos
    setShowManagementDashboard(false);
    setActiveSection(section);
  };

  const handleCreateReport = (reportData: any) => {
    const newReport: Report = {
      ...reportData,
      agente: email, // Use the logged-in user's email as the agent
      id: Date.now().toString(),
      fechaCreacion: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      estado: 'Pendiente' as const
    };

    setReports(prev => [newReport, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const handleUpdateReport = (updatedReport: Report) => {
    console.log('App - Actualizando reporte:', updatedReport); // Para debug
    console.log('Reportes antes de actualizar:', reports); // Para debug
    setReports(prev => prev.map(report =>
      report.id === updatedReport.id ? updatedReport : report
    ));
  };
  const handleGoToManagementDashboard = () => {
    setShowManagementDashboard(true);
  };

  const handleBackFromManagementDashboard = () => {
    setShowManagementDashboard(false);
  };

  const renderContent = () => {
    if (showManagementDashboard) {
      return <ManagementDashboard onGoBack={handleBackFromManagementDashboard} reports={reports} onUpdateReport={handleUpdateReport} />;
    }

    switch (activeSection) {
      case 'mis-reportes':
        return (
          <MyReports
            reports={reports}
            onDeleteReport={handleDeleteReport}
            onUpdateReport={handleUpdateReport}
            onGoToDashboard={handleGoToManagementDashboard}
          />
        );
      case 'reportes':
      default:
        return <Dashboard onCreateReport={handleCreateReport} />;
    }
  };

  if (isLoggedIn) {
    return (
      <Layout activeItem={activeSection} onItemClick={handleSectionChange} onLogout={handleLogout}>
        {renderContent()}
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Elegant Light Beams */}
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-transparent via-emerald-300/40 to-transparent animate-beam-1 opacity-60"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent animate-beam-2 opacity-70"></div>
        <div className="absolute top-0 left-2/3 w-3 h-full bg-gradient-to-b from-transparent via-emerald-200/30 to-transparent animate-beam-3 opacity-50"></div>

        {/* Elegant Light Streaks */}
        <div className="absolute top-1/4 -left-20 w-96 h-1 bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent animate-streak-1"></div>
        <div className="absolute top-2/3 -right-20 w-80 h-0.5 bg-gradient-to-l from-transparent via-emerald-400/70 to-transparent animate-streak-2"></div>
        <div className="absolute top-1/2 -left-32 w-72 h-2 bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent animate-streak-3"></div>

        {/* Elegant Energy Orbs */}
        <div className="absolute top-1/6 left-1/5 w-32 h-32 bg-gradient-radial from-emerald-300/40 via-emerald-400/30 to-transparent rounded-full animate-pulse-orb-1"></div>
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-radial from-emerald-400/50 via-emerald-500/40 to-transparent rounded-full animate-pulse-orb-2"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-gradient-radial from-emerald-200/30 via-emerald-300/25 to-transparent rounded-full animate-pulse-orb-3"></div>

        {/* Elegant Wave Elements */}
        <div className="absolute top-1/3 left-0 w-full h-20 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent animate-wave-flow-1"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-16 bg-gradient-to-l from-transparent via-emerald-300/20 to-transparent animate-wave-flow-2"></div>

        {/* Elegant Floating Particles */}
        <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-emerald-300/60 rounded-full animate-particle-1"></div>
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-emerald-400/70 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-emerald-200/50 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-particle-4"></div>
        <div className="absolute bottom-0 right-1/3 w-2.5 h-2.5 bg-emerald-300/55 rounded-full animate-particle-5"></div>

        {/* Elegant Flow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/8 via-emerald-400/12 via-emerald-500/10 via-emerald-600/8 to-transparent animate-rainbow-flow"></div>
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm"></div>

      {/* Login Form */}
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-emerald-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border-3 border-white/80 p-2">
              <img
                src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/refs/heads/main/logoAmb.png"
                alt="División Ambiental Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent mb-2">División Ambiental</h1>
            <p className="text-gray-600 text-sm">Ingresa tus credenciales para acceder</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-emerald-200 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-600" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 border-2 border-emerald-200 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-emerald-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-emerald-200">
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;