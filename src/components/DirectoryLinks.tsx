import React from 'react';
import { Link } from 'lucide-react';

const DirectoryLinks: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-5rem)] bg-white">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center px-8 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl border-2 border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-200">
                    <Link className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-6 tracking-wide">
                    Directorio de Enlaces
                </h1>
                <p className="text-gray-700 text-2xl leading-relaxed font-medium max-w-2xl">
                    Enlaces útiles a dependencias ambientales y servicios relacionados
                </p>
            </div>
        </div>
    );
};

export default DirectoryLinks;
