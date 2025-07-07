import React, { useState } from "react";
import { LogOut, User } from "lucide-react";
import logo from "../../public/assets/ParquesVidaSilvestre-03.png"; // Adjust the path as necessary

interface HeaderProps {
  onLogout: () => void;
  onLogoClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onLogoClick, title }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-emerald-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Confirmar cierre de sesión
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                ¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver
                a iniciar sesión para acceder al sistema.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg border-b border-emerald-500/50 backdrop-blur-sm relative overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle floating orbs */}
          <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-radial from-emerald-400/20 via-emerald-500/10 to-transparent rounded-full animate-float-1 blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-radial from-emerald-500/25 via-emerald-600/15 to-transparent rounded-full animate-float-2 blur-lg"></div>
          <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-gradient-radial from-emerald-400/15 via-emerald-500/8 to-transparent rounded-full animate-float-3 blur-xl"></div>

          {/* Gentle wave effects */}
          <div className="absolute top-1/3 left-0 w-full h-8 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-wave-flow-1 blur-sm"></div>
          <div className="absolute bottom-1/3 right-0 w-full h-6 bg-gradient-to-l from-transparent via-emerald-600/15 to-transparent animate-wave-flow-2 blur-sm"></div>

          {/* Soft light beams */}
          <div className="absolute top-0 left-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent animate-beam-1"></div>
          <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-emerald-600/20 to-transparent animate-beam-2"></div>

          {/* Floating particles */}
          <div className="absolute bottom-0 left-1/4 w-1 h-1 bg-emerald-400/30 rounded-full animate-particle-1"></div>
          <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-emerald-500/25 rounded-full animate-particle-3"></div>
        </div>

        {/* Overlay for content readability */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>

        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative z-10">
            {/* Logo Section - Left */}
            <button
              onClick={onLogoClick}
              className="flex items-center group transition-all duration-300 transform hover:scale-110 cursor-pointer"
              title="Ir al Dashboard"
            >
              <div className="w-48 h-48   transition-all duration-300 group-hover:drop-shadow-2xl group-hover:from-emerald-700 group-hover:to-emerald-800 group-hover:border-white group-hover:shadow-2xl group-hover:scale-105 p-2">
                <img
                  src={logo}
                  alt="Parque y Vida Silvestre Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </button>

            {/* Dynamic Title - Center */}
            {title && (
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  {title}
                </h1>
              </div>
            )}

            {/* User Actions - Right */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group border border-white/20 hover:border-white/30 backdrop-blur-sm text-white"
              >
                <LogOut className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-white">
                  Cerrar sesión
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
