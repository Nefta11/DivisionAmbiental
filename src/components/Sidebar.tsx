import React from 'react';
import { FileText, User, MessageSquare, Link, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {

  const menuItems = [
    {
      id: 'reportes',
      label: 'Reportes',
      icon: FileText,
    },
    {
      id: 'mis-reportes',
      label: 'Mis reportes',
      icon: User,
    },
    {
      id: 'mi-dashboard',
      label: 'Mi dashboard',
      icon: BarChart3,
    },
    {
      id: 'directorio-enlaces',
      label: 'Directorio de enlaces',
      icon: Link,
    },
  ];

  const handleItemClick = (itemId: string) => {
    console.log('Sidebar click:', itemId); // Para debug
    onItemClick(itemId);
  };

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-sm shadow-xl border-r border-emerald-100 h-[calc(100vh-5rem)] overflow-hidden">
      <nav className="p-6">
        <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200 border-2 border-emerald-400'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200'
                  }`}
                >
                  <Icon 
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-emerald-600 group-hover:text-emerald-700'
                    }`} 
                  />
                  <span className={`font-semibold text-sm whitespace-nowrap ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;