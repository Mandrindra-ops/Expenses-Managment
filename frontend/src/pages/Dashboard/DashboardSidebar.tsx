import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ sidebarOpen, setSidebarOpen }) =>{
    const location = useLocation();
    
    const navigationItems = [
        { name: 'Dashboard', icon: '📊', href: '/' },
        { name: 'Expenses', icon: '💰', href: '/expenses' },
        { name: 'Incomes', icon: '💵', href: '/incomes' },
    ];

    const bottomNavigationItems = [
        { name: 'Profil', icon: '👤', href: '/profile' },
        { name: 'Sign Out', icon: '🚪', href: '/logout' },
    ];

    return (
    <>
      {/* Backdrop pour mobile */}
        {sidebarOpen && (
            <div 
                className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            >
            </div>
        )}

      {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-bg-card)] transform transition-transform duration-300 ease-in-out
            lg:static lg:inset-0 lg:translate-x-0 flex flex-col
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="flex items-center justify-center h-18 bg-[var(--color-primary)]">
                <Link to="/" className="text-xl font-bold text-white">Expenses Tracker</Link>
            </div>
            
            <nav className="mt-8 flex-1">
                <div className="px-4 space-y-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors ${
                                location.pathname === item.href
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white'
                            }`}
                        >
                            <span className="mr-3 text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Section basse avec Profil et Sign Out */}
            <div className="p-4 border-t border-gray-200">
                <div className="space-y-2">
                    {bottomNavigationItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors ${
                                item.name === 'Sign Out' 
                                    ? 'text-[var(--color-expense)] hover:bg-[var(--color-expense)] hover:text-white' 
                                    : 'text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white'
                            }`}
                        >
                            <span className="mr-3 text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    </>
    );
}

export default DashboardSidebar;