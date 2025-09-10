import { useState, useEffect } from "react";
import type { User } from "../../types";

interface DashboardHeaderProps {
    setSidebarOpen: (open: boolean) => void;
    username?: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setSidebarOpen, username }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const root: HTMLElement = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [darkMode]);


    return (
        <header className="flex items-center justify-between h-18 bg-[var(--color-bg-card)] border-b border-gray-200">
            <h2 className="text-2xl text-emerald-400 font-bold">{JSON.stringify(username) ?? "User"}</h2>
            <div className="flex items-center">
                <button
                    className="text-[var(--color-text-sub)] hover:text-[var(--color-text)] lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="
                        px-4 py-2 rounded-lg shadow-md
                        bg-[var(--color-primary)] text-white
                        hover:brightness-90 transition text-sm
                    "
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

                <button className="flex text-[var(--color-text-sub)] items-center focus:outline-none">
                    {/* cloche de notif */}
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="relative">
                    <button className="relative flex items-center focus:outline-none">
                        <img
                            className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]"
                            src="https://via.placeholder.com/40"
                            alt="User"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
