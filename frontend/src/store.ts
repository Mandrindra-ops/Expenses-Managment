import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { apiFetch } from "./utils/apiFetch"; // <-- ton helper pour fetch
import api from "./utils/api";

export interface Account {
  id: string;
  email: string;
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
        setAccount: (account: Account | null) => set({ account }),

        clear: () => set({ token: null, account: null }),

        // Vérifie l'utilisateur depuis l'API
        authenticated: async () => {
          try {
            const me = await api<Account>("auth/me");
            set({ account: me.data});
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
        signup : async (email: string, password:string) => {
        try{

        await apiFetch("/auth/signup",{method:"POST", json:{ email,password}})
        } catch{
            set({ token: null, account: null });
            }
    }
      })
    ),
    {
      name: "account-storage",
    }
  )
);
