import React, { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ReportsProvider } from '../contexts/ReportsContext';
import { MessagesProvider } from '../contexts/MessagesContext';

interface AppProvidersProps {
  children: ReactNode;
}

// Componente que envuelve toda la aplicación con los providers necesarios
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ReportsProvider>
        <MessagesProvider>
          {children}
        </MessagesProvider>
      </ReportsProvider>
    </AuthProvider>
  );
};

export default AppProviders;