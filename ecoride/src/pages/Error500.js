import React from "react";
import { Link } from "react-router-dom";

const Error500 = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100">
    <div className="w-full max-w-lg overflow-hidden bg-white shadow-lg rounded-xl">
      <div className="p-5 sm:p-10">
        <div className="text-center">
          <h1 className="font-bold text-red-600 text-9xl">500</h1>
          <h2 className="mt-4 text-3xl font-semibold text-gray-800">Erreur interne du serveur</h2>
          <p className="mt-4 mb-8 text-gray-600">
            Nous rencontrons des difficultés techniques. Notre équipe a été informée du problème.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row">
            <Link
              to="/"
              className="inline-block px-6 py-3 font-medium text-white transition-colors duration-300 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 font-medium text-gray-800 transition-colors duration-300 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-sm text-center text-gray-600">
      <p>Si le problème persiste, veuillez contacter notre support technique.</p>
      <p className="mt-2">Code d'erreur: 500 - Internal Server Error</p>
    </div>
  </div>
);

export default Error500;