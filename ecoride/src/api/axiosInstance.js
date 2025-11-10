import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-ecride-production.up.railway.app/api/Controllers/",
  // Vous pouvez ajouter ici des headers ou d'autres options si besoin
});

export default axiosInstance;
