
import React from 'react';


const HomePage: React.FC = () => {

  const tailwindConfig = `
    :root {
      --primary: #1D4ED8; /* Blue shade for primary buttons and accents */
      --secondary: #F3F4F6; /* Light gray for backgrounds */
      --text-primary: #111827; /* Dark gray for main text */
      --text-secondary: #6B7280; /* Lighter gray for secondary text */
      --accent: #10B981; /* Green for highlights or success states */
    }
  `;

  const styles = `
    <style>
      ${tailwindConfig}
      .btn-primary {
        background-color: var(--primary); /* Primary color for buttons */
        color: white; /* White text for contrast */
        padding: 0.5rem 1rem; /* Consistent padding */
        border-radius: 0.375rem; /* Rounded corners (Tailwind's rounded-md) */
        transition: background-color 0.2s ease-in-out; /* Smooth hover transition */
      }
      .btn-primary:hover {
        background-color: #1E40AF; /* Darker blue on hover */
      }
      .btn-primary:focus {
        outline: 2px solid var(--primary); /* Accessible focus outline */
        outline-offset: 2px; /* Offset for visibility */
      }
      .badge {
        display: flex; /* Flex layout for badge alignment */
        align-items: center; /* Center items vertically */
        gap: 0.5rem; /* Spacing between icon and text */
        background-color: var(--secondary); /* Light gray background */
        padding: 0.5rem 1rem; /* Comfortable padding */
        border-radius: 0.375rem; /* Rounded corners */
      }
      .card-stat {
        background-color: white; /* White background for stat card */
        padding: 1rem; /* Internal padding */
        border-radius: 0.375rem; /* Rounded corners */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        position: absolute; /* Overlay positioning */
        bottom: 1rem; /* Distance from bottom */
        right: 1rem; /* Distance from right */
      }
      .footer {
        background-color: var(--secondary); /* Light gray background */
        padding: 1rem; /* Padding for footer */
        text-align: center; /* Center text */
        color: var(--text-secondary); /* Secondary text color */
      }
    </style>
  `;

 
  const navbar = (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">

      <div className="flex items-center gap-2">
        <svg
          className="w-8 h-8 text-[var(--primary)]"
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
        <span className="text-xl font-bold text-[var(--text-primary)]">
          Expense Tracker
        </span>
      </div>
  
      <div className="flex gap-4">
        <a
          href="/login"
          className="btn-primary"
          tabIndex={0}
          aria-label="Navigate to login page"
        >
          Login
        </a>
        <a
          href="/signup"
          className="btn-primary"
          tabIndex={0}
          aria-label="Navigate to sign up page"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );


  const heroSection = (
    <section className="grid md:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto">
  
      <div className="flex flex-col justify-center gap-6">
    
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
          Track Your Expenses<br />Effortlessly
        </h1>
    
        <p className="text-lg text-[var(--text-secondary)]">
          Take control of your finances with Expense Tracker, the easiest way to manage your
          expenses and achieve your financial goals.
        </p>
      </div>
    
      <div className="relative">
        <video autoPlay loop src="/images/Young man working on laptop animated illustration in GIF, Lottie (JSON), AE.webm"></video>
       
        <div className="card-stat" aria-label="Total expenses tracked">
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            $134M
          </span>
          <p className="text-[var(--text-secondary)]">Tracked this year</p>
        </div>
      </div>
    </section>
  );

 
  const featuresSection = (
    <section className="p-8 bg-[var(--secondary)] text-center">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
        Simplify Your Finances with Ease
      </h2>
    </section>
  );

  const footer = (
    <footer className="footer">
      <p>&copy; 2025 Expense Tracker. All rights reserved.</p>
    </footer>
  );

  
  return (
    
    <div>
     
      <div dangerouslySetInnerHTML={{ __html: styles }} />
     
      {navbar}
      {heroSection}
      {featuresSection}
      {footer}
    </div>
  );
};


export default HomePage;