import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Important : doit être présent */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;