import React from "react";
import carregister from "../assets/car-registrer.jpg";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-96 mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Enregistrement</h1>
        <input
          type="text"
          placeholder="Nom"
          className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="mb-6 p-3 w-full border border-gray-300 rounded-lg"
        />
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          S'enregistrer
        </button>
      </div>
      <div className="w-1/2">
        <img
          src={carregister}
          alt="Enregistrement"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
