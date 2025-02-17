import React from "react";
import {
  FaCar,
  FaEuroSign,
  FaMapMarkedAlt,
  FaGlobe,
  FaSeedling,
  FaCloud,
} from "react-icons/fa"; // Importer des icônes de react-icons
const AboutUsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Premier bloc */}
      <div>
        <h1 className="text-2xl font-semibold">A propos de nous</h1>
      </div>
      <div className="w-full p-8 bg-white shadow-md mb-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 flex flex-col items-center md:center">
          <img src="./logoecov.png" alt="Logo" className="w-32 h-32" />
          <p className="text-xl font-bold">10 ans d'expérience</p>
          <p className="text-lg">500 trajets/jour</p>
        </div>
        <div className="md:w-2/3 flex flex-wrap justify-center md:justify-start">
          {/* Cartes */}
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaCar className="text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold mb-2">Titre 1</h2>
              <h3 className="text-lg mb-2">Sous-titre 1</h3>
              <p className="text-base">Description de la carte 1.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaSeedling className="text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold mb-2">Titre 2</h2>
              <h3 className="text-lg mb-2">Sous-titre 2</h3>
              <p className="text-base">Description de la carte 2.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaCloud className="text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold mb-2">Titre 3</h2>
              <h3 className="text-lg mb-2">Sous-titre 3</h3>
              <p className="text-base">Description de la carte 3.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaEuroSign className="text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold mb-2">Titre 4</h2>
              <h3 className="text-lg mb-2">Sous-titre 4</h3>
              <p className="text-base">Description de la carte 4.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaMapMarkedAlt className="text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold mb-2">Titre 5</h2>
              <h3 className="text-lg mb-2">Sous-titre 5</h3>
              <p className="text-base">Description de la carte 5.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaGlobe className="text-4xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold mb-2">Titre 6</h2>
              <h3 className="text-lg mb-2">Sous-titre 6</h3>
              <p className="text-base">Description de la carte 6.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Deuxième bloc */}
      <div>
        <h1 className="text-2xl font-semibold">Nos convictions</h1>
      </div>
      <div className="w-full p-8 shadow-md mb-8 bg-white">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Carte 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-2">Titre 1</h2>
            <h3 className="text-lg mb-4">Sous-titre 1</h3>
            <img src="#" alt="profil" className="mx-auto mb-4" />
            <p className="text-base mb-4">Description de la carte 1.</p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Bouton 1
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Bouton 2
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Troisième bloc */}
      <div>
        <h1 className="text-2xl font-medium">Les créateurs</h1>
      </div>
      <div className="w-full p-8 h-auto bg-white">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Carte 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-2">Nom du Créateur 1</h2>
            <h3 className="text-lg mb-4">Fondateur</h3>
            <img
              src="https://via.placeholder.com/150"
              alt="Créateur 1"
              className="mx-auto mb-4"
            />
            <p className="text-base mb-4">Description du créateur 1.</p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                LinkedIn
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Twitter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
