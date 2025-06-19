import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeItem, onItemClick, onLogout }) => {
  const handleLogoClick = () => {
    onItemClick('reportes');
  };

  const handleSidebarItemClick = (item: string) => {
    console.log('Layout handleSidebarItemClick:', item); // Para debug
    onItemClick(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 overflow-hidden">
      <Header onLogout={onLogout} onLogoClick={handleLogoClick} />
      <div className="flex">
        <Sidebar activeItem={activeItem} onItemClick={handleSidebarItemClick} />
        <main className="flex-1 p-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;