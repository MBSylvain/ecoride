import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 font-sans bg-customGrey-100">
    <div className="w-full max-w-lg overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
      <div className="p-5 sm:p-10">
        <div className="text-center">
          <h1 className="font-bold text-9xl text-primary-100">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-primary-100">Page non trouvée</h2>
          <p className="mt-4 mb-8 text-base leading-relaxed text-gray-700">
            Oups, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row">
            <Link
              to="/"
              className="inline-block px-6 py-3 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-sm text-center text-gray-600">
      <p>Si le problème persiste, veuillez contacter notre support technique.</p>
      <p className="mt-2">Code d'erreur: 404 - Not Found</p>
    </div>
  </div>
);

export default Error404;