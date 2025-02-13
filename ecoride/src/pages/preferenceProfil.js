import React from "react";

const ProfilePreferencesBlock = () => {
  return (
    <div className="flex items-center justify-center p-4 w-full bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md gap-8">
        {/* Préférence Contact */}
        <div className="w-full lg:w-1/3">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Préférence Contact
          </h1>
          <p className="text-base md:text-lg mb-2">
            <strong>Méthode de contact préférée :</strong> Email
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Notifications :</strong> Activées
          </p>
        </div>
        {/* Préférence Règlement */}
        <div className="w-full lg:w-1/3">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Préférence Règlement
          </h1>
          <p className="text-base md:text-lg mb-2">
            <strong>Méthode de paiement préférée :</strong> Carte de crédit
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Facturation automatique :</strong> Activée
          </p>
        </div>
        {/* Préférence Voyage */}
        <div className="w-full lg:w-1/3">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Préférence Voyage
          </h1>
          <p className="text-base md:text-lg mb-2">
            <strong>Type de véhicule préféré :</strong> Berline
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Préférences de siège :</strong> Avant
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Musique :</strong> Oui
          </p>
          <p className="text-base md:text-lg mb-2">
            <strong>Climatisation :</strong> Oui
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreferencesBlock;
