import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function LoginForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLoginMode, setIsLoginMode] = useState(mode !== 'signup');

  useEffect(() => {
    setIsLoginMode(mode !== 'signup');
  }, [mode]);

  const toggleMode = (newMode: boolean) => {
    setIsLoginMode(newMode);
    setSearchParams({ mode: newMode ? 'login' : 'signup' });
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-b from-cyan-200 via-cyan-300 to-blue-200 px-4">
    <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center">
          {isLoginMode ? 'Login' : 'Sign up'}
        </h2>
      </div>

      <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
        <button
          onClick={() => toggleMode(true)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${
            isLoginMode ? 'text-white' : 'text-black'
          }`}
        >
          Log in
        </button>
        <button
          onClick={() => toggleMode(false)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${
            !isLoginMode ? 'text-white' : 'text-black'
          }`}
        >
          Sign up
        </button>
        <div
          className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 transition-all duration-500 ease-in-out ${
            isLoginMode ? 'left-0' : 'left-1/2'
          }`}
        />
      </div>

      <form className="space-y-4">
        {!isLoginMode && (
          <input
            type="text"
            name="username"
            placeholder="Your name"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
        />
        {!isLoginMode && (
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
          />
        )}
        <button
          className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition"
        >
          {isLoginMode ? 'Login' : 'Sign up'}
        </button>

        <p className="text-center text-gray-600">
          {isLoginMode ? "Don't have an account" : 'Already have an account'}
          <button
            type="button"
            onClick={() => toggleMode(!isLoginMode)}
            className="text-cyan-600 hover:underline ml-1"
          >
            {isLoginMode ? 'Sign up now' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
    </div>
  );
}