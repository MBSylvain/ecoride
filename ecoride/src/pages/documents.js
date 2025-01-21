import React from "react";

export default function documents() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
  );
}
