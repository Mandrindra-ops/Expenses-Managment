import { useState, useEffect } from "react";

const TestColor: React.FC = () => {
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
    <div
      className="
        min-h-screen flex flex-col items-center justify-center p-6
        bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300
      "
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="
          px-4 py-2 rounded-lg mb-6 shadow-md
          bg-[var(--color-primary)] text-white
          hover:brightness-90 transition
        "
      >
        {darkMode ? "Passer en Light Mode" : "Passer en Dark Mode"}
      </button>

      <div
        className="
          w-full max-w-md p-6 rounded-xl
          bg-[var(--color-bg-card)] shadow-lg
          transition-colors duration-300
        "
      >
        <h1 className="text-2xl font-bold mb-4">Tableau de bord des dépenses</h1>
        <p className="text-[var(--color-expense)] mb-2">- 150€ Dépense</p>
        <p className="text-[var(--color-income)] mb-2">+ 200€ Revenu</p>
        <p className="text-[var(--color-alert)]">⚠ Budget proche</p>
      </div>
    </div>
  );
};

export default TestColor;


