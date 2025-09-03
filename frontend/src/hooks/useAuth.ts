import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    login,
    logout: storeLogout,
    isAuthenticated,
    user,
    error,
    isLoading,
  } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      navigate('/dashboard'); // Rediriger vers le tableau de bord après connexion
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleLogout = () => {
    storeLogout();
    navigate('/login');
  };

  return {
    handleLogin,
    handleLogout,
    isAuthenticated,
    user,
    error,
    isLoading,
  };
};

export default useAuth;