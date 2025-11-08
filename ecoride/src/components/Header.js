import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        'checkAuth.php', 
        { action: 'logout' },
        { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
      );
    } catch (error) {
      console.log('Déconnexion API échouée');
    } finally {
      logout();
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

  return (
    <nav className="p-4 font-sans shadow bg-primary-100">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white transition-colors hover:text-customGreen2-100" onClick={closeMenu}>
          {/* Remplace par ton logo si besoin */}
          {/* <img src="/logoecoblanc.png" alt="EcoRide" className="w-8 h-8 rounded shadow" /> */}
          EcoRide
        </Link>
        {/* Menu mobile */}
        <div className="block lg:hidden">
          <button aria-label="Ouvrir le menu" onClick={() => setIsOpen(!isOpen)} className="p-1 text-white transition-colors rounded hover:text-customGreen2-100">
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
                <Link
                  to={link.to}
                  className="block px-4 py-2 font-semibold text-white transition-colors rounded hover:bg-customGreen2-100"
                  onClick={closeMenu}
                >
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
                  <Link to="/login" className="block px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md hover:bg-customPink-100">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100">
                    Créer un compte
                  </Link>
                </li>
              </>
            )}
            {!isLoading && isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard" className="block px-4 py-2 font-semibold text-white transition-colors rounded hover:bg-customGreen2-100">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <span className="block px-4 py-2 font-semibold text-white">
                    👋 {user?.name || user?.email || 'Utilisateur'}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 font-bold text-left text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
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