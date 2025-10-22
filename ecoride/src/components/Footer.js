import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-8 font-sans text-white bg-primary-100">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col justify-center mx-4 md:flex-row md:mx-10 gap-x-16 gap-y-8">
          <div className="flex justify-center md:justify-start">
            <img
              src="/logoecoblanc.png"
              width={60}
              height={50}
              alt="logo EcoRide"
              className="rounded shadow"
            />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul>
              <li>
                <Link
                  to="/"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/Search"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Trouver un trajet
                </Link>
              </li>
              <li>
                <Link
                  to="/Aboutus"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  À propos de nous
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul>
              <li>
                <Link
                  to="/help"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul>
              <li>
                <Link
                  to="/consulting"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Consulting
                </Link>
              </li>
              <li>
                <Link
                  to="/sales"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Ventes
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-white transition-colors hover:text-customGreen2-100"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                aria-label="Facebook"
                className="text-2xl text-white transition-colors hover:text-customGreen2-100"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.twitter.com"
                aria-label="Twitter"
                className="text-2xl text-white transition-colors hover:text-customGreen2-100"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com"
                aria-label="Instagram"
                className="text-2xl text-white transition-colors hover:text-customGreen2-100"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                className="text-2xl text-white transition-colors hover:text-customGreen2-100"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
