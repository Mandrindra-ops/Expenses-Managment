import { type StateCreator, create } from "zustand";
import type { AuthStatus, RegisterUser, User } from "./types";
import { devtools, persist } from "zustand/middleware";
import { AuthService } from "./services";

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: string | User;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  registerUser: (data: RegisterUser) => Promise<void>;
}

const storeApi: StateCreator<AuthState> = (set) => ({
  status: "unauthorized",
  token: undefined,
  user: undefined,
  loginUser: async (email: string, password: string) => {
    try {
    const res = await AuthService.login(email, password);
    const token = res.token
    const user = res.username
    console.log(res)
      set({ status: "authorized", token , user });
    } catch {
      set({ status: "unauthorized", token: undefined, user: undefined });
      console.error("Credenciales incorrectas");
    }
  },
   logoutUser: () => {
    set({ status: "unauthorized", token: undefined, user: undefined });
  },
  registerUser: async ({email,password}:{email: string,password: string}) => {
    try {
        await AuthService.registerUser(email,password);

    } catch (error) {
        throw new Error(`${error}`);
    }
  }
});

export const useAccountStore = create<AuthState>()(
  devtools(
    persist(
        storeApi, { name: "auth-storage" }
    ))
);
