import React from "react";
import { FaCar, FaSeedling, FaEuroSign, FaLeaf, FaUsers, FaLock, FaLightbulb, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logoEcov from "../assets/logo/logoecov.png";
import mapImg from "../assets/map.jpg";
import femme1 from "../assets/femme1.jpg";
import home1 from "../assets/homme1.jpg";
import femme2 from "../assets/femme2.jpg";

const infoCards = [
  {
    icon: <FaCar className="mb-4 text-3xl text-customGreen2-100" />,
    title: "Mobilité Partagée",
    subtitle: "Transports plus intelligents",
    description: "Nous proposons une alternative économique et écologique aux déplacements quotidiens.",
  },
  {
    icon: <FaSeedling className="mb-4 text-3xl text-customGreen2-100" />,
    title: "Réduction CO2",
    subtitle: "Impact environnemental",
    description: "Chaque trajet partagé réduit les émissions de carbone et contribue à un monde plus propre.",
  },
  {
    icon: <FaEuroSign className="mb-4 text-3xl text-customGreen2-100" />,
    title: "Économies",
    subtitle: "Réduction des coûts",
    description: "Nos utilisateurs économisent en moyenne 2000€ par an sur leurs frais de transport.",
  },
];

const team = [
  {
    img: femme1,
    name: "Sophie Martin",
    role: "Fondatrice & CEO",
  },
  {
    img: home1,
    name: "Thomas Dubois",
    role: "Directeur Technique",
  },
  {
    img: femme2,
    name: "Emma Legrand",
    role: "Responsable Marketing",
  },
];

const valeurs = [
  {
    icon: <FaLeaf className="text-3xl text-customGreen2-100" />,
    title: "Respect de l'environnement",
    desc: "Notre priorité est de réduire l'impact environnemental des transports. Chaque décision que nous prenons est guidée par notre engagement envers un avenir plus durable.",
  },
  {
    icon: <FaUsers className="text-3xl text-customGreen2-100" />,
    title: "Communauté",
    desc: "Nous croyons en la force de la communauté. EcoRide n'est pas seulement une plateforme, c'est un réseau de personnes partageant les mêmes valeurs.",
  },
  {
    icon: <FaLock className="text-3xl text-customGreen2-100" />,
    title: "Sécurité et confiance",
    desc: "La sécurité de nos utilisateurs est primordiale. Nous mettons en place des systèmes de vérification rigoureux pour créer un environnement de confiance.",
  },
  {
    icon: <FaLightbulb className="text-3xl text-customGreen2-100" />,
    title: "Innovation",
    desc: "Nous sommes constamment à la recherche de nouvelles façons d'améliorer notre service et de rendre la mobilité partagée plus accessible à tous.",
  },
];

const AboutUs = () => {
  return (
    <div className="font-sans leading-relaxed text-gray-800 bg-gray-100">
      <div className="p-8 mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary-100">À propos d'EcoRide</h1>
          <p className="text-xl text-gray-700">Découvrez notre histoire, notre équipe et notre vision pour un avenir plus vert</p>
        </div>

        {/* Premier bloc */}
        <div className="w-full p-8 mb-8 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center md:flex-row">
            <div className="flex flex-col items-center mb-6 md:w-1/3 md:mb-0">
              <img src={logoEcov} alt="Logo EcoRide" className="w-32 h-24 mb-4" />
              <p className="text-xl font-bold text-primary-100">10 ans d'expérience</p>
              <p className="text-lg text-gray-700">Plus de 500 trajets par jour</p>
            </div>
            <div className="flex flex-wrap justify-center md:w-2/3 md:justify-start">
              {infoCards.map((card, idx) => (
                <div key={idx} className="w-full p-4 md:w-1/2 lg:w-1/3">
                  <div className="p-6 text-center bg-white border border-gray-100 rounded-lg shadow-md">
                    {card.icon}
                    <h2 className="mb-2 text-xl font-bold text-primary-100">{card.title}</h2>
                    <h3 className="mb-4 text-lg text-customGreen2-100">{card.subtitle}</h3>
                    <p className="text-base text-gray-700">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notre histoire */}
        <section className="p-8 mb-12 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-primary-100">Notre Histoire</h2>
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-6 md:w-1/2 md:mb-0 md:pr-8">
              <p className="mb-4 text-gray-700">
                Fondée en 2013 par un groupe d'ingénieurs passionnés par la mobilité durable, EcoRide est née d'une
                vision simple : rendre les déplacements plus écologiques et plus économiques.
              </p>
              <p className="mb-4 text-gray-700">
                Ce qui a commencé comme une petite startup dans un garage s'est transformé en une entreprise
                innovante présente dans plus de 50 villes en France et en Europe.
              </p>
              <p className="text-gray-700">
                Aujourd'hui, notre plateforme connecte des milliers de conducteurs et de passagers chaque jour,
                contribuant à réduire significativement l'empreinte carbone liée aux transports.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src={mapImg} alt="Histoire d'EcoRide" className="w-full border border-gray-100 rounded-lg shadow-md" />
            </div>
          </div>
        </section>

        {/* Notre équipe */}
        <section className="p-8 mb-12 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-primary-100">Notre Équipe</h2>
          <p className="mb-6 text-gray-700">
            Chez EcoRide, nous sommes fiers de notre équipe diversifiée et passionnée. Des ingénieurs aux spécialistes
            du service client, chaque membre partage notre vision d'une mobilité plus durable.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {team.map((membre, idx) => (
              <div key={idx} className="p-4 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
                <img src={membre.img} alt={membre.name} className="object-cover w-32 h-32 mx-auto mb-4 border-4 rounded-full border-customGreen2-100" />
                <h3 className="font-bold text-primary-100">{membre.name}</h3>
                <p className="text-customGreen2-100">{membre.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="p-8 mb-12 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-primary-100">Nos Valeurs</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {valeurs.map((val, idx) => (
              <div key={idx} className="flex items-start">
                <div className="mr-4">{val.icon}</div>
                <div>
                  <h3 className="mb-2 font-bold text-primary-100">{val.title}</h3>
                  <p className="text-gray-700">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="p-8 mb-12 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-primary-100">Contactez-nous</h2>
          <div className="flex flex-col md:flex-row">
            <div className="mb-6 md:w-1/2 md:mb-0 md:pr-8">
              <p className="mb-4 text-gray-700">
                Vous avez des questions ou des suggestions ? Notre équipe est à votre écoute.
                N'hésitez pas à nous contacter.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-customGreen2-100" />
                  <span>123 Avenue de la Mobilité, 75000 Paris</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaPhone className="mr-2 text-customGreen2-100" />
                  <span>+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-2 text-customGreen2-100" />
                  <span>contact@ecoride.fr</span>
                </li>
              </ul>
              <div className="flex mt-4 space-x-4">
                <a href="#" className="text-customGreen2-100 hover:text-primary-100">
                  <FaFacebookF className="text-xl" />
                </a>
                <a href="#" className="text-customGreen2-100 hover:text-primary-100">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-customGreen2-100 hover:text-primary-100">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-customGreen2-100 hover:text-primary-100">
                  <FaLinkedinIn className="text-xl" />
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <form className="p-6 bg-white border border-gray-100 rounded-lg shadow-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 text-sm font-semibold text-primary-100">Nom</label>
                  <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold text-primary-100">Email</label>
                  <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block mb-2 text-sm font-semibold text-primary-100">Message</label>
                  <textarea id="message" rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100" required></textarea>
                </div>
                <button type="submit" className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100">Envoyer</button>
              </form>
            </div>
          </div>
        </section>
        <div className="flex justify-end mt-8">
          <a
            href="/"
            className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;