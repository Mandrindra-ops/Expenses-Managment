import { Link } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";

const Navbar: React.FC = () => {
<<<<<<< HEAD
  return (
    <nav className="flex items-center justify-between p-2 bg-white shadow-sm w-full">
      <div className="flex items-center gap-3 px-4">
        <FaDollarSign className="h-6 w-6 text-green-600" />
        <span className="text-xl font-bold text-gray-900">Expense Tracker</span>
      </div>
      <div className="flex gap-3">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline focus:outline-blue-600 focus:outline-offset-2 text-base"
          aria-label="Navigate to login page"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline focus:outline-green-600 focus:outline-offset-2 text-base"
          aria-label="Navigate to sign up page"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
=======
    return (
        <nav className="flex items-center justify-between px-2 shadow-sm w-full bg-white">
            <div className="flex items-center gap-1 px-4 ">
                <img src={ logo } width={80} height={80} alt="Expense Tracker Logo" />
                <h1 className="text-2xl font-bold text-green-600 text-gray-900">Expense Tracker</h1>
            </div>
            <div className="flex gap-3">
                <Link
                    to="/login"
                    className="px-5 py-2 rounded-xl text-[var(--color-secondary)] font-semibold border-2 transition-all duration-300 hover:text-white hover:bg-[var(--color-secondary)] hover:border-blue-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Navigate to login page"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="px-5 py-2 rounded-xl text-[var(--color-primary-teal)] font-semibold border-2 transition-all duration-300 hover:text-white hover:bg-[var(--color-primary-teal)] hover:border-teal-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                    aria-label="Navigate to sign up page"
                >
                    Sign Up
                </Link>
            </div>

        </nav>
    );
>>>>>>> e979213 (feature: improve desing of each button using color define and add particules)
};

export default Navbar;
