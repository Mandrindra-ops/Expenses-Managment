import {create} from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  dark: boolean;
  setDark: (d: boolean) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: false,
      setDark: (d: boolean) => set({ dark: d }),
      toggle: () => set((s) => ({ dark: !s.dark })),
    }),
    {
      name: 'user-theme', // clé localStorage
      storage: {
        getItem: (key) => {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
