import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">EcoRide</div>
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
          <ul className="lg:flex lg:space-x-4 flex flex-col lg:flex-row">
            <li>
              <Link to="/" className="block text-white py-2 px-4">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="block text-white py-2 px-4">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/login" className="block text-white py-2 px-4">
                Se connecter
              </Link>
            </li>
            <li>
              <Link to="/register" className="block text-white py-2 px-4">
                Créer un compte
              </Link>
            </li>
            <li>
              <Link to="/search" className="block text-white py-2 px-4">
                Recherche un trajet
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block text-white py-2 px-4">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/helpcenter" className="block text-white py-2 px-4">
                Aide
              </Link>
            </li>
            <li>
              <Link to="/privaty" className="block text-white py-2 px-4">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="block text-white py-2 px-4">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboardupdate" className="block text-white py-2 px-4">
                Dashboard Update
              </Link>
            </li>
            <li>
              <Link
                to="/dashboradtrajet"
                className="block text-white py-2 px-4"
              >
                Dashboard Trajet
              </Link>
            </li>
            <li>
              <Link to="/dashcarupdate" className="block text-white py-2 px-4">
                Dashboard Voiture
              </Link>
            </li>
            <li>
              <Link to="/dashreservation" className="block text-white py-2 px-4">
                Dashboard Réservation
              </Link>
            </li>
            <li>
              <Link to="/documents" className="block text-white py-2 px-4">
                Documents
              </Link>
            </li>
            <li>
              <Link to="/error404" className="block text-white py-2 px-4">
                Erreur 404
              </Link>
            </li>
            <li>
              <Link to="/error500" className="block text-white py-2 px-4">
                Erreur 500
              </Link>
            </li>
            <li>
              <Link to="/InfoVéhicule" className="block text-white py-2 px-4">
                Info Véhicule
              </Link>
            </li>
            <li>
              <Link
                to="/preferenceProfil"
                className="block text-white py-2 px-4"
              >
                Préférences Profil
              </Link>
            </li>
            <li>
              <Link to="/profil" className="block text-white py-2 px-4">
                Profil
              </Link>
            </li>
            <li>
              <Link to="/reservetrajet" className="block text-white py-2 px-4">
                Réserver un trajet
              </Link>
            </li>
            <li>
              <Link to="/testapi" className="block text-white py-2 px-4">
                Test API
              </Link>
            </li>
            <li>
              <Link
                to="/TrajetsDisponibles"
                className="block text-white py-2 px-4"
              >
                Trajets Disponibles
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
