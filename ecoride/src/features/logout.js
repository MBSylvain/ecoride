import axios from "axios";

const logout = async () => {
  try {
    await axios.post("https://api-ecride-production.up.railway.app/Controllers/checkAuth.php", {}, { withCredentials: true });
    localStorage.removeItem("user_info"); // Supprime les données locales si nécessaire
    localStorage.removeItem("utilisateur_id");
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err);
  }
};

export default logout;