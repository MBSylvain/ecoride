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
          <ul className="lg:flex lg:space-x-4">
            <li>
              <Link to="/" className="block text-white py-2 px-4">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/Search" className="block text-white py-2 px-4">
                Recherche un trajet
              </Link>
            </li>
            <li>
              <Link to="/login" className="block text-white py-2 px-4">
                Se connecter
              </Link>
            </li>
            <li>
              <Link to="/RegisterPage" className="block text-white py-2 px-4">
                Se connecter
              </Link>
            </li>
            <li>
              <Link to="/Aboutus" className="block text-white py-2 px-4">
                A propos de nous
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
