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
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">Rechercher un trajet</h1>

        {/* Formulaire de recherche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSearch}>
            <div>
              <label className="block text-gray-700 mb-2">Ville de départ</label>
              <input
                type="text"
                name="ville_depart"
                value={search.ville_depart}
                onChange={handleChange}
                placeholder="Ex: Paris"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Ville d'arrivée</label>
              <input
                type="text"
                name="ville_arrivee"
                value={search.ville_arrivee}
                onChange={handleChange}
                placeholder="Ex: Lyon"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date de départ</label>
              <input
                type="date"
                name="date_depart"
                value={search.date_depart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:scale-102"
                >
                  <div className="p-5">
                    {/* Conducteur */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4 flex items-center justify-center">
                        {trajet.conducteur.photo ? (
                          <img src={trajet.conducteur.photo} alt="Photo de profil" className="w-full h-full object-cover" />
                        ) : (
                          <FaUser className="text-green-700 text-xl" />
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
                          <FaMapMarkerAlt className="text-green-600" />
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
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="font-bold text-xl text-green-700">{trajet.prix.toFixed(2)} €</span>
                        <span className="text-sm text-gray-500">/personne</span>
                      </div>
                      <div>
                        <span className={trajet.places_restantes > 0 ? "text-green-600" : "text-red-600"} + " font-medium"}>
                          {trajet.places_restantes} place{trajet.places_restantes > 1 ? "s" : ""} restante{trajet.places_restantes > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {/* Badges et bouton */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {est_ecologique && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            <FaLeaf className="inline mr-1" /> Écologique
                          </span>
                        )}
                        {trajet.bagages_autorises && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            <FaSuitcase className="inline mr-1" /> Bagages
                          </span>
                        )}
                        {trajet.animaux_autorises && (
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            <FaPaw className="inline mr-1" /> Animaux
                          </span>
                        )}
                        {trajet.fumeur_autorise && (
                          <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            <FaSmoking className="inline mr-1" /> Fumeur
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedTrajet(trajet)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition duration-200"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <FaMapMarkerAlt className="text-gray-300 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun trajet ne correspond à votre recherche</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Essayez de modifier vos critères de recherche ou consultez les trajets à venir.
              </p>
            </div>
          )}
        </div>

        {/* Détail du trajet (modal) */}
        {selectedTrajet && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button
                onClick={() => setSelectedTrajet(null)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Fermer
              </button>
              <h2 className="text-xl font-bold mb-4">Détails du trajet</h2>
              <div className="space-y-6">
                {/* Conducteur */}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg text-green-700 mb-2">Conducteur</h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4 flex items-center justify-center">
                      {selectedTrajet.conducteur.photo ? (
                        <img src={selectedTrajet.conducteur.photo} alt="Photo de profil" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-green-700 text-2xl" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-lg">
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
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg text-green-700 mb-2">Détails du trajet</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-8 text-center">
                        <FaMapMarkerAlt className="text-green-600" />
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
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg text-green-700 mb-2">Véhicule</h3>
                  <p className="text-sm text-gray-600">{selectedTrajet.voiture.marque}</p>
                  <p className="text-sm text-gray-600">{selectedTrajet.voiture.modele}</p>
                  <p className="text-sm text-gray-600">Couleur: {selectedTrajet.voiture.couleur}</p>
                  <p className="text-sm text-gray-600">Énergie: {selectedTrajet.voiture.energie}</p>
                </div>
                {/* Options et préférences */}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg text-green-700 mb-2">Préférences</h3>
                  <div className="flex flex-wrap gap-2">
                    {["electrique", "hybride"].includes((selectedTrajet.voiture.energie || "").toLowerCase()) && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        <FaLeaf className="inline mr-1" /> Véhicule écologique
                      </span>
                    )}
                    {selectedTrajet.bagages_autorises && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        <FaSuitcase className="inline mr-1" /> Bagages autorisés
                      </span>
                    )}
                    {selectedTrajet.animaux_autorises && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        <FaPaw className="inline mr-1" /> Animaux autorisés
                      </span>
                    )}
                    {selectedTrajet.fumeur_autorise && (
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        <FaSmoking className="inline mr-1" /> Fumeur autorisé
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/contact?conducteur=${selectedTrajet.conducteur.pseudo}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaCommentAlt className="mr-1" /> Contacter
                  </Link>
                  <Link
                    to={`/reserver/${selectedTrajet.trajet_id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
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