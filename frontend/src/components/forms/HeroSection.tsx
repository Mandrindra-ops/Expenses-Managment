import React from "react";
import { Link } from "react-router-dom";

const moneySymbols = ["$", "€", "£", "¥", "₿"];

const gradients = [
  "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
  "linear-gradient(90deg, var(--color-primary-teal), var(--color-secondary-light))",
  "linear-gradient(90deg, #f59e0b, #ef4444)", 
  "linear-gradient(90deg, #06b6d4, #3b82f6)", 
  "linear-gradient(90deg, #10b981, #84cc16)",
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[70vh] h-[80vh] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 money-particles px-4 sm:px-6 lg:px-8">
      {/* Particules */}
        {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const symbol = moneySymbols[Math.floor(Math.random() * moneySymbols.length)];
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 6;
        const delay = Math.random() * 5;
        const gradient =
          gradients[Math.floor(Math.random() * gradients.length)];

        return (
          <span
            key={i}
            className="particle bg-clip-text text-transparent font-extrabold"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              backgroundImage: gradient,
            }}
          >
            {symbol}
          </span>
        );
      })}

    {/* Contenu */}
    <div className="relative z-10 max-w-4xl text-center">
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent py-2"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-primary), var(--color-primary-teal), var(--color-secondary), var(--color-secondary-light))",
        }}
      >
        Track Your Expenses Effortlessly
      </h1>

      <p className="mt-4 text-lg sm:text-xl text-gray-700 leading-relaxed z-10">
        Simplify your finances with ease and take control of your spending.
      </p>
      <p className="mt-2 text-base sm:text-lg text-gray-500 z-10">
        Manage your expenses efficiently, track your spending, and achieve your financial goals with minimal effort.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link to="/signup">
          <button
            className="px-6 py-3 rounded-2xl font-semibold text-white text-xl shadow-lg transform transition-all duration-300"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-primary), var(--color-primary-teal), var(--color-secondary))",
              boxShadow:
                "0 4px 15px rgba(59, 130, 246, 0.3), 0 6px 20px rgba(20, 184, 166, 0.3)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(135deg, var(--color-secondary-light), var(--color-secondary), var(--color-primary))")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(135deg, var(--color-primary), var(--color-primary-teal), var(--color-secondary))")
            }
          >
            Join us
          </button>
        </Link>
      </div>
    </div>
  </section>
  );
};

export default HeroSection;
