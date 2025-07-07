import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TEMPORAL: Login automático sin validación de credenciales
    try {
      let mockUser;
      
      // Verificar si es uno de los usuarios RIR
      if (email === "rir.oriente" || email === "RIR Oriente") {
        mockUser = {
          id: "rir_oriente",
          username: "Polo Oriente",
          email: "rir.oriente@pvsnl.gob.mx",
          role: "rir",
          nombre: "Polo Oriente",
          region: "oriente"
        };
      } else if (email === "rir.poniente" || email === "RIR Poniente") {
        mockUser = {
          id: "rir_poniente",
          username: "Polo Poniente", 
          email: "rir.poniente@pvsnl.gob.mx",
          role: "rir",
          nombre: "Polo Poniente",
          region: "poniente"
        };
      } else {
        mockUser = {
          id: "1",
          username: email || "usuario@demo.com",
          email: email || "usuario@demo.com",
          role: "admin",
          nombre: "Usuario Demo"
        };
      }

      const mockToken = "demo-token-" + Date.now();

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      onLoginSuccess(mockUser);
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Elegant Light Beams */}
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-transparent via-orange-300/40 to-transparent animate-beam-1 opacity-60"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-orange-400/50 to-transparent animate-beam-2 opacity-70"></div>
        <div className="absolute top-0 left-2/3 w-3 h-full bg-gradient-to-b from-transparent via-orange-200/30 to-transparent animate-beam-3 opacity-50"></div>

        {/* Elegant Light Streaks */}
        <div className="absolute top-1/4 -left-20 w-96 h-1 bg-gradient-to-r from-transparent via-orange-300/60 to-transparent animate-streak-1"></div>
        <div className="absolute top-2/3 -right-20 w-80 h-0.5 bg-gradient-to-l from-transparent via-orange-400/70 to-transparent animate-streak-2"></div>
        <div className="absolute top-1/2 -left-32 w-72 h-2 bg-gradient-to-r from-transparent via-orange-200/50 to-transparent animate-streak-3"></div>

        {/* Elegant Energy Orbs */}
        <div className="absolute top-1/6 left-1/5 w-32 h-32 bg-gradient-radial from-orange-300/40 via-orange-400/30 to-transparent rounded-full animate-pulse-orb-1"></div>
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-radial from-orange-400/50 via-orange-500/40 to-transparent rounded-full animate-pulse-orb-2"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-gradient-radial from-orange-200/30 via-orange-300/25 to-transparent rounded-full animate-pulse-orb-3"></div>

        {/* Elegant Wave Elements */}
        <div className="absolute top-1/3 left-0 w-full h-20 bg-gradient-to-r from-transparent via-orange-400/15 to-transparent animate-wave-flow-1"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-16 bg-gradient-to-l from-transparent via-orange-300/20 to-transparent animate-wave-flow-2"></div>

        {/* Elegant Floating Particles */}
        <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-orange-300/60 rounded-full animate-particle-1"></div>
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-orange-400/70 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-orange-200/50 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 bg-orange-500/60 rounded-full animate-particle-4"></div>
        <div className="absolute bottom-0 right-1/3 w-2.5 h-2.5 bg-orange-300/55 rounded-full animate-particle-5"></div>

        {/* Elegant Flow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/8 via-orange-400/12 via-orange-500/10 via-orange-600/8 to-transparent animate-rainbow-flow"></div>
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-orange-900/20 backdrop-blur-sm"></div>

      {/* Login Form */}
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-orange-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="w-96 h-64  flex items-center justify-center  p-2">
              <img
                src="/assets/ParquesVidaSilvestre-01.png"
                alt="Parques y Vida Silvestre de Nuevo León"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 block"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-orange-600" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 relative z-0"
                  placeholder="Usuario"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 block"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 border-2 border-orange-200 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 relative z-0"
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 z-10"
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
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-orange-200">
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>admin / admin123</p>
              <p>rir.oriente / oriente123</p>
              <p>rir.poniente / poniente123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;