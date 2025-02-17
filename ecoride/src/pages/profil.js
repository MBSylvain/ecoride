import React from "react";
import profil from "../assets/portrait-3157821.jpg";

const ProfilePage = () => {
  return (
    <div className="flex items-center justify-center w-full p-4 bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md gap-8">
        {/* Informations de base sur le profil */}
        <div className="w-full md:w-2/3 p-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Informations de Profil
          </h1>
          <div className="space-y-3 md:space-y-4"></div>
          <p className="text-base md:text-lg mb-2">
            <strong>Nom :</strong> John Doe
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Email :</strong> john.doe@example.com
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Téléphone :</strong> +123 456 7890
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Adresse :</strong> 123 Rue Exemple, Ville, Pays
          </p>
        </div>
        {/* Photo de profil */}
        <div className="w-full md:w-1/3 p-2 flex flex-col items-center">
          <img
            src={profil}
            alt="Profil"
            className="w-32 h-32 rounded-full mb-4"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Mettre à jour la photo de profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
