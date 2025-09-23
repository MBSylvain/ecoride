import axios from "axios";

const checkAuth = async () => {
  try {
    const response = await axios.get("http://localhost/api/Controllers/checkAuth.php", {
      headers: { "Content-Type": "application/json" },
        withCredentials: true, // Nécessaire pour envoyer les cookies de session
    });

    return response.data.isAuthenticated; // Retourne true si l'utilisateur est authentifié
  } catch (err) {
    console.error("Erreur lors de la vérification de l'authentification :", err);
    return false; // Retourne false en cas d'erreur
  }
};

export default checkAuth;