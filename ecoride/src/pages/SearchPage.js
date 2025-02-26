import React from "react";
import backgroundImage from "../assets/map.jpg";
import backgroundImage2 from "../assets/fog-bg.jpg";
import backgroundImage3 from "../assets/road-besttravel.jpg";

const SearchPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Bloc de recherche */}
      <div
        className="w-full p-8 bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full bg-white bg-opacity-75 p-8 rounded-lg shadow-md  mx-auto">
          <h1 className="text-2xl font-bold mb-4">Rechercher des annonces</h1>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <input
              type="text"
              placeholder="Départ"
              className="mb-4 md:mb-0 p-3 w-full border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Arrivée"
              className="mb-4 md:mb-0 p-3 w-full border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              className="mb-4 md:mb-0 p-3 w-full border border-gray-300 rounded-lg"
            />
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full md:w-auto">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Bloc d'annonces */}
      <div
        className="w-full p-8 h-96 bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${backgroundImage2})` }}
      >
        <div className="flex flex-col h-full md:flex-row flex-wrap -mx-4">
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
              <h2 className="text-xl font-bold mb-2">Annonce 1</h2>
              <p className="text-lg">Description de l'annonce 1.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
              <h2 className="text-xl font-bold mb-2">Annonce 2</h2>
              <p className="text-lg">Description de l'annonce 2.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Annonce 3</h2>
              <p className="text-lg">Description de l'annonce 3.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bloc meilleurs destinations */}

      <div
        className="w-full h-96 p-8 bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${backgroundImage3})` }}
      >
        <div className="flex flex-col md:flex-row flex-wrap -mx-4">
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
              <h2 className="text-xl font-bold mb-2">Annonce 1</h2>
              <p className="text-lg">Description de l'annonce 1.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
              <h2 className="text-xl font-bold mb-2">Annonce 2</h2>
              <p className="text-lg">Description de l'annonce 2.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Annonce 3</h2>
              <p className="text-lg">Description de l'annonce 3.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
