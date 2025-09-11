import { useState, useEffect, useRef } from "react";
import type { User } from "../../types";
import { Bell } from "lucide-react";
import api from "../../utils/api"

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  username?: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setSidebarOpen, username }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<{ message: string }[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const root: HTMLElement = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

    const lastAlertDiffRef = useRef<number | null>(null);

  useEffect(() => {
        const fetchAlerts = async () => {

            const res = await api.get("/summary/alerts");
            const alertData = res.data;

            if (alertData.alert) {
                const currentDiff = alertData.totalExpenses - alertData.totalIncomes;

                if (lastAlertDiffRef.current === null || currentDiff !== lastAlertDiffRef.current) {
                    setNotifications(prev => [...prev, { message: alertData.message }]);
                    setUnreadCount(prev => prev + 1);
                    lastAlertDiffRef.current = currentDiff;
                }
                
            }
        };

        fetchAlerts();

        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

  return (
    <header className="flex items-center justify-between h-18 bg-[var(--color-bg-card)] border-b border-gray-200">
        <div className="flex items-center">
            <button
                className="text-[var(--color-text-sub)] hover:text-[var(--color-text)] lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
                ></path>
            </svg>
            </button>
        </div>

        <div className="flex items-center gap-6">
            <div className="relative inline-block rounded-full p-[5px] animate-border-gradient">
                {/* Inner toggle switch */}
                <div
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-12 h-6 flex items-center bg-[var(--color-bg-card)] rounded-full p-1 cursor-pointer shadow-md transition"
                >
                    <div
                    className={`w-4 h-4 rounded-full shadow-md transform transition-all duration-300 
                    ${darkMode ? "translate-x-6 bg-[var(--color-secondary)]" : "translate-x-0 bg-[var(--color-primary)]"}`}
                    />
                </div>
            </div>

            <p className="ml-3 text-sm text-[var(--color-text)]">
                {darkMode ? "Dark Mode" : "Light Mode"}
            </p>

            <div className="relative">
                <button
                    className="flex text-[var(--color-text-sub)] items-center focus:outline-none"
                    onClick={() => {
                        setShowDropdown(!showDropdown);
                        if (!showDropdown) setUnreadCount(0);
                    }}
                >
                    <Bell className="w-7 h-7" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 z-50">
                        <div className="p-2">
                            {notifications.length === 0 ? (
                                <p className="text-sm text-gray-500">No notifications</p>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 border-b last:border-b-0 py-1 px-2">
                                        {notif.message}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mr-5 flex items-center border rounded-3xl border-gray-300">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
            </div>
        </div>
        
    </header>
    );

};

export default DashboardHeader;
