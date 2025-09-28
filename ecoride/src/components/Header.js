import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import checkAuth from "../features/checkAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsLoading(true);
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification :", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/api/Controllers/checkAuth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "logout" }),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.removeItem("utilisateur_id");
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
      } else {
        console.error("Erreur lors de la déconnexion :", result.message);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la déconnexion :", error);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="p-4 bg-primary-100">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-lg font-bold text-white" onClick={closeMenu}>
          EcoRide
        </Link>
        
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
        
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full lg:flex lg:items-center lg:w-auto`}
        >
          <ul className="flex flex-col lg:flex lg:space-x-4 lg:flex-row">
            {/* Liens communs */}
            {[
              { to: "/", label: "Accueil" },
              { to: "/aboutus", label: "À propos" },
              { to: "/search", label: "Recherche un trajet" },
              { to: "/contact", label: "Contact" },
              { to: "/helpcenter", label: "Aide" },
              { to: "/privaty", label: "Confidentialité" },
            ].map((link) => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className="block px-4 py-2 text-white transition-colors rounded hover:bg-primary-200"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* État de chargement */}
            {isLoading && (
              <li className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
              </li>
            )}

            {/* Liens pour les utilisateurs non connectés */}
            {!isLoading && !isAuthenticated && (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-white transition-colors rounded hover:bg-primary-200"
                    onClick={closeMenu}
                  >
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="block px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700"
                    onClick={closeMenu}
                  >
                    Créer un compte
                  </Link>
                </li>
              </>
            )}

            {/* Liens pour les utilisateurs connectés */}
            {!isLoading && isAuthenticated && (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-white transition-colors rounded hover:bg-primary-200"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full px-4 py-2 text-left text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;