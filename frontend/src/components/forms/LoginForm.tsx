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
    <div className="relative flex w-full min-h-screen items-center justify-center bg-gradient-to-b from-green-300  to-green-200 px-4">
    <a href="/" className='absolute p-2 bg-white rounded-full shadow-lg top-4 left-4'>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></a>
    <div className="w-[430px] h-[80vh] bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center text-[#008080]">
          {isLoginMode ? 'Login' : 'Sign up'}
        </h2>
      </div>

      <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
        <button
          onClick={() => toggleMode(true)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${
            isLoginMode ? 'text-white' : 'text-[#10B981] cursor-pointer'
          }`}
        >
          Log in
        </button>
        <button
          onClick={() => toggleMode(false)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${
            !isLoginMode ? 'text-white ' : 'text-[#10B981] cursor-pointer'
          }`}
        >
          Sign up
        </button>
        <div
          className={`absolute top-0 h-full w-1/2 rounded-full cursor-pointer bg-gradient-to-r from-[#008080] via-[#10B981] to-[#008080] transition-all duration-500 ease-in-out ${
            isLoginMode ? 'left-0' : 'left-1/2'
          }`}
        />
      </div>

      <form className=" space-y-4 flex flex-col justify-between">
        {!isLoginMode ? (
          <input
            type="text"
            name="username"
            placeholder="Your name"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400 transition-all"
          />
        ): <div className='w-full p-3 transition-all'></div>}

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
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400 transition-all"
        />        
        {!isLoginMode ? (
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
          />
        ):<div className='w-full p-3 transition-all'></div>}
        <button
          className="w-full p-3 bg-gradient-to-r from-[#008080] via-[#10B981] to-[#008080] text-white rounded-full text-lg font-medium hover:opacity-90 transition-all cursor-pointer"
        >
          {isLoginMode ? 'Login' : 'Sign up'}
        </button>

        <p className="text-center text-gray-600">
          {isLoginMode ? "Don't have an account" : 'Already have an account ? '}
          <button
            type="button"
            onClick={() => toggleMode(!isLoginMode)}
            className="text-[#008080] font-bold hover:underline ml-1 cursor-pointer"
          >
            {isLoginMode ? 'Sign up now' : 'Log in '}
          </button>
        </p>
      </form>
    </div>
    </div>
  );
}