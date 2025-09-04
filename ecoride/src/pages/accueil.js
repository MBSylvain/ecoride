import React from "react";
import { Link } from "react-router-dom";
import equipeImg from "../assets/avett-brothers.jpg";
import roadImg from "../assets/routeautonne.jpg";
import ampouleImg from "../assets/ampoule.jpg";
const HomePage = () => (  
<div className="mt-4 font-sans leading-relaxed text-gray-900 bg-gray-100">    
  <div className="p-8 mx-auto max-w-7xl">      {/* Section Bienvenue */}      
    <section className="p-8 mb-12 bg-white rounded-lg shadow-md">        
      <h1 className="mb-4 text-2xl font-semibold text-center text-primary-100">Bienvenue chez EcoRide</h1>        
      <p className="mb-4 text-justify">          EcoRide est une entreprise innovante dédiée à la mobilité durable et au          covoiturage écologique. Fondée en 2020, notre mission est de réduire          l'empreinte carbone des déplacements quotidiens tout en créant une          communauté engagée pour l'environnement.        </p>
              <div className="my-8 text-center">          <img            src={equipeImg}            alt="L'équipe EcoRide"            className="block w-1/2 mx-auto rounded-lg shadow-md md:w-1/3 xl:w-1/4"          />          <p className="mt-2 italic">            Notre équipe passionnée par la mobilité verte          </p>
        </div>
      </section>

      {/* Section Mission */}
      <section className="p-8 mb-12 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">
          Notre Mission
        </h2>
        <p className="mb-4 text-justify">
          Chez EcoRide, nous croyons que chaque trajet partagé est un pas vers un
          monde plus propre. Notre plateforme connecte des conducteurs avec des
          passagers ayant des trajets similaires, réduisant ainsi le nombre de
          véhicules sur les routes.
        </p>
        <p className="mb-2 text-primary-100 ">Nos objectifs :</p>
        <ul className="pl-6 mb-4">
          <li className="text-customGreen-80">Réduire les émissions de CO2 liées aux transports</li>
          <li className="text-customGreen-80">Diminuer la congestion routière dans les zones urbaines</li>
          <li className="text-customGreen-80">Rendre le covoiturage accessible à tous</li>
          <li className="text-customGreen-80">Créer une communauté engagée pour l'environnement</li>
        </ul>
        <div className="my-8 text-center">
          <img
            src={roadImg}
            alt="Covoiturage en action"
            className="block w-1/2 mx-auto rounded-lg shadow-md md:w-1/3"
          />
          <p className="mt-2 italic">
            Le covoiturage : une solution économique et écologique
          </p>
        </div>
      </section>

      {/* Section Pourquoi choisir EcoRide */}
      <section className="p-8 mb-12 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">
          Pourquoi choisir EcoRide ?
        </h2>
        <h3 className="mb-2 font-medium text-customGreen-80">Écologique</h3>
        <p className="mb-4 text-justify">
          En partageant votre véhicule ou en rejoignant un trajet, vous
          contribuez directement à la réduction des émissions de gaz à effet de
          serre. Chaque année, nos utilisateurs économisent collectivement plus de
          10 000 tonnes de CO2.
        </p>
        <h3 className="mb-2 font-medium text-customGreen-80">Économique</h3>
        <p className="text-justify mb-">
          Le covoiturage permet de partager les frais de carburant, de péage et de
          stationnement. Nos utilisateurs économisent en moyenne 2000€ par an sur
          leurs déplacements quotidiens.
        </p>
        <h3 className="mb-2 font-medium text-customGreen1-80">Convivial</h3>
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
        <h2 className="mb-4 text-xl font-semibold text-primary-100">
          Comment ça marche ?
        </h2>
        <ol className="pl-6 mb-4">
          <li className="text-customGreen-80">Inscrivez-vous gratuitement sur notre plateforme</li>
          <li className="text-customGreen-80" >Publiez votre trajet ou recherchez un covoiturage disponible</li>
          <li className="text-customGreen-80">Contactez votre covoitureur et organisez votre déplacement</li>
          <li className="text-customGreen-80">Voyagez ensemble et partagez les frais</li>
          <li className="text-customGreen-80">Évaluez votre expérience pour aider la communauté</li>
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
            className="inline-block bg-primary-100 text-white py-2.5 px-5 rounded-md font-bold mt-4 hover:bg-customPink-80 border-2 border-customPink-80 hover:"
          >
            Rejoindre EcoRide maintenant
          </Link>
        </div>
      </section>
    </div>
  </div>
);

export default HomePage;
