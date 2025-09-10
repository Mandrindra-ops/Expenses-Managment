import { AiFillHome } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  mode: 'login' | 'signup';
}

export default function LoginForm({ mode }: LoginFormProps) {
  const isLoginModeInitial = mode === 'login';
  const [isLoginMode, setIsLoginMode] = useState(isLoginModeInitial);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoginMode(mode === 'login');
  }, [mode]);

  const toggleMode = (newMode: boolean) => {
    if (newMode) navigate('/login');
    else navigate('/signup');
  };

  const handleSubmit = (data: FormData) => {
    const email = data.get('email');
    const password = data.get('password');
    console.log('Email:', email);
    console.log('Password:', password);
    if (email === "admin@gmail.com" && password === "1234") {
      return navigate("/dashboard");
    }
  };

  return (
    <div className="relative flex w-full min-h-screen items-center justify-center bg-gradient-to-b from-green-300 to-green-200 px-4">
      <a href="/" className='absolute p-2 rounded-full top-4 left-4 cursor-pointer'>
        <AiFillHome className="h-7 w-7 text-white" />
      </a>

      <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
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

        <form action={handleSubmit} className="space-y-4 flex flex-col justify-between">
          {!isLoginMode && (
            <input
              type="text"
              name="username"
              placeholder="Your name"
              required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400 transition-all"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400 transition-all"
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </span>
          </div>
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
            className="w-full p-3 bg-gradient-to-r from-[#008080] via-[#10B981] to-[#008080] text-white rounded-full text-lg font-medium hover:opacity-90 transition-all cursor-pointer"
          >
            {isLoginMode ? 'Login' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}
