import { useAccountStore } from "../store";
import { apiFetch } from "../utils/apiFetch";

export type Account = {
  id: string;
  email: string;
};
const Unknown = "Unknown";
const Guest = "Guest";
const Authenticated = "Authenticated";

export const useAuth = () => {
  const { account,clear,setAccount,login,authenticated,setToken } = useAccountStore();
  let status = Unknown;
  switch (account) {
    case null:
      status = Guest;
      break;
    case undefined:
      status = Unknown;
      break;
    default:
      status = Authenticated;
      break;
  }
    const signup = async (email: string, password:string) => {
        try{

        await apiFetch("/auth/signup",{method:"POST", json:{ email,password}})
        } catch(err){
            if(err instanceof Error)
                throw new Error({message: err.message})
        }
    }
  return { account, authenticated, status, login, setAccount,clear,setToken, signup };
};
