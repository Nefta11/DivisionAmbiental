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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center px-8">
          {/* Create Button */}
          <button
            onClick={handleCreateReport}
            className="inline-flex items-center space-x-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-700 text-white font-bold px-12 py-6 rounded-3xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-300/50 group border border-white/20 backdrop-blur-sm text-xl"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
            <span>Crear Nuevo Reporte</span>
          </button>
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