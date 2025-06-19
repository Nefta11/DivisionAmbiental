import React from 'react';
import { FileText, Plus, Sparkles } from 'lucide-react';
import CreateReportForm from './CreateReportForm';

interface DashboardProps {
  onCreateReport: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateReport }) => {
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const handleCreateReport = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleSubmitReport = (data: any) => {
    onCreateReport(data);
    setShowCreateForm(false);
  };

  return (
    <>
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
        
        {/* Create Report Section */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center px-8 relative z-10">
          {/* Main Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border-2 border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-300 relative">
            <FileText className="w-12 h-12 text-white drop-shadow-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Title and Description */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-4 tracking-wide">
            Centro de Creación de Reportes
          </h2>
          
          {/* Create Button */}
          <div className="space-y-4 mt-8">
            <button
              onClick={handleCreateReport}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-300/50 group border border-white/20 backdrop-blur-sm text-lg"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>Crear Nuevo Reporte</span>
              <Sparkles className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            
            <p className="text-gray-600 text-sm">
              Los reportes creados aparecerán en la sección "Mis Reportes"
            </p>
          </div>
        </div>
      </div>

      {/* Create Report Form Modal */}
      {showCreateForm && (
        <CreateReportForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitReport}
        />
      )}
    </>
  );
};

export default Dashboard;