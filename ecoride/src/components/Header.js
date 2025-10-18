import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost/api/Controllers/checkAuth.php', 
        { action: 'logout' },
        { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
      );
    } catch (error) {
      console.log('Déconnexion API échouée');
    } finally {
      logout(); // Utilise la fonction du contexte
      navigate('/login');
    }
  };

  const closeMenu = () => setIsOpen(false);

  const commonLinks = [
    { to: "/", label: "Accueil" },
    { to: "/aboutus", label: "À propos" },
    { to: "/search", label: "Recherche un trajet" },
    { to: "/contact", label: "Contact" },
    { to: "/helpcenter", label: "Aide" },
    { to: "/privaty", label: "Confidentialité" },
  ];

  console.log("🎯 Header - Auth:", isAuthenticated, "Loading:", isLoading);

  return (
    <nav className="p-4 bg-primary-100">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-lg font-bold text-white" onClick={closeMenu}>
          EcoRide
        </Link>
        
        {/* Menu mobile */}
        <div className="block lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-white rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <div className={`${isOpen ? "block" : "hidden"} w-full lg:flex lg:items-center lg:w-auto`}>
          <ul className="flex flex-col lg:flex lg:space-x-4 lg:flex-row">
            {commonLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="block px-4 py-2 text-white rounded hover:bg-primary-200" onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}

            {isLoading && (
              <li className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
              </li>
            )}

            {!isLoading && !isAuthenticated && (
              <>
                <li>
                  <Link to="/login" className="block px-4 py-2 text-white rounded hover:bg-primary-200">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                    Créer un compte
                  </Link>
                </li>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard" className="block px-4 py-2 text-white rounded hover:bg-primary-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <span className="block px-4 py-2 text-white">
                    👋 {user?.name || user?.email || 'Utilisateur'}
                  </span>
                </li>
                <li>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-white bg-red-500 rounded hover:bg-red-600">
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