import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import DashboardSidebar from '../features/Dashboard/DashboardSidebar';
import DashboardHeader from '../features/Dashboard/DashboardHeader';
import { useAccountStore } from '../store';


const Dashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = useAccountStore((state) => state.user);
    const authStatus = useAccountStore((state) => state.status);

    if (authStatus === "pending") return <div>Cargando...</div>;
    if (authStatus === "unauthorized") return <Navigate to="/login" />;
    return (
        <div className="flex h-screen bg-[var(--color-bg)]">

            <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} username={user} />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet /> {/* Important : doit être présent */}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
