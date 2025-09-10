import { useCallback } from "react";
import { useAuth } from "./useAuth";


export const useAccount = () => {
  const { account , setAccount ,authenticated} = useAuth();
    const getUser = useCallback(async ()=>(await authenticated()),[authenticated])
    const user = getUser()
if(!user){
        throw new Error(" error in useAccount ")
    }
  return { account ,updateInfoUser: setAccount };
};
