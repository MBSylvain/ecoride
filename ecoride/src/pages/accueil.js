import React from "react";
import car from "../assets/car-home.jpg";
const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue sur notre site de covoiturage Ecoride
        </h1>
        <p className="text-lg mb-6">
          Trouvez et partargez des trajets facilement et rapidement.
        </p>
        <button className="px-6 py-3 w-80 justify-center bg-primary-100 text-white border-2 border-primary-100 rounded-lg hover:bg-white hover:text-primary-100  hover:border-customPink-80">
          Commencez maintenant
        </button>
      </div>
      <div className="w-1/2">
        <img
          src={car}
          alt="Covoiturage"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default HomePage;
