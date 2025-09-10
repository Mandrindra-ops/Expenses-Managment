import { Link } from 'react-router-dom';
import { FaDollarSign } from 'react-icons/fa';
interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="flex items-center justify-between p-2 bg-white shadow-sm w-full">
      <div className="flex items-center gap-3 px-4">
        <img src="./public/logo.svg" width={80} height={80} alt="Expense Tracker Logo" />
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
};

export default Navbar;