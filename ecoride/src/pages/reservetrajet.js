import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const fakeTrajet = {
  ville_depart: "Paris",
  adresse_depart: "Gare de Lyon",
  ville_arrivee: "Lyon",
  adresse_arrivee: "Part-Dieu",
  date_depart: "2025-06-10",
  heure_depart: "08:00",
  heure_arrivee: "12:00",
  prix: 25,
  nombre_places: 3,
  bagages_autorises: true,
  utilisateur_id: 2,
  voiture: {
    marque: "Renault",
    modele: "Clio",
    couleur: "Bleu",
    energie: "Essence",
  },
};

const fakeConducteur = {
  photo: "",
  pseudo: "JeanD",
  prenom: "Jean",
  nom: "Dupont",
  note_moyenne: 4.7,
};

const fakePlacesReservees = 1;

const ReserverPage = () => {
  const { trajetId } = useParams();
  const navigate = useNavigate();

  // Remplace ces states par des fetch API réels
  const [trajet, setTrajet] = useState(null);
  const [conducteur, setConducteur] = useState(null);
  const [placesRestantes, setPlacesRestantes] = useState(0);
  const [hasReservation, setHasReservation] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    nombre_places: 1,
    bagages: false,
    commentaire: "",
  });

  useEffect(() => {
    // Simule le fetch des données
    setTrajet(fakeTrajet);
    setConducteur(fakeConducteur);
    setPlacesRestantes(fakeTrajet.nombre_places - fakePlacesReservees);
    setHasReservation(false); // À remplacer par un vrai check utilisateur
  }, [trajetId]);

  if (!trajet || !conducteur) return <div>Chargement...</div>;

  const dateDepart = new Date(trajet.date_depart).toLocaleDateString("fr-FR");
  const heureDepart = trajet.heure_depart?.slice(0, 5);
  const heureArrivee = trajet.heure_arrivee?.slice(0, 5) || "Non précisée";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nombre_places < 1) {
      setErrorMessage("Veuillez sélectionner au moins une place.");
      return;
    }
    if (form.nombre_places > placesRestantes) {
      setErrorMessage(`Il n'y a pas assez de places disponibles. Places restantes: ${placesRestantes}`);
      return;
    }
    // Ici, envoie la réservation à ton backend
    setReservationSuccess(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/trajets" className="text-green-700 hover:text-green-800">
            &larr; Retour aux trajets
          </Link>
        </div>

        {reservationSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <div className="flex items-center">
              <span className="mr-2">✔️</span>
              <div>
                <p className="font-bold">Réservation effectuée avec succès!</p>
                <p>Votre demande de réservation a été envoyée au conducteur. Vous recevrez une confirmation prochainement.</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Voir mes réservations
              </Link>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <div className="flex">
              <span className="mr-2">❗</span>
              <div>
                <p className="font-bold">Erreur</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {hasReservation && !reservationSuccess && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
            <div className="flex">
              <span className="mr-2">ℹ️</span>
              <div>
                <p className="font-bold">Vous avez déjà réservé ce trajet</p>
                <p>Vous pouvez consulter l'état de votre réservation dans la section "Mes réservations".</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Voir mes réservations
              </Link>
            </div>
          </div>
        )}

        {/* Détails du trajet */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Réservation de trajet</h1>
            <p className="text-lg">
              {trajet.ville_depart} → {trajet.ville_arrivee}
            </p>
            <p className="text-sm opacity-90">
              {dateDepart} - Départ à {heureDepart}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Infos trajet */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Détails du trajet</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex mb-4">
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">A</div>
                    </div>
                    <div className="ml-2">
                      <h3 className="font-medium">{trajet.ville_depart}</h3>
                      {trajet.adresse_depart && (
                        <p className="text-sm text-gray-600">{trajet.adresse_depart}</p>
                      )}
                      <p className="text-sm text-gray-500">{dateDepart} à {heureDepart}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">B</div>
                    </div>
                    <div className="ml-2">
                      <h3 className="font-medium">{trajet.ville_arrivee}</h3>
                      {trajet.adresse_arrivee && (
                        <p className="text-sm text-gray-600">{trajet.adresse_arrivee}</p>
                      )}
                      {trajet.heure_arrivee && (
                        <p className="text-sm text-gray-500">Arrivée estimée à {heureArrivee}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">Conducteur</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4 flex items-center justify-center">
                      {conducteur.photo ? (
                        <img src={conducteur.photo} alt="Photo de profil" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-green-700 text-xl">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {conducteur.pseudo || `${conducteur.prenom} ${conducteur.nom[0]}.`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {conducteur.note_moyenne ? `${conducteur.note_moyenne}/5` : "Nouveau conducteur"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Véhicule</h3>
                  <p className="text-gray-700">{trajet.voiture.marque} {trajet.voiture.modele}</p>
                  <p className="text-sm text-gray-600">{trajet.voiture.couleur} • {trajet.voiture.energie}</p>
                </div>
              </div>

              {/* Formulaire de réservation */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Votre réservation</h2>
                {placesRestantes <= 0 && !reservationSuccess ? (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                    <p className="font-bold">Trajet complet</p>
                    <p>Il n'y a plus de places disponibles pour ce trajet.</p>
                  </div>
                ) : (!hasReservation || reservationSuccess) && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-lg font-bold text-green-700">{trajet.prix.toFixed(2)} €</p>
                        <p className="text-sm text-gray-500">Par personne</p>
                      </div>
                      <div>
                        <span className="text-green-600">
                          {placesRestantes} place{placesRestantes > 1 ? "s" : ""} disponible{placesRestantes > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {!reservationSuccess && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">Nombre de places à réserver</label>
                          <select
                            name="nombre_places"
                            value={form.nombre_places}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {[...Array(Math.min(4, placesRestantes)).keys()].map((i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} place{i + 1 > 1 ? "s" : ""} ({(trajet.prix * (i + 1)).toFixed(2)} €)
                              </option>
                            ))}
                          </select>
                        </div>
                        {trajet.bagages_autorises && (
                          <div className="mb-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="bagages"
                                checked={form.bagages}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-gray-700">J'ai des bagages</span>
                            </label>
                          </div>
                        )}
                        <div className="mb-6">
                          <label className="block text-gray-700 font-medium mb-2">Message pour le conducteur (facultatif)</label>
                          <textarea
                            name="commentaire"
                            rows="3"
                            value={form.commentaire}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Informations supplémentaires, heure précise de rendez-vous..."
                          ></textarea>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-sm mb-2">Conditions de réservation</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Votre réservation doit être acceptée par le conducteur</li>
                            <li>• Le paiement s'effectue directement auprès du conducteur</li>
                            <li>• En cas d'annulation tardive, vous pourriez recevoir un avis négatif</li>
                          </ul>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                        >
                          Réserver maintenant
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserverPage;