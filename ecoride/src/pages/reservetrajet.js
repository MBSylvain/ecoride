import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ReserverPage = () => {
  // Correction de la faute de frappe dans le nom du paramètre
  const { trajetId } = useParams();
  const navigate = useNavigate();
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");

  // States pour les données et l'UI
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

  // Récupération des données du trajet et du conducteur
  useEffect(() => {
    const fetchTrajetDetails = async () => {
      setIsLoading(true);
      console.log("Tentative de chargement du trajet ID:", trajetId);
      
      // 1. Récupération des détails du trajet
      try {
        
        const trajetResponse  = await axios.get(`http://localhost/api/Controllers/TrajetController.php?trajet_id=${trajetId}`);
        
        console.log("Réponse trajet:", trajetResponse.data);
        
        if (!trajetResponse.data) {
          throw new Error("Aucune donnée reçue pour ce trajet");
        }
        
        // Récupérer les données du trajet, quelle que soit la structure
        const trajetData = trajetResponse.data.trajet || trajetResponse.data.data || trajetResponse.data;
        console.log("Données du trajet:", trajetData);
        setTrajet(trajetData);
        
        // 2. Récupération des détails du conducteur - CORRIGÉ
        const conducteur_Id = trajetData.utilisateur_id;
        console.log("ID du conducteur:", conducteur_Id);
        if (conducteur_Id) {
          const conducteurResponse = await axios.get(`http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${conducteur_Id}`);
          
          console.log("Réponse conducteur:", conducteurResponse.data);
          const conducteurData = conducteurResponse.data.utilisateur || conducteurResponse.data;
          setConducteur(conducteurData);
        }
        
        // 3. Calcul des places restantes - CORRIGÉ
                
        let placesOccupees = 0;
        if (trajetResponse.data) {
          const reservations = Array.isArray(trajetResponse.data) 
            ? trajetResponse.data
            : (trajetResponse.data.reservations || []);
          
          // Calcul des places réservées avec validation
          placesOccupees = reservations
            .filter(r => r.statut && r.statut.toLowerCase() !== "annulé" && r.statut.toLowerCase() !== "refusé")
            .reduce((sum, r) => sum + parseInt(r.nombre_places_reservees || 1), 0);
          
          // Vérifie si l'utilisateur connecté a déjà une réservation
          const userReservation = reservations.find(r => r.utilisateur_id == utilisateur_id);
          setHasReservation(!!userReservation);
        } else {
          // Default if no reservation data
          placesOccupees = 0;
        }
        
        // Calcul sécurisé des places restantes
        const totalPlaces = parseInt(trajetData.nombre_places || 0);
        setPlacesRestantes(Math.max(0, totalPlaces - placesOccupees));
      } catch (error) {
        console.error("Erreur détaillée:", error);
        if (error.response) {
          console.error("Statut:", error.response.status);
          console.error("Données:", error.response.data);
        }
        setErrorMessage(`Erreur lors du chargement: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (trajetId) {
      fetchTrajetDetails();
    } else {
      console.error("Aucun ID de trajet fourni");
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
      console.log("Tentative de création de réservation pour le trajet:", trajetId);
      
      
      // Ajout de l'utilisateur_id dans la requête POST
      const response = await axios.post(`http://localhost/api/Controllers/ReservationController.php`, {
          
          utilisateur_id: utilisateur_id,
          trajet_id: trajetId,
          nombre_places_reservees: form.nombre_places,
          commentaire: form.commentaire,
          bagages: form.bagages ? 1 : 0,
          
        },
        {
          responseType: 'json',
                  headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      
      console.log("Réponse de création de réservation:", response.data);
      
      if (response.data && response.data.success) {
        setReservationSuccess(true);
        setHasReservation(true);
      } else {
        setErrorMessage(response.data?.message || "Erreur lors de la création de la réservation");
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la réservation:", error);
      if (error.response) {
        console.error("Statut:", error.response.status);
        console.error("Données:", error.response.data);
      }
      setErrorMessage(`Erreur: ${error.message}`);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-gray-100">
      <div className="text-center">
        <div className="inline-block w-8 h-8 mb-2 border-b-2 border-green-700 rounded-full animate-spin"></div>
        <p>Chargement des informations...</p>
      </div>
    </div>
  );

  if (!trajet && !isLoading) return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          <p className="font-bold">Trajet introuvable</p>
          <p>Ce trajet n'existe pas ou a été supprimé.</p>
          <Link to="/search" className="block mt-2 text-red-700 hover:underline">
            Retour à la recherche
          </Link>
        </div>
      </div>
    </div>
  );

  // Protection contre les erreurs de formatage
  const dateDepart = trajet?.date_depart ? new Date(trajet.date_depart.split(' ')[0]).toLocaleDateString("fr-FR") : "";
  const heureDepart = trajet?.date_depart?.split(' ')[1]?.slice(0, 5) || trajet?.heure_depart?.slice(0, 5) || "Non précisée";
  const heureArrivee = trajet?.heure_arrivee?.slice(0, 5) || "Non précisée";

  // Sécurisation pour le nombre de places à afficher
  const safeNumPlaces = Math.max(0, Math.min(4, placesRestantes));

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        <div className="mb-6">
          <Link to="/search" className="text-customGreen2-100 hover:text-green-800">
            &larr; Retour à la recherche
          </Link>
        </div>

        {reservationSuccess && (
          <div className="p-4 mb-6 text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
              <span className="mr-2">✔️</span>
              <div>
                <p className="font-bold">Réservation effectuée avec succès!</p>
                <p>Votre demande de réservation a été envoyée au conducteur. Vous recevrez une confirmation prochainement.</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard" className="inline-block px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
                Voir mes réservations
              </Link>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
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
          <div className="p-4 mb-6 text-blue-700 bg-blue-100 border-l-4 border-blue-500 rounded">
            <div className="flex">
              <span className="mr-2">ℹ️</span>
              <div>
                <p className="font-bold">Vous avez déjà réservé ce trajet</p>
                <p>Vous pouvez consulter l'état de votre réservation dans la section "Mes réservations".</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard" className="inline-block px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700">
                Voir mes réservations
              </Link>
            </div>
          </div>
        )}

        {/* Détails du trajet */}
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="p-6 text-white bg-gradient-to-r from-customGreen2-20 to-customGreen-100">
            <h1 className="mb-2 text-2xl font-bold">Réservation de trajet</h1>
            <p className="text-lg">
              {trajet.ville_depart} → {trajet.ville_arrivee}
            </p>
            <p className="text-sm opacity-90">
              {dateDepart} - Départ à {heureDepart}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Infos trajet */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-customGreen-80">Détails du trajet</h2>
                <div className="p-4 mb-4 rounded-lg bg-gray-50">
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
                      <div className="flex items-center justify-center w-6 h-6 text-xs text-white rounded-full bg-customPink-80">B</div>
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
                  <div className="p-4 mb-4 rounded-lg bg-gray-50">
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
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="mb-2 font-medium">Véhicule</h3>
                    <p className="text-gray-700">{trajet.voiture.marque} {trajet.voiture.modele}</p>
                    <p className="text-sm text-gray-600">{trajet.voiture.couleur} • {trajet.voiture.energie}</p>
                  </div>
                )}
              </div>

              {/* Formulaire de réservation */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-primarr=y-100">Votre réservation</h2>
                {placesRestantes <= 0 && !reservationSuccess ? (
                  <div className="p-4 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
                    <p className="font-bold">Trajet complet</p>
                    <p>Il n'y a plus de places disponibles pour ce trajet.</p>
                  </div>
                ) : (!hasReservation || reservationSuccess) && (
                  <div className="p-4 mb-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-primary-80">{parseFloat(trajet.prix).toFixed(2)} €</p>
                        <p className="text-sm text-primary-50">Par personne</p>
                      </div>
                      <div>
                        <span className="text-customGreen-100">
                          {placesRestantes} place{placesRestantes > 1 ? "s" : ""} disponible{placesRestantes > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {!reservationSuccess && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium text-customGreen-100">Nombre de places à réserver</label>
                          <select
                            name="nombre_places"
                            value={form.nombre_places}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="ml-2 text-gray-700">J'ai des bagages</span>
                          </label>
                        </div>
                        <div className="mb-6">
                          <label className="block mb-2 font-medium text-primary-80">Message pour le conducteur (facultatif)</label>
                          <textarea
                            name="commentaire"
                            rows="3"
                            value={form.commentaire}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Informations supplémentaires, heure précise de rendez-vous..."
                          ></textarea>
                        </div>
                        <div className="p-4 mb-4 bg-gray-100 rounded-lg">
                          <h4 className="mb-2 text-sm font-medium">Conditions de réservation</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Votre réservation doit être acceptée par le conducteur</li>
                            <li>• Le paiement s'effectue directement auprès du conducteur</li>
                            <li>• En cas d'annulation tardive, vous pourriez recevoir un avis négatif</li>
                          </ul>
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg bg-primary-100 hover:bg-customPink-80"
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