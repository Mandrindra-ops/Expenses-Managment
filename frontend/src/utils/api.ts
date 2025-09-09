import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const accountStorage = localStorage.getItem("account-storage");
  if (accountStorage) {
    try {
      const parsed = JSON.parse(accountStorage);
      const token = parsed?.state?.token?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token ajouté au header:", token);
      } else {
        console.warn("Aucun token trouvé dans account-storage");
      }
    } catch (e) {
      console.error("Erreur parsing account-storage:", e);
    }
  } else {
    console.warn("Clé 'account-storage' introuvable dans localStorage");
  }
  return config;
});


export default api;
