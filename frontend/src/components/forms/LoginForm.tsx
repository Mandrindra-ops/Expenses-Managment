import { AiFillHome } from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '../../store';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react'; // Importer les icônes de Lucide React

interface LoginFormProps {
    mode: 'login' | 'signup';
}

type AccountForm = {
    email: string;
    password: string;
    confirmPassword?: string;
};

const PASSWORD_RULE = {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Mot de passe trop faible',
};

export default function LoginForm({ mode }: LoginFormProps) {
    const [isLoginMode, setIsLoginMode] = useState(mode === 'login');
    const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // État pour afficher/masquer le mot de passe de confirmation
    const navigate = useNavigate();
    const { loginUser, registerUser } = useAccountStore();

    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = useForm<AccountForm>();

    const password = watch('password');

    const toggleMode = (target: 'login' | 'signup') => {
        setIsLoginMode(target === 'login');
        navigate(`/${target}`);
    };

    const togglePasswordVisibility = () => {
        console.log('Toggling password visibility:', !showPassword); // Pour débogage
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        console.log('Toggling confirm password visibility:', !showConfirmPassword); // Pour débogage
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit: SubmitHandler<AccountForm> = async ({ email, password }) => {
        try {
            if (isLoginMode) {
                await loginUser(email, password);
                navigate('/dashboard');
            } else {
                await registerUser({ email, password });
                navigate('/login');
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error({ message: err.message });
            }
        }
    };

    const inputBase =
        'w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400 transition-all';

    return (
        <div className="relative flex w-full min-h-screen items-center justify-center bg-gradient-to-b from-green-300 to-green-200 px-4">
            <a href="/" className="absolute p-2 rounded-full top-4 left-4">
                <AiFillHome className="h-7 w-7 text-white" />
            </a>

            <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="mb-4 text-3xl font-semibold text-center text-[#008080]">
                    {isLoginMode ? 'Login' : 'Sign up'}
                </h2>

                {/* Toggle buttons */}
                <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
                    {(['login', 'signup'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggleMode(type)}
                            className={`w-1/2 text-lg font-medium z-10 transition-all ${(type === 'login' ? isLoginMode : !isLoginMode)
                                    ? 'text-white'
                                    : 'text-[#10B981] cursor-pointer'
                                }`}
                        >
                            {type === 'login' ? 'Log in' : 'Sign up'}
                        </button>
                    ))}
                    <div
                        className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-[#008080] via-[#10B981] to-[#008080] transition-all duration-500 ease-in-out ${isLoginMode ? 'left-0' : 'left-1/2'
                            }`}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                    <input
                        {...register('email', {
                            required: 'Email requis',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' },
                        })}
                        type="email"
                        placeholder="Email Address"
                        className={inputBase}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    <div className="relative">
                        <input
                            {...register('password', {
                                required: 'Mot de passe requis',
                                pattern: PASSWORD_RULE,
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className={`${inputBase} pr-12`} // Espace pour l'icône
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 z-50"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-black" />
                            ) : (
                                <Eye className="h-5 w-5 text-black" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    {!isLoginMode && (
                        <>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword', {
                                        validate: (v) => v === password || 'Les mots de passe ne correspondent pas',
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    className={`${inputBase} pr-12`} // Espace pour l'icône
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 z-50"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-black" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-black" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full p-3 bg-gradient-to-r from-[#008080] via-[#10B981] to-[#008080] text-white rounded-full text-lg font-medium hover:opacity-90 transition-all"
                    >
                        {isLoginMode ? 'Login' : 'Sign up'}
                    </button>
                </form>
            </div>
        </div>
    );
}