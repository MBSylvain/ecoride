import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";
const baseURL = isLocalhost
  ? "http://localhost/api/Controllers/"
  : "https://api-ecride-production.up.railway.app/Controllers/";

const axiosInstance = axios.create({
  baseURL,
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