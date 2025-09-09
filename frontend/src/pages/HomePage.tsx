import React from 'react';
import Navbar from '../components/forms/Navbar';
import HeroSection from '../components/forms/HeroSection';
import Footer from '../components/forms/Footer';

const HomePage: React.FC = () => {
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
