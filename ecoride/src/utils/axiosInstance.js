import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-ecride-production.up.railway.app/",
  timeout: 10000,
  withCredentials: true, // Important pour les sessions PHP
});

// Gestion centralisée des erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Non authentifié - Redirection vers login");
      // window.location.href = "/login";
    }
    console.error("Erreur API:", error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;