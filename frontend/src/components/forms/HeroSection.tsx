import React from 'react';

interface HeroSectionProps {
  totalTracked: string; 
}

const HeroSection: React.FC<HeroSectionProps> = ({ totalTracked }) => {
  return (
    <section className="w-full min-h-[60vh] py-10 md:py-14 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center gap-3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-snug">
            Track Your Expenses<br />Effortlessly
          </h1>
          <p className="text-base text-gray-600">
            Take control of your finances with Expense Tracker, the easiest way to manage your
            expenses and achieve your financial goals.
          </p>
        </div>
        <div className="relative">
          <img
            src='/images/hero-video.gif'
            alt="Animated illustration of a person working on a laptop"
            className="w-full rounded-lg"
          />
          <div
            className="bg-white p-3 rounded-md shadow-md absolute bottom-3 right-3"
            aria-label="Total expenses tracked"
          >
            <span className="text-lg font-bold text-gray-900">{totalTracked}</span>
            <p className="text-sm text-gray-500">Tracked this year</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
