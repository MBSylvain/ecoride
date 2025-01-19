import React, { useState } from "react";

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
            aria-expanded={isOpen}
            aria-controls="menu"
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
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <div
          id="menu"
          className={`w-full lg:flex lg:items-center lg:w-auto ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="lg:flex lg:justify-between text-white">
            <li className="lg:mx-4 my-2 lg:my-0">
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-700">
                Home
              </a>
            </li>
            <li className="lg:mx-4 my-2 lg:my-0">
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-700">
                About
              </a>
            </li>
            <li className="lg:mx-4 my-2 lg:my-0">
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-700">
                Services
              </a>
            </li>
            <li className="lg:mx-4 my-2 lg:my-0">
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-700">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
