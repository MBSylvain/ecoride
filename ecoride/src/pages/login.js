import React from "react";
import Carlogin from "../assets/car-login.jpg";
const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-4">Connexion</h1>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 w-80 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="mb-6 p-3 w-80 border border-gray-300 rounded-lg"
        />
        <button className="w-80 justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Login
        </button>
      </div>
      <div className="w-1/2 ">
        <img
          src={Carlogin}
          alt="Connexion"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
