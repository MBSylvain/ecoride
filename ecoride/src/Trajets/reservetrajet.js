import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import checkAuth from "../features/checkAuth";

const ReserverPage = () => {
  const { trajetId } = useParams();
  const navigate = useNavigate();
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [trajet, setTrajet] = useState(null);
  const [conducteur, setConducteur] = useState(null);
  const [placesRestantes, setPlacesRestantes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasReservation, setHasReservation] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    nombre_places: 1,
    bagages: false,
    commentaire: "",
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsLoading(true);
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchTrajetDetails = async () => {
      setIsLoading(true);
      try {
        const trajetResponse = await axios.get(
          `http://localhost/api/Controllers/TrajetController.php?trajet_id=${trajetId}`,
          { withCredentials: true, responseType: "json" }
        );
        const trajetData = trajetResponse.data.trajet || trajetResponse.data.data || trajetResponse.data;
        setTrajet(trajetData);

        const conducteur_Id = trajetData.utilisateur_id;
        if (conducteur_Id) {
          const conducteurResponse = await axios.get(
            `http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${conducteur_Id}`,
            { withCredentials: true, responseType: "json" }
          );
          const conducteurData = conducteurResponse.data.utilisateur || conducteurResponse.data;
          setConducteur(conducteurData);
        }

        const placesOccupeesResponse = await axios.get(
          `http://localhost/api/Controllers/ReservationController.php?trajet_id=${trajetId}`,
          { withCredentials: true, responseType: "json" }
        );
        const placesOccupees = placesOccupeesResponse.data.placesoccupees || 0;
        const totalPlaces = trajetData.nombre_places || 0;
        const restantes = Math.max(0, totalPlaces - placesOccupees);
        setPlacesRestantes(restantes);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Erreur inconnue");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (trajetId) {
      fetchTrajetDetails();
    } else {
      setErrorMessage("Identifiant de trajet manquant");
      setIsLoading(false);
    }
  }, [trajetId, utilisateur_id]);

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

    try {
      const response = await axios.post(
        `http://localhost/api/Controllers/ReservationController.php`,
        {
          utilisateur_id: utilisateur_id,
          trajet_id: trajetId,
          nombre_places_reservees: form.nombre_places,
          commentaire: form.commentaire,
          bagages: form.bagages ? 1 : 0,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.success) {
        setReservationSuccess(true);
        setHasReservation(true);
      } else {
        setErrorMessage(response.data?.message || "Erreur lors de la création de la réservation");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(`Erreur: ${error.message}`);
      }
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-customGrey-100">
      <div className="text-center">
        <div className="inline-block w-8 h-8 mb-2 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
        <p className="text-base leading-relaxed text-gray-600">Chargement des informations...</p>
      </div>
    </div>
  );

  if (!trajet && !isLoading) return (
    <div className="min-h-screen py-8 bg-customGrey-100">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center p-4 mb-6 text-white bg-red-500 rounded-lg shadow-md">
          <p className="mb-2 text-xl font-bold">Trajet introuvable</p>
          <p>Ce trajet n'existe pas ou a été supprimé.</p>
          <Link to="/search" className="mt-2 text-white underline hover:text-customPink-100">
            Retour à la recherche
          </Link>
        </div>
      </div>
    </div>
  );

  const dateDepart = trajet?.date_depart ? new Date(trajet.date_depart.split(' ')[0]).toLocaleDateString("fr-FR") : "";
  const heureDepart = trajet?.date_depart?.split(' ')[1]?.slice(0, 5) || trajet?.heure_depart?.slice(0, 5) || "Non précisée";
  const heureArrivee = trajet?.heure_arrivee?.slice(0, 5) || "Non précisée";
  const safeNumPlaces = Math.max(0, Math.min(4, placesRestantes));

  return (
    <div className="min-h-screen py-8 bg-customGrey-100">
      <div className="container px-4 mx-auto">
        <div className="mb-6">
          <Link to="/search" className="font-semibold text-customGreen2-100 hover:text-customGreen-100">
            &larr; Retour à la recherche
          </Link>
        </div>

        {reservationSuccess && (
          <div className="flex flex-col items-center p-4 mb-6 text-white rounded-lg shadow-md bg-customGreen2-100">
            <span className="mb-2 text-2xl">✔️</span>
            <p className="text-lg font-bold text-center">Réservation effectuée avec succès!</p>
            <p className="text-center">Votre demande de réservation a été envoyée au conducteur. Vous recevrez une confirmation prochainement.</p>
            <Link to="/dashboard" className="px-4 py-2 mt-4 font-bold text-white rounded-md shadow-md bg-primary-100 hover:bg-customPink-100">
              Voir mes réservations
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center p-4 mb-6 text-white bg-red-500 rounded-lg shadow-md">
            <span className="mr-2 text-2xl">❗</span>
            <div>
              <p className="font-bold">Attention</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {hasReservation && !reservationSuccess && (
          <div className="flex flex-col items-center p-4 mb-6 text-white rounded-lg shadow-md bg-primary-100">
            <span className="mb-2 text-2xl">ℹ️</span>
            <p className="font-bold text-center">Vous avez déjà réservé ce trajet</p>
            <p className="text-center">Vous pouvez consulter l'état de votre réservation dans la section "Mes réservations".</p>
            <Link to="/dashboard" className="px-4 py-2 mt-4 font-bold text-white rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100">
              Voir mes réservations
            </Link>
          </div>
        )}

        {/* Détails du trajet */}
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="p-6 text-white rounded-t-lg bg-primary-100">
            <h1 className="mb-2 text-2xl font-bold">Réservation de trajet</h1>
            <p className="text-lg">{trajet.ville_depart} → {trajet.ville_arrivee}</p>
            <p className="text-sm opacity-90">{dateDepart} - Départ à {heureDepart}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Infos trajet */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-primary-100">Détails du trajet</h2>
                <div className="p-4 mb-4 rounded-lg bg-customGrey-100">
                  <div className="flex mb-4">
                    <div className="flex justify-center flex-shrink-0 w-8">
                      <div className="flex items-center justify-center w-6 h-6 text-xs text-white rounded-full bg-customGreen2-100">A</div>
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
                    <div className="flex justify-center flex-shrink-0 w-8">
                      <div className="flex items-center justify-center w-6 h-6 text-xs text-white rounded-full bg-customPink-100">B</div>
                    </div>
                    <div className="ml-2">
                      <h3 className="font-medium">{trajet.ville_arrivee}</h3>
                      {trajet.adresse_arrivee && (
                        <p className="text-sm text-gray-600">{trajet.adresse_arrivee}</p>
                      )}
                      {heureArrivee !== "Non précisée" && (
                        <p className="text-sm text-gray-500">Arrivée estimée à {heureArrivee}</p>
                      )}
                    </div>
                  </div>
                </div>

                {conducteur && (
                  <div className="p-4 mb-4 rounded-lg bg-customGrey-100">
                    <h3 className="mb-2 font-medium text-primary-100">Conducteur</h3>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 overflow-hidden bg-gray-200 rounded-full">
                        {conducteur.photo ? (
                          <img src={conducteur.photo} alt="Photos de profil" className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-xl text-primary-100">👤</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {conducteur.pseudo || `${conducteur.prenom || ''} ${conducteur.nom ? conducteur.nom[0] + '.' : ''}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {conducteur.note_moyenne ? `${conducteur.note_moyenne}/5` : "Nouveau conducteur"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {trajet.voiture && (
                  <div className="p-4 rounded-lg bg-customGrey-100">
                    <h3 className="mb-2 font-medium text-primary-100">Véhicule</h3>
                    <p className="text-gray-700">{trajet.voiture.marque} {trajet.voiture.modele}</p>
                    <p className="text-sm text-gray-600">{trajet.voiture.couleur} • {trajet.voiture.energie}</p>
                  </div>
                )}
              </div>

              {/* Formulaire de réservation */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-primary-100">Votre réservation</h2>
                {placesRestantes <= 0 && !reservationSuccess ? (
                  <div className="p-4 text-yellow-700 bg-yellow-400 rounded-lg shadow-md">
                    <p className="font-bold">Trajet complet</p>
                    <p>Il n'y a plus de places disponibles pour ce trajet.</p>
                  </div>
                ) : (!hasReservation || reservationSuccess) && (
                  <div className="p-4 mb-4 rounded-lg bg-customGrey-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-primary-100">{parseFloat(trajet.prix).toFixed(2)} €</p>
                        <p className="text-sm text-primary-100">Par personne</p>
                      </div>
                      <div>
                        <span className="font-semibold text-customGreen-100">
                          {placesRestantes} place{placesRestantes > 1 ? "s" : ""} disponible{placesRestantes > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {!reservationSuccess && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="block mb-2 font-semibold text-primary-100">Nombre de places à réserver</label>
                          <select
                            name="nombre_places"
                            value={form.nombre_places}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen2-100"
                          >
                            {[...Array(safeNumPlaces).keys()].map((i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} place{i + 1 > 1 ? "s" : ""} ({(parseFloat(trajet?.prix || 0) * (i + 1)).toFixed(2)} €)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="bagages"
                              checked={form.bagages}
                              onChange={handleChange}
                              className="w-4 h-4 border-gray-300 rounded text-customGreen2-100 focus:ring-customGreen2-100"
                            />
                            <span className="ml-2 text-gray-700">J'ai des bagages</span>
                          </label>
                        </div>
                        <div className="mb-6">
                          <label className="block mb-2 font-semibold text-primary-100">Message pour le conducteur (facultatif)</label>
                          <textarea
                            name="commentaire"
                            rows="3"
                            value={form.commentaire}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen2-100"
                            placeholder="Informations supplémentaires, heure précise de rendez-vous..."
                          ></textarea>
                        </div>
                        <div className="p-4 mb-4 rounded-lg bg-customGrey-100">
                          <h4 className="mb-2 text-sm font-semibold text-primary-100">Conditions de réservation</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Votre réservation doit être acceptée par le conducteur</li>
                            <li>• Le paiement s'effectue directement auprès du conducteur</li>
                            <li>• En cas d'annulation tardive, vous pourriez recevoir un avis négatif</li>
                          </ul>
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-md bg-primary-100 hover:bg-customPink-100"
                          disabled={!utilisateur_id}
                        >
                          Réserver maintenant
                        </button>
                        {!utilisateur_id && (
                          <p className="mt-2 text-sm text-red-600">Vous devez être connecté pour réserver un trajet.</p>
                        )}
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