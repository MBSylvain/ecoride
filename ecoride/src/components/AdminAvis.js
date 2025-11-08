import axiosInstance from "../api/axiosInstance";

// supprimez : import axios from "axios";

// Remplacez tous les appels axios par axiosInstance :
axiosInstance.get("Administrateur/AvisAdminController.php")
axiosInstance.post("Administrateur/AvisAdminController.php", data)
axiosInstance.put("Administrateur/AvisAdminController.php", data)
axiosInstance.delete("Administrateur/AvisAdminController.php?id=...")