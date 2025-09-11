import { Link } from 'react-router-dom';
import logo from '../../../public/logo.png'

const Navbar: React.FC = () => {
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
};

export default Navbar;
