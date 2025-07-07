import React from 'react';
import { FileText, Plus } from 'lucide-react';
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
      <div className="min-h-[calc(100vh-5rem)] bg-white">
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