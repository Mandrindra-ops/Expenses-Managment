import { useAuth } from "./useAuth";

export const useAccount = () => {
  const { account, setAccount } = useAuth();
  if (!account) {
    throw new Error("User is not authenticated");
  }
  return { account, updateInfoUser: setAccount };
};
