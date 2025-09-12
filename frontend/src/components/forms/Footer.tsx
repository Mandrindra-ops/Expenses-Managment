import React from 'react';

interface FooterProps {

}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-100 py-6 text-center">
      <p className="text-base text-gray-500">&copy; 2025 Expense Tracker. All rights reserved.</p>
    </footer>
  );
};

export default Footer;