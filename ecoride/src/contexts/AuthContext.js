import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est authentifié
  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost/api/Controllers/checkAuth.php", {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.isAuthenticated);
      setUser(response.data.user || null);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification :", error);
      setIsAuthenticated(false);
    }
  };

  // Connexion de l'utilisateur
  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost/api/Controllers/login.php", credentials, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      throw error;
    }
  };

  // Déconnexion de l'utilisateur
  const logout = async () => {
    try {
      await axios.post("http://localhost/api/Controllers/logout.php", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};