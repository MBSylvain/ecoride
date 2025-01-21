import React from "react";

export default function InfoVéhicule() {
  return (
    <div>
      <div className="flex items-center  justify-center min-h-72 w-full bg-gray-100">
        <div className="w-full col-auto max-w-4xl p-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
          {/* Informations du véhicule */}
          <div className="md:w-1/2 p-4">
            <h1 className="text-2xl font-bold mb-4">
              Informations du Véhicule
            </h1>
            <p className="text-lg mb-2">
              <strong>Marque :</strong> Toyota
            </p>
            <p className="text-lg mb-2">
              <strong>Modèle :</strong> Corolla
            </p>
            <p className="text-lg mb-2">
              <strong>Année :</strong> 2020
            </p>
            <p className="text-lg mb-2">
              <strong>Couleur :</strong> Bleu
            </p>
            <p className="text-lg mb-2">
              <strong>Immatriculation :</strong> ABC-1234
            </p>
          </div>
          {/* Informations sur les documents */}
          <div className="xl:flex-row w-full md:w-1/2 p-4">
            <h1 className="text-2xl font-bold mb-4">Documents du Profil</h1>
            <p className="text-lg mb-2">
              <strong>Permis de conduire :</strong> Validé
            </p>
            <p className="text-lg mb-2">
              <strong>Assurance :</strong> Validé
            </p>
            <p className="text-lg mb-2">
              <strong>Carte grise :</strong> Validé
            </p>
            <p className="text-lg mb-2">
              <strong>Contrôle technique :</strong> Validé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
