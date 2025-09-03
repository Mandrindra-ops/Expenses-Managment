import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

const API_URL = 'http://localhost:3000/api'; // Ajustez selon votre configuration

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      login: async (credentials: LoginCredentials) => {
        console.log("Attempting login with credentials:", credentials);
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Une erreur est survenue lors de la connexion');
          }

          const data = await response.json();
          
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            error: null,
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Une erreur est survenue',
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      signUp: async (credentials: SignUpCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Une erreur est survenue lors de l\'inscription');
          }

          const data = await response.json();
          
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            error: null,
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Une erreur est survenue',
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);