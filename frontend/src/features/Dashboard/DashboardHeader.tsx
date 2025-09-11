import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  username?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  setSidebarOpen,
  username,
}) => {
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
      <div className="flex flex-col flex-3 px-4">
        <p className="text-2xl self-start text-[var(--color-text)] font-bold">
          Hi{" "}
          <span className="text-[var(--color-primary)] capitalize">
            {username},
          </span>
          <span className="text-md text-[var(--color-text-sub)] font-medium">
            welcome to your dashboard.
          </span>
        </p>
        <p className="text-sm self-start text-[var(--color-text)] font-medium">
          Here’s a quick overview of your data.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative inline-block rounded-full p-[5px] animate-border-gradient">
          {/* Inner toggle switch */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-6 flex items-center bg-[var(--color-bg-card)] rounded-full p-1 cursor-pointer shadow-md transition"
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md transform transition-all duration-300 
                        ${
                          darkMode
                            ? "translate-x-6 bg-[var(--color-secondary)]"
                            : "translate-x-0 bg-[var(--color-primary)]"
                        }`}
            />
          </div>
        </div>

        <p className="ml-3 text-sm text-[var(--color-text)]">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </p>

        <button className=" flex text-[var(--color-text-sub)] items-center focus:outline-none">
          {/* cloche de notif */}
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="mr-5 flex items-center border rounded-3xl border-gray-300">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
            {username ? username[0].toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
