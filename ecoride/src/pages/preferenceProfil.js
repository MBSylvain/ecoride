import React from "react";

const ProfilePreferencesBlock = () => {
  return (
    <div className="flex items-center justify-center w-full p-6 font-sans bg-customGrey-100">
      <div className="flex flex-col w-full gap-8 p-6 bg-white border border-gray-100 rounded-lg shadow-lg lg:flex-row max-w-7xl">
        {/* Préférence Contact */}
        <div className="w-full lg:w-1/3">
          <h2 className="mb-4 text-xl font-bold md:text-2xl text-primary-100">
            Préférence Contact
          </h2>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Méthode de contact préférée :
            </span>{" "}
            Email
          </p>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Notifications :
            </span>{" "}
            Activées
          </p>
        </div>
        {/* Préférence Règlement */}
        <div className="w-full lg:w-1/3">
          <h2 className="mb-4 text-xl font-bold md:text-2xl text-primary-100">
            Préférence Règlement
          </h2>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Méthode de paiement préférée :
            </span>{" "}
            Carte de crédit
          </p>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Facturation automatique :
            </span>{" "}
            Activée
          </p>
        </div>
        {/* Préférence Voyage */}
        <div className="w-full lg:w-1/3">
          <h2 className="mb-4 text-xl font-bold md:text-2xl text-primary-100">
            Préférence Voyage
          </h2>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Type de véhicule préféré :
            </span>{" "}
            Berline
          </p>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Préférences de siège :
            </span>{" "}
            Avant
          </p>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">Musique :</span> Oui
          </p>
          <p className="mb-2 text-base leading-relaxed md:text-lg">
            <span className="font-semibold text-primary-100">
              Climatisation :
            </span>{" "}
            Oui
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreferencesBlock;
