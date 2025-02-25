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
    <footer className="bg-primary-100 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-row mx-10 justify-center gap-x-24">
          <div>
            <img
              src="./logoecoblanc.png"
              width={50}
              height={50}
              alt="logo"
              className=""
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul>
              <li>
                <Link to="/" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/Search" className="hover:underline">
                  Trouver un trajet
                </Link>
              </li>
              <li>
                <Link to="/Aboutus" className="hover:underline">
                  A propos de nous
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul>
              <li>
                <Link to="/help" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul>
              <li>
                <Link to="/consulting" className="hover:underline">
                  Consulting
                </Link>
              </li>
              <li>
                <Link to="/sales" className="hover:underline">
                  Sales
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:underline">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                className="hover:text-gray-400"
              >
                <FaFacebookF />
              </a>
              <a href="https://www.twitter.com" className="hover:text-gray-400">
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com"
                className="hover:text-gray-400"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com"
                className="hover:text-gray-400"
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
