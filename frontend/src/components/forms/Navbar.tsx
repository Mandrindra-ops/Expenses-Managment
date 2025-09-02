import { Link } from 'react-router-dom';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="flex items-center justify-between p-2 bg-white shadow-sm max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Expense Tracker logo"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="text-xl font-bold text-gray-900">Expense Tracker</span>
      </div>
      <div className="flex gap-3">
        <Link
          to="/login?mode=login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline focus:outline-blue-600 focus:outline-offset-2 text-base"
          aria-label="Navigate to login page"
        >
          Login
        </Link>
        <Link
          to="/login?mode=signup"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline focus:outline-green-600 focus:outline-offset-2 text-base"
          aria-label="Navigate to sign up page"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;