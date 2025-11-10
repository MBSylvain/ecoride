// filepath: c:\Users\mbeum\Documents\Nouveau dossier\ecoride\ecoride\src\utils\authUtils.js
import axiosInstance from "../api/axiosInstance";

export const checkAuth = async () => {
  try {
    const response = await axiosInstance.get(
      "checkAuth.php",
      { withCredentials: true }
    );
    return response.data.authenticated || false;
  } catch (err) {
    console.error("Erreur lors de la vérification de l'authentification:", err);
    return false;
  }
};