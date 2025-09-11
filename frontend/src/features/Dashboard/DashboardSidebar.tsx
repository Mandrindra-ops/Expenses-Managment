import { BanknoteArrowUp, ChartNoAxesCombined, CircleDollarSign, LogOut, UserRound, Boxes } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAccountStore } from '../../store';

interface DashboardSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const logOut = useAccountStore(state => state.logoutUser)
    const navigationItems = [
        { name: 'Dashboard', icon: ChartNoAxesCombined, href: '/dashboard' },
        { name: 'Category', icon: Boxes, href: '/dashboard/categories' },
        { name: 'Expenses', icon: CircleDollarSign, href: '/dashboard/expenses' },
        { name: 'Incomes', icon: BanknoteArrowUp, href: '/dashboard/incomes' },
    ];

    const bottomNavigationItems = [
        { name: 'Profil', icon: UserRound, href: '/dashboard/profile' },
    ];

    const handleLogout = () => {
        logOut()
        localStorage.removeItem("token");
        navigate("/");
    };

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
                                className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors ${location.pathname === item.href
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white'
                                    }`}
                            >
                                <span className="mr-3 text-xl">{<item.icon />}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Section basse avec Profil et Log Out */}
                <div className="p-4 border-t border-gray-200">
                    <div className="space-y-2">
                        {/* Profil reste un Link */}
                        {bottomNavigationItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center px-4 py-2 rounded-lg font-bold transition-colors text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white"
                            >
                                <span className="mr-3 text-xl">{<item.icon />}</span>
                                {item.name}
                            </Link>
                        ))}

                        {/* Bouton Log Out qui ouvre la modal */}
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center w-full px-4 py-2 rounded-lg font-bold transition-colors text-[var(--color-expense)] hover:bg-[var(--color-expense)] hover:text-white"
                        >
                            <span className="mr-3 text-xl"><LogOut /></span>
                            Log Out
                        </button>
                    </div>
                </div>

            </aside>
            {/* Modal de confirmation logout */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
                        <h2 className="text-lg font-bold mb-4">Confirmation</h2>
                        <p className="mb-6">Voulez-vous vraiment vous déconnecter ?</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardSidebar;
