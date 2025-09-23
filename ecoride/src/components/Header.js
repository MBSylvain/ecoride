import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import checkAuth from "../features/checkAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    };
    verifyAuth();
  }, []);
    
  return (
    <nav className="p-4 bg-primary-100">
      <div className="container flex items-center justify-between mx-auto">
        <div className="text-lg font-bold text-white">EcoRide</div>
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
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
            <li>
              <Link to="/" className="block px-4 py-2 text-white">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="block px-4 py-2 text-white">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/login" className="block px-4 py-2 text-white">
                Se connecter
              </Link>
            </li>
            <li>
              <Link to="/register" className="block px-4 py-2 text-white">
                Créer un compte
              </Link>
            </li>
            <li>
              <Link to="/search" className="block px-4 py-2 text-white">
                Recherche un trajet
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block px-4 py-2 text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/helpcenter" className="block px-4 py-2 text-white">
                Aide
              </Link>
            </li>
            <li>
              <Link to="/privaty" className="block px-4 py-2 text-white">
                Confidentialité
              </Link>
            </li>

            {/* Liens visibles uniquement si l'utilisateur est connecté */}
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard" className="block px-4 py-2 text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboardupdate"
                    className="block px-4 py-2 text-white"
                  >
                    Dashboard Update
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboradtrajet"
                    className="block px-4 py-2 text-white"
                  >
                    Dashboard Trajet
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashcarupdate"
                    className="block px-4 py-2 text-white"
                  >
                    Dashboard Voiture
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashreservation"
                    className="block px-4 py-2 text-white"
                  >
                    Dashboard Réservation
                  </Link>
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