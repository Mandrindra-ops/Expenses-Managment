import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />
        
        {/* Main content - Utilise Outlet pour les routes enfants */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Les routes enfants s'affichent ici */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;