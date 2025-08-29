import React from 'react';

interface FooterProps {

}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-100 py-6 text-center">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Simplify Your Finances with Ease
        </h2>
        <p className="text-base md:text-lg text-gray-600">
          Manage your expenses efficiently, track your spending, and achieve your financial goals with minimal effort.
        </p>
      </div>
      <p className="text-base text-gray-500">&copy; 2025 Expense Tracker. All rights reserved.</p>
    </footer>
  );
};

export default Footer;