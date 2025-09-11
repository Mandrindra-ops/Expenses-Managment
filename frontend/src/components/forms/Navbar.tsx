import { Link } from 'react-router-dom';
import logo from '../../../public/logo.png'

const Navbar: React.FC = () => {
    return (
        <nav className="flex items-center justify-between p-2 shadow-sm w-full bg-white">
            <div className="flex items-center gap-1 px-4 ">
                <img src={ logo } width={80} height={80} alt="Expense Tracker Logo" />
                <h1 className="text-2xl font-bold text-green-600 text-gray-900">Expense Tracker</h1>
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
