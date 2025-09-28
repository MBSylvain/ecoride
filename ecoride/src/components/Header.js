import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import checkAuth from "../features/checkAuth";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

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

  useEffect(() => {
    // Met à jour la barre de navigation lorsque l'état d'authentification change
    console.log("État d'authentification mis à jour :", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
        console.log('Tentative de déconnexion avec Axios...');
        
        const response = await axios.post('http://localhost/api/Controllers/checkAuth.php', {
            action: 'logout'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // Timeout de 5 secondes
        });

        console.log('Réponse Axios reçue:', response);

        // Avec Axios, les données sont directement dans response.data
        if (response.data.success) {
            // Déconnexion réussie
            setUser(null);
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            setIsAuthenticated(false); // Met à jour l'état d'authentification
            
            // Utilisation de navigate pour rediriger sans recharger la page
            navigate('/login');
        } else {
            throw new Error(response.data.message || 'Déconnexion échouée');
        }

    } catch (error) {
        console.error('Erreur détaillée lors de la déconnexion:', error);
        
        // Gestion spécifique des erreurs Axios
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                alert('La déconnexion a pris trop de temps. Veuillez réessayer.');
            } else if (error.response) {
                // Erreur HTTP avec réponse
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
                alert(`Erreur serveur: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                // Pas de réponse reçue
                alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
            } else {
                // Erreur de configuration
                alert('Erreur de configuration: ' + error.message);
            }
        } else {
            // Erreur non-Axios
            alert('Erreur lors de la déconnexion: ' + error.message);
        }
        
        // Fallback: nettoyage côté client
        setUser(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    }
};

const handleLogin = async (credentials) => {
  try {
    const response = await axios.post("http://localhost/api/Controllers/login.php", credentials, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    if (response.data.success) {
      const userData = response.data.user; // Supposons que l'API renvoie les données utilisateur
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true); // Met à jour l'état d'authentification
      navigate("/dashboard"); // Redirige vers le tableau de bord
    } else {
      alert("Connexion échouée : " + response.data.message);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    alert("Une erreur est survenue lors de la connexion.");
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