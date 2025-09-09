import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import {jwtDecode} from "jwt-decode";
import { apiFetch } from "./utils/apiFetch"; // <-- ton helper pour fetch

export interface Account {
  id: string;
  email: string;
  role?: string;
}

export interface State {
  token: string | null;
  account: Account | null;
}

export const useAccountStore = create(
  persist(
    combine(
      {
        token: null as string | null,
        account: null as Account | null,
      },
      (set, get) => ({
        setToken: (token: string | null) => {
          if (token) {
            try {
              const decoded: Account = jwtDecode(token);
              set({ token, account: decoded });
            } catch (e) {
              console.error("Token invalide", e);
              set({ token: null, account: null });
            }
          } else {
            set({ token: null, account: null });
          }
        },

        setAccount: (account: Account | null) => set({ account }),

        clear: () => set({ token: null, account: null }),

        // Vérifie l'utilisateur depuis l'API
        authenticated: async () => {
          try {
            const me = await apiFetch<Account>("/me",{method:"GET"});
            set({ account: me });
          } catch {
            set({ account: null });
          }
        },

        // Login avec API, stocke le token et rafraîchit le compte
        login: async (email: string, password: string) => {
          try {
            const { token } = await apiFetch<{ token: string }>("/auth/login", {
              method: "POST",
              json: { email, password },
            });
            set({token, account: get().account})
          } catch {
            set({ token: null, account: null });
          }
        },
      })
    ),
    {
      name: "account-storage",
    }
  )
);
