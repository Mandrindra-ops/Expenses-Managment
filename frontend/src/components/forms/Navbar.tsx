import { Link } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";

const Navbar: React.FC = () => {
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
};

export default Navbar;
