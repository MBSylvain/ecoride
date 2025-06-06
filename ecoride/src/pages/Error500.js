import React from "react";
import { Link } from "react-router-dom";

const Error500 = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
    <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-5 sm:p-10">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-red-600">500</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">Erreur interne du serveur</h2>
          <p className="text-gray-600 mt-4 mb-8">
            Nous rencontrons des difficultés techniques. Notre équipe a été informée du problème.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-600 text-sm">
      <p>Si le problème persiste, veuillez contacter notre support technique.</p>
      <p className="mt-2">Code d'erreur: 500 - Internal Server Error</p>
    </div>
  </div>
);

export default Error500;