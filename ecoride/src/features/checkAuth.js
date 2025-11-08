import axiosInstance from "../api/axiosInstance";



const checkAuth = async () => {
  try {
    const response = await axiosInstance.get("checkAuth.php", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    

    if (response.data.isAuthenticated) {
      // Stockage des informations de session dans le localStorage
      localStorage.setItem("utilisateur_id", response.data.utilisateur_id);
      localStorage.setItem("user.email", response.data.email);
      localStorage.setItem("user.role", response.data.role);
      localStorage.setItem("Authenticated", "true");
      
            return true;
    } else {
      localStorage.clear();
      
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de la vérification de l'authentification :", err);
    localStorage.clear();
    return false;
  }
};

export default checkAuth;