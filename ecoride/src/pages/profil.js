import React from "react";
import profil from "../assets/homme1.jpg";

const ProfilePage = () => {
  return (
    <div className="flex items-center justify-center w-full p-4 bg-gray-100">
      <div className="flex flex-col w-full gap-8 p-4 bg-white rounded-lg shadow-md lg:flex-row max-w-7xl md:p-6 lg:p-8">
        {/* Informations de base sur le profil */}
        <div className="w-full p-2 md:w-2/3">
          <h1 className="mb-4 text-2xl font-bold md:text-3xl">
            Informations de Profil
          </h1>
          <div className="space-y-3 md:space-y-4"></div>
          <p className="mb-2 text-base md:text-lg">
            <strong>Nom :</strong> John Doe
          </p>
          <p className="mb-2 text-base md:text-lg">
            <strong>Email :</strong> john.doe@example.com
          </p>
          <p className="mb-2 text-base md:text-lg">
            <strong>Téléphone :</strong> +123 456 7890
          </p>
          <p className="mb-2 text-base md:text-lg">
            <strong>Adresse :</strong> 123 Rue Exemple, Ville, Pays
          </p>
        </div>
        {/* Photo de profil */}
        <div className="flex flex-col items-center w-full p-2 md:w-1/3">
          <img
            src={profil}
            alt="Profil"
            className="w-32 h-32 mb-4 rounded-full"
          />
          <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Mettre à jour la photo de profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
