import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeItem, onItemClick, onLogout, title }) => {
  const handleLogoClick = () => {
    onItemClick('reportes');
  };

  const handleSidebarItemClick = (item: string) => {
    console.log('Layout handleSidebarItemClick:', item); // Para debug
    onItemClick(item);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header onLogout={onLogout} onLogoClick={handleLogoClick} title={title} />
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