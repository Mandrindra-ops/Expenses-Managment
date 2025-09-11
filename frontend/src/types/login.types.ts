
export type LoginResponse = {
  username: string;
  token: string;
}

export type RegisterUser = {
  email: string;
  password: string;
}
export interface User {
  username: string;
}
export type AuthStatus = "authorized" | "unauthorized" | "pending";
