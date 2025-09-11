import axios from "axios";
import { useAccountStore } from "../store"
const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = useAccountStore.getState().token;
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});
export default api;
