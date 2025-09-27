import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const VisualiserTrajets = () => {
  // Fonction pour mettre à jour le statut d'une réservation
  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      await axios.post(`http://localhost/api/Controllers/ReservationController.php`, {
        reservation_id: reservationId,
        statut: newStatus
      });
      // Mettre à jour l'affichage localement (rafraîchir les réservations)
      if (selectedTrajet) {
        // Recharge les réservations pour ce trajet
        const res = await axios.get(`http://localhost/api/Controllers/ReservationController.php?trajet_id=${selectedTrajet.trajet_id}`);
        let reservationsList = [];
        if (res.data && Array.isArray(res.data)) {
          reservationsList = res.data;
        } else if (res.data && Array.isArray(res.data.reservations)) {
          reservationsList = res.data.reservations;
        }
        setReservations(reservationsList);
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut de la réservation");
    }
  };
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("utilisateur.id");

  useEffect(() => {
    const fetchTrajets = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`,
                { withCredentials: true },
                { headers: { 'Content-Type': 'application/json' } }
            );
            // Si la réponse est un tableau directement
            if (Array.isArray(response.data)) {
                setTrajets(response.data);
                console.log("Trajets:", response.data);
            } else if (response.data && Array.isArray(response.data.trajets)) {
                setTrajets(response.data.trajets);
                console.log("Trajets:", response.data.trajets);
            } else {
                setTrajets([]);
                console.log("Aucun trajet trouvé ou format de réponse incorrect");
            }
        } catch (err) {
            setError("Erreur lors du chargement des trajets");
            console.error(err);
            setTrajets([]);
        } finally {
            setLoading(false);
        }
    };
    fetchTrajets();
  }, []);

  // Récupérer les infos utilisateur quand selectedTrajet change
  useEffect(() => {
    if (selectedTrajet) {
      setUserLoading(true);
      setUserError(null);
      setUserInfo(null);
      setReservations([]);
      setPassengers([]);
      setReservationsLoading(true);
      setReservationsError(null);
      // 1. Charger infos conducteur
      axios.get(`http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${selectedTrajet.utilisateur_id}`,
        { withCredentials: true },
        { headers: { 'Content-Type': 'application/json' } }
      )
        .then(res => {
          console.log('Réponse API conducteur:', res.data);
          // Vérifier si la réponse contient un objet utilisateur ou un tableau
            if (Array.isArray(res.data) && res.data.length > 0) {
                setUserInfo(res.data[0]); // Prendre le premier utilisateur si c'est un tableau
            } else if (res.data && res.data.utilisateur) {
                setUserInfo(res.data.utilisateur); // Si la réponse contient un objet utilisateur
            } else if (res.data && typeof res.data === 'object') {
                setUserInfo(res.data); // Si c'est directement un objet utilisateur
            } else {
                setUserInfo(null);
                setUserError("Aucune donnée utilisateur trouvée pour l'ID " + selectedTrajet.utilisateur_id);
            }
          
        })
        .catch((err) => {
          setUserError("Erreur lors du chargement des infos utilisateur");
          console.error('Erreur API conducteur:', err);
        })
        .finally(() => setUserLoading(false));

      // 2. Charger les réservations du trajet
      axios.get(`http://localhost/api/Controllers/ReservationController.php?trajet_id=${selectedTrajet.trajet_id}`,
        { withCredentials: true },
        { headers: { 'Content-Type': 'application/json' } }
      )
        .then(res => {
          let reservationsList = [];
          if (res.data && Array.isArray(res.data)) {
            reservationsList = res.data;
          } else if (res.data && Array.isArray(res.data.reservations)) {
            reservationsList = res.data.reservations;
          }
          setReservations(reservationsList);
          // 3. Charger les infos utilisateurs pour chaque réservation
          if (reservationsList.length > 0) {
            Promise.all(reservationsList.map(r =>
              axios.get(`http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${r.utilisateur_id}`,
                { withCredentials: true },
                { headers: { 'Content-Type': 'application/json' } }
              )
                .then(uRes => {
                  console.log('Réponse API passager:', uRes.data);
                  if (Array.isArray(uRes.data) && uRes.data.length > 0) {
                    return uRes.data[0]; // Prendre le premier utilisateur si c'est un tableau
                  } else if (uRes.data && uRes.data.utilisateur) {
                    return uRes.data.utilisateur; // Si la réponse contient un objet utilisateur
                  } else if (uRes.data && typeof uRes.data === 'object') {
                    return uRes.data; // Si c'est directement un objet utilisateur
                  }
                  return null;
                })
                .catch((err) => {
                  console.error('Erreur API passager:', err);
                  return null;
                })
            )).then(passengerList => {
              setPassengers(passengerList.filter(Boolean));
            });
          } else {
            setPassengers([]);
          }
        })
        .catch(() => {
          setReservationsError("Erreur lors du chargement des réservations");
          setPassengers([]);
        })
        .finally(() => setReservationsLoading(false));
    } else {
      setUserInfo(null);
      setUserError(null);
      setUserLoading(false);
      setReservations([]);
      setReservationsError(null);
      setReservationsLoading(false);
      setPassengers([]);
    }
  }, [selectedTrajet]);

return (
    <div className="p-6 mb-6 bg-white border border-gray-100 shadow-lg rounded-xl">
        <h2 className="mb-6 text-2xl font-semibold text-center">Tous les trajets</h2>
        {loading ? (
            <div className="py-4 text-center text-gray-500">Chargement des trajets...</div>
        ) : error ? (
            <div className="py-4 text-center text-red-500">{error}</div>
        ) : trajets.length === 0 ? (
            <div className="py-4 text-center text-gray-500">Aucun trajet trouvé.</div>
        ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trajets.map((trajet) => (
                    <div key={trajet.trajet_id} className="flex flex-col p-5 transition-all duration-200 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">{trajet.ville_depart} → {trajet.ville_arrivee}</h3>
                            <span className="font-bold text-green-600">{trajet.prix} €</span>
                        </div>
                        <div className="mb-3 text-gray-600">{trajet.date_depart}</div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                                {trajet.nombre_places} place(s)
                            </span>
                        </div>
                        <button
                            className="px-4 py-2 mt-auto text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                            onClick={() => setSelectedTrajet(trajet)}
                        >
                            Voir les détails
                        </button>
                    </div>
                ))}
            </div>
        )}
        
        {/* Détails du trajet (responsive, sans modal) */}
        {selectedTrajet && (
            <div className="pt-6 mt-8 border-t">
                <div className="max-w-full p-6 bg-white border border-gray-100 shadow-md rounded-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-semibold">Détail de la réservation</h3>
                        <button
                            className="px-3 py-1 text-sm text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
                            onClick={() => setSelectedTrajet(null)}
                        >
                            Fermer
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-4 rounded-lg bg-gray-50">
                            <h4 className="mb-3 font-semibold text-gray-800">Informations du trajet</h4>
                            <ul className="space-y-2">
                                <li><b>Départ :</b> {selectedTrajet.ville_depart}</li>
                                <li><b>Arrivée :</b> {selectedTrajet.ville_arrivee}</li>
                                <li><b>Date :</b> {selectedTrajet.date_depart}</li>
                                <li><b>Heure :</b> {selectedTrajet.heure_depart}</li>
                                <li><b>Prix :</b> {selectedTrajet.prix} €</li>
                                <li><b>Places :</b> {selectedTrajet.nombre_places}</li>
                                <li><b>Description :</b> {selectedTrajet.description || 'Aucune'}</li>
                                <li><b>Bagages autorisés :</b> {selectedTrajet.bagages_autorises === "1" ? "Oui" : "Non"}</li>
                                <li><b>Fumeur autorisé :</b> {selectedTrajet.fumeur_autorise === "1" ? "Oui" : "Non"}</li>
                                <li><b>Animaux autorisés :</b> {selectedTrajet.animaux_autorises === "1" ? "Oui" : "Non"}</li>
                                <li><b>Statut :</b> {selectedTrajet.statut}</li>
                            </ul>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gray-50">
                            <h4 className="mb-3 font-semibold text-gray-800">Informations sur le conducteur</h4>
                            {userLoading ? (
                                <div className="text-gray-500">Chargement des infos utilisateur...</div>
                            ) : userError ? (
                                <div className="text-red-500">{userError}</div>
                            ) : userInfo ? (
                                <ul className="space-y-2">
                                    <li><b>Nom :</b> {userInfo.nom || '-'}</li>
                                    <li><b>Prénom :</b> {userInfo.prenom || '-'}</li>
                                    <li><b>Email :</b> {userInfo.email || '-'}</li>
                                    <li><b>Téléphone :</b> {userInfo.telephone || '-'}</li>
                                    <li><b>Adresse :</b> {userInfo.adresse || '-'}</li>
                                    <li><b>Date de naissance :</b> {userInfo.date_naissance || '-'}</li>
                                    <li><b>Pseudo :</b> {userInfo.pseudo || '-'}</li>
                                </ul>
                            ) : (
                                <div className="text-gray-500">Aucune information utilisateur trouvée.</div>
                            )}
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gray-50 md:col-span-2 lg:col-span-1">
                            <h4 className="mb-3 font-semibold text-gray-800">Passagers</h4>
                            {reservationsLoading ? (
                                <div className="text-gray-500">Chargement des réservations...</div>
                            ) : reservationsError ? (
                                <div className="text-red-500">{reservationsError}</div>
                            ) : passengers.length > 0 ? (
                                <div className="space-y-4">
                                    {passengers.map((p, idx) => (
                                        <div key={p.utilisateur_id || idx} className="p-3 border border-gray-200 rounded-lg">
                                            <b>Nom :</b> {p.nom || '-'}<br />
                                            <b>Prénom :</b> {p.prenom || '-'}<br />
                                            <b>Email :</b> {p.email || '-'}<br />
                                            <b>Téléphone :</b> {p.telephone || '-'}<br />
                                            <b>Adresse :</b> {p.adresse || '-'}<br />
                                            <b>Date de naissance :</b> {p.date_naissance || '-'}<br />
                                            <b>Pseudo :</b> {p.pseudo || '-'}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500">Aucun passager pour ce trajet.</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Zone de message et boutons */}
                    <div className="p-4 mt-6 border border-gray-200 rounded-lg">
                        <h4 className="mb-3 font-semibold text-gray-800">Message</h4>
                        <textarea 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            rows="4"
                            placeholder="Saisissez votre message ici..."
                        ></textarea>
                        
                        <div className="flex justify-between mt-4">
                            <div className="space-x-3">
                                {/* Exemple : on prend la première réservation du trajet pour la démo */}
                                <button
                                    className="px-5 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                                    onClick={() => {
                                      if (reservations.length > 0) {
                                        handleUpdateReservationStatus(reservations[0].reservation_id, 'validée');
                                      } else {
                                        alert('Aucune réservation à valider');
                                      }
                                    }}
                                >
                                    Valider
                                </button>
                                <button
                                    className="px-5 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                                    onClick={() => {
                                      if (reservations.length > 0) {
                                        handleUpdateReservationStatus(reservations[0].reservation_id, 'annulée');
                                      } else {
                                        alert('Aucune réservation à annuler');
                                      }
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                            
                            <button
                                className="px-5 py-2 text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
                                onClick={() => setSelectedTrajet(null)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default VisualiserTrajets;
