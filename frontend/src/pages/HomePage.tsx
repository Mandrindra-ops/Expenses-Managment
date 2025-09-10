import React from 'react';
import Navbar from '../components/forms/Navbar';
import HeroSection from '../components/forms/HeroSection';
import Footer from '../components/forms/Footer';
import { useAccountStore } from '../store';
import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const authStatus = useAccountStore(state => state.status)

    if (authStatus == "pending") return <div>Loading...</div>
    if (authStatus == "authorized") return <Navigate to="/dashboard" />

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">

            <div className=" w-full">
                <Navbar />
            </div>
            <HeroSection totalTracked="$134M" />
            <Footer />
        </div>
    );
};

export default HomePage;
