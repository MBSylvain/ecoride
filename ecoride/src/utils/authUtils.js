// filepath: c:\Users\mbeum\Documents\Nouveau dossier\ecoride\ecoride\src\utils\authUtils.js
import axios from "axios";

export const checkAuth = async () => {
  try {
    const response = await axios.get(
      "http://localhost/api/Controllers/CheckAuth.php",
      { withCredentials: true }
    );
    return response.data.authenticated || false;
  } catch (err) {
    console.error("Erreur lors de la vérification de l'authentification:", err);
    return false;
  }
};