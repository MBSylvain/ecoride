import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaLeaf, FaSuitcase, FaPaw, FaSmoking, FaUser, FaMapMarkerAlt, FaCheck, FaCommentAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

// Exemple de données factices (à remplacer par un fetch API)
const fakeTrajets = [
  {
    trajet_id: 1,
    ville_depart: "Paris",
    ville_arrivee: "Lyon",
    date_depart: "2025-06-10",
    heure_depart: "08:00",
    heure_arrivee: "12:00",
    prix: 25,
    nombre_places: 3,
    bagages_autorises: true,
    animaux_autorises: true,
    fumeur_autorise: false,
    voiture: {
      marque: "Renault",
      modele: "Clio",
      couleur: "Bleu",
      energie: "hybride",
    },
    conducteur: {
      photo: "",
      pseudo: "JeanD",
      prenom: "Jean",
      nom: "Dupont",
      note_moyenne: 4.7,
      date_inscription: "2022-01-15",
    },
    places_restantes: 2,
  },
  // ... Ajoute d'autres trajets pour tester
];

const TrajetsDisponibles = () => {
  const [search, setSearch] = useState({
    ville_depart: "",
    ville_arrivee: "",
    date_depart: "",
  });
  const [results, setResults] = useState([]);
  const [selectedTrajet, setSelectedTrajet] = useState(null);

  useEffect(() => {
    // Ici, tu peux faire un fetch initial pour tous les trajets
    setResults(fakeTrajets);
  }, []);

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Ici, fais un fetch vers ton API avec les filtres
    // Pour l'exemple, on filtre localement
    let filtered = fakeTrajets.filter((t) => {
      return (
        (!search.ville_depart || t.ville_depart.toLowerCase().includes(search.ville_depart.toLowerCase())) &&
        (!search.ville_arrivee || t.ville_arrivee.toLowerCase().includes(search.ville_arrivee.toLowerCase())) &&
        (!search.date_depart || t.date_depart === search.date_depart)
      );
    });
    setResults(filtered);
  };

  const renderStars = (note) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (note >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (note >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen py-8 bg-customGrey-100">
      <div className="container px-4 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-primary-100">Rechercher un trajet</h1>

        {/* Formulaire de recherche */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleSearch}>
            <div>
              <label className="block mb-2 text-primary-100">Ville de départ</label>
              <input
                type="text"
                name="ville_depart"
                value={search.ville_depart}
                onChange={handleChange}
                placeholder="Ex: Paris"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen2-100"
              />
            </div>
            <div>
              <label className="block mb-2 text-primary-100">Ville d'arrivée</label>
              <input
                type="text"
                name="ville_arrivee"
                value={search.ville_arrivee}
                onChange={handleChange}
                placeholder="Ex: Lyon"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen2-100"
              />
            </div>
            <div>
              <label className="block mb-2 text-primary-100">Date de départ</label>
              <input
                type="date"
                name="date_depart"
                value={search.date_depart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen2-100"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white transition duration-200 rounded-md bg-primary-100 hover:bg-customGreen2-100"
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.length > 0 ? (
            results.map((trajet) => {
              const est_ecologique = ["electrique", "hybride"].includes(
                (trajet.voiture.energie || "").toLowerCase()
              );
              const heure_depart = trajet.heure_depart?.slice(0, 5);
              const heure_arrivee = trajet.heure_arrivee?.slice(0, 5) || "Non précisée";
              return (
                <div
                  key={trajet.trajet_id}
                  className="overflow-hidden transition-transform duration-200 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-102"
                >
                  <div className="p-5">
                    {/* Conducteur */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 overflow-hidden rounded-full bg-customGrey-100">
                        {trajet.conducteur.photo ? (
                          <img src={trajet.conducteur.photo} alt="Photo de profil" className="object-cover w-full h-full" />
                        ) : (
                          <FaUser className="text-xl text-primary-100" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{trajet.conducteur.pseudo || `${trajet.conducteur.prenom} ${trajet.conducteur.nom[0]}.`}</h3>
                        <div className="flex items-center">
                          <div className="flex mr-1">{renderStars(trajet.conducteur.note_moyenne)}</div>
                          <span className="text-sm text-gray-500">{trajet.conducteur.note_moyenne ? trajet.conducteur.note_moyenne : "Nouveau"}</span>
                        </div>
                      </div>
                    </div>
                    {/* Trajet */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 text-center">
                          <FaMapMarkerAlt className="text-primary-100" />
                        </div>
                        <div>
                          <h4 className="font-medium">{trajet.ville_depart}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(trajet.date_depart).toLocaleDateString("fr-FR")} à {heure_depart}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 text-center">
                          <FaMapMarkerAlt className="text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{trajet.ville_arrivee}</h4>
                          <p className="text-sm text-gray-500">
                            {trajet.heure_arrivee && <>Arrivée estimée à {heure_arrivee}</>}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Prix et places */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-primary-100">{trajet.prix.toFixed(2)} €</span>
                        <span className="text-sm text-gray-500">/personne</span>
                      </div>
                      <div>
                        <span className={trajet.places_restantes > 0 ? "text-customGreen2-100" : "text-red-600" + " font-medium"}>
                          {trajet.places_restantes} place{trajet.places_restantes > 1 ? "s" : ""} restante{trajet.places_restantes > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {/* Badges et bouton */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {est_ecologique && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-customGreen-100 text-primary-100">
                            <FaLeaf className="inline mr-1" /> Écologique
                          </span>
                        )}
                        {trajet.bagages_autorises && (
                          <span className="inline-block px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                            <FaSuitcase className="inline mr-1" /> Bagages
                          </span>
                        )}
                        {trajet.animaux_autorises && (
                          <span className="inline-block px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                            <FaPaw className="inline mr-1" /> Animaux
                          </span>
                        )}
                        {trajet.fumeur_autorise && (
                          <span className="inline-block px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                            <FaSmoking className="inline mr-1" /> Fumeur
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedTrajet(trajet)}
                        className="px-4 py-2 text-sm font-bold text-white transition duration-200 rounded bg-primary-100 hover:bg-customGreen2-100"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center col-span-full">
              <FaMapMarkerAlt className="mb-4 text-5xl text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-600">Aucun trajet ne correspond à votre recherche</h3>
              <p className="max-w-md mx-auto text-gray-500">
                Essayez de modifier vos critères de recherche ou consultez les trajets à venir.
              </p>
            </div>
          )}
        </div>

        {/* Détail du trajet (modal) */}
        {selectedTrajet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
              <button
                onClick={() => setSelectedTrajet(null)}
                className="absolute px-3 py-1 font-bold text-white bg-red-600 rounded top-2 right-2 hover:bg-red-700"
              >
                Fermer
              </button>
              <h2 className="mb-4 text-xl font-bold">Détails du trajet</h2>
              <div className="space-y-6">
                {/* Conducteur */}
                <div className="pb-4 border-b">
                  <h3 className="mb-2 text-lg font-bold text-primary-100">Conducteur</h3>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-16 h-16 mr-4 overflow-hidden rounded-full bg-customGrey-100">
                      {selectedTrajet.conducteur.photo ? (
                        <img src={selectedTrajet.conducteur.photo} alt="Photo de profil" className="object-cover w-full h-full" />
                      ) : (
                        <FaUser className="text-2xl text-primary-100" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {selectedTrajet.conducteur.pseudo ||
                          `${selectedTrajet.conducteur.prenom} ${selectedTrajet.conducteur.nom[0]}.`}
                      </p>
                      <div className="flex items-center">
                        <div className="flex mr-1">{renderStars(selectedTrajet.conducteur.note_moyenne)}</div>
                        <span className="text-sm text-gray-500">
                          {selectedTrajet.conducteur.note_moyenne ? selectedTrajet.conducteur.note_moyenne : "Nouveau"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Membre depuis{" "}
                        {selectedTrajet.conducteur.date_inscription
                          ? new Date(selectedTrajet.conducteur.date_inscription).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                          : "récemment"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Détails du trajet */}
                <div className="pb-4 border-b">
                  <h3 className="mb-2 text-lg font-bold text-primary-100">Détails du trajet</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-8 text-center">
                        <FaMapMarkerAlt className="text-primary-100" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedTrajet.ville_depart}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedTrajet.date_depart).toLocaleDateString("fr-FR")} à {selectedTrajet.heure_depart?.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-8 text-center">
                        <FaMapMarkerAlt className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedTrajet.ville_arrivee}</p>
                        <p className="text-sm text-gray-500">
                          {selectedTrajet.heure_arrivee && <>Arrivée estimée à {selectedTrajet.heure_arrivee?.slice(0, 5)}</>}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-bold">{selectedTrajet.prix.toFixed(2)} € par personne</p>
                      <p className="text-sm text-gray-600">
                        {selectedTrajet.places_restantes} place{selectedTrajet.places_restantes > 1 ? "s" : ""} disponible{selectedTrajet.places_restantes > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Voiture */}
                <div className="pb-4 border-b">
                  <h3 className="mb-2 text-lg font-bold text-primary-100">Véhicule</h3>
                  <p className="text-sm text-gray-600">{selectedTrajet.voiture.marque}</p>
                  <p className="text-sm text-gray-600">{selectedTrajet.voiture.modele}</p>
                  <p className="text-sm text-gray-600">Couleur: {selectedTrajet.voiture.couleur}</p>
                  <p className="text-sm text-gray-600">Énergie: {selectedTrajet.voiture.energie}</p>
                </div>
                {/* Options et préférences */}
                <div className="pb-4 border-b">
                  <h3 className="mb-2 text-lg font-bold text-primary-100">Préférences</h3>
                  <div className="flex flex-wrap gap-2">
                    {["electrique", "hybride"].includes((selectedTrajet.voiture.energie || "").toLowerCase()) && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-customGreen-100 text-primary-100">
                        <FaLeaf className="inline mr-1" /> Véhicule écologique
                      </span>
                    )}
                    {selectedTrajet.bagages_autorises && (
                      <span className="inline-block px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                        <FaSuitcase className="inline mr-1" /> Bagages autorisés
                      </span>
                    )}
                    {selectedTrajet.animaux_autorises && (
                      <span className="inline-block px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                        <FaPaw className="inline mr-1" /> Animaux autorisés
                      </span>
                    )}
                    {selectedTrajet.fumeur_autorise && (
                      <span className="inline-block px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                        <FaSmoking className="inline mr-1" /> Fumeur autorisé
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/contact?conducteur=${selectedTrajet.conducteur.pseudo}`}
                    className="flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <FaCommentAlt className="mr-1" /> Contacter
                  </Link>
                  <Link
                    to={`/reserver/${selectedTrajet.trajet_id}`}
                    className="flex items-center px-4 py-2 font-bold text-white rounded bg-primary-100 hover:bg-customGreen2-100"
                  >
                    <FaCheck className="mr-1" /> Réserver
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrajetsDisponibles;