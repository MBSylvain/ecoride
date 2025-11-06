import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem("Authenticated") === "true";
        const userData = localStorage.getItem("user");
        
        console.log("🔍 AuthContext - Check:", { authStatus, userData });
        
        setIsAuthenticated(authStatus);
        setUser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error("AuthContext - Error:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Petit délai pour stabiliser
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData) => {
    console.log("🔑 AuthContext - Login:", userData);
    localStorage.setItem("Authenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    console.log("🚪 AuthContext - Logout");
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Memoize la valeur pour éviter les re-rendus inutiles
  const value = useMemo(() => ({
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  }), [isAuthenticated, user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};