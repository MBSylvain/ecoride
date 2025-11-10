import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecoride-sylvains-projects-15c39aad.vercel.app/Controllers/",
  // Vous pouvez ajouter ici des headers ou d'autres options si besoin
});

export default axiosInstance;
