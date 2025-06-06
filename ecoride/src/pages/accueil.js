import React from "react";
import { Link } from "react-router-dom";
import equipeImg from "../assets/image/avett-brothers.jpg";
import roadImg from "../assets/image/road-besttravel.jpg";
import ampouleImg from "../assets/image/ampoulevert.jpg";
const HomePage = () => (  
<div className="mt-4 font-sans leading-relaxed bg-gray-100 text-gray-900">    
  <div className="p-8 mx-auto max-w-7xl">      {/* Section Bienvenue */}      
    <section className="p-8 mb-12 bg-white rounded-lg shadow-md">        
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-900">          Bienvenue chez EcoRide        </h2>        
      <p className="mb-4">          EcoRide est une entreprise innovante dédiée à la mobilité durable et au          covoiturage écologique. Fondée en 2020, notre mission est de réduire          l'empreinte carbone des déplacements quotidiens tout en créant une          communauté engagée pour l'environnement.        </p>
              <div className="my-8 text-center">          <img            src={equipeImg}            alt="L'équipe EcoRide"            className="block mx-auto rounded-lg shadow-md w-1/2 md:w-1/3 xl:w-1/4"          />          <p className="mt-2 italic">            Notre équipe passionnée par la mobilité verte          </p>
        </div>
      </section>

      {/* Section Mission */}
      <section className="p-8 mb-12 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-green-700">
          Notre Mission
        </h2>
        <p className="mb-4">
          Chez EcoRide, nous croyons que chaque trajet partagé est un pas vers un
          monde plus propre. Notre plateforme connecte des conducteurs avec des
          passagers ayant des trajets similaires, réduisant ainsi le nombre de
          véhicules sur les routes.
        </p>
        <p className="mb-2">Nos objectifs :</p>
        <ul className="pl-6 mb-4 list-disc">
          <li>Réduire les émissions de CO2 liées aux transports</li>
          <li>Diminuer la congestion routière dans les zones urbaines</li>
          <li>Rendre le covoiturage accessible à tous</li>
          <li>Créer une communauté engagée pour l'environnement</li>
        </ul>
        <div className="my-8 text-center">
          <img
            src={roadImg}
            alt="Covoiturage en action"
            className="block mx-auto rounded-lg shadow-md w-1/2 md:w-1/3"
          />
          <p className="mt-2 italic">
            Le covoiturage : une solution économique et écologique
          </p>
        </div>
      </section>

      {/* Section Pourquoi choisir EcoRide */}
      <section className="p-8 mb-12 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-green-700">
          Pourquoi choisir EcoRide ?
        </h2>
        <h3 className="mb-2 font-medium text-green-700">Écologique</h3>
        <p className="mb-4">
          En partageant votre véhicule ou en rejoignant un trajet, vous
          contribuez directement à la réduction des émissions de gaz à effet de
          serre. Chaque année, nos utilisateurs économisent collectivement plus de
          10 000 tonnes de CO2.
        </p>
        <h3 className="mb-2 font-medium text-green-600">Économique</h3>
        <p className="mb-4">
          Le covoiturage permet de partager les frais de carburant, de péage et de
          stationnement. Nos utilisateurs économisent en moyenne 2000€ par an sur
          leurs déplacements quotidiens.
        </p>
        <h3 className="mb-2 font-medium text-green-600">Convivial</h3>
        <p className="mb-4">
          Rejoignez une communauté de personnes partageant les mêmes valeurs et
          faites de nouvelles rencontres enrichissantes. Le covoiturage, c'est
          aussi une aventure humaine !
        </p>
        <div className="my-8 text-center">
          <img
            src={ampouleImg}
            alt="Impact positif sur l'environnement"
            className="w-16 mx-auto rounded-lg shadow-md"
          />
          <p className="mt-2 italic">Impact positif sur l'environnement</p>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="p-8 mb-12 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-green-700">
          Comment ça marche ?
        </h2>
        <ol className="pl-6 mb-4 list-decimal">
          <li>Inscrivez-vous gratuitement sur notre plateforme</li>
          <li>Publiez votre trajet ou recherchez un covoiturage disponible</li>
          <li>Contactez votre covoitureur et organisez votre déplacement</li>
          <li>Voyagez ensemble et partagez les frais</li>
          <li>Évaluez votre expérience pour aider la communauté</li>
        </ol>
        <div className="my-8 text-center">
          <img
            src={ampouleImg}
            alt="Interface de l'application EcoRide"
            className="w-16 mx-auto rounded-lg shadow-md"
          />
          <p className="mt-2 italic">
            Notre application intuitive et facile d'utilisation
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/register"
            className="inline-block bg-green-700 text-white py-2.5 px-5 rounded-md font-bold mt-4 hover:bg-green-800 border-2 border-green-700"
          >
            Rejoindre EcoRide maintenant
          </Link>
        </div>
      </section>
    </div>
  </div>
);

export default HomePage;
