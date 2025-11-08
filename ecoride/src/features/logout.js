import axiosInstance from "../api/axiosInstance";

const logout = async () => {
  try {
    await axiosInstance.post("checkAuth.php", {}, { withCredentials: true });
    localStorage.removeItem("user_info"); // Supprime les données locales si nécessaire
    localStorage.removeItem("utilisateur_id");
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err);
  }
};

export default logout;