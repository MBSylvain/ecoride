import axios from 'axios';
import { useEffect, useState } from 'react';

const STATUTS = ["tous", "confirmé", "en_attente", "annulée", "terminée"];

const VisualiserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [statutFilter, setStatutFilter] = useState("tous");
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("utilisateur.id");

  // Charger les réservations de l'utilisateur
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost/api/Controllers/ReservationController.php?utilisateur_id=${utilisateur_id}`,
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
        if (Array.isArray(response.data)) {
          setReservations(response.data);
        } else if (response.data && Array.isArray(response.data.reservations)) {
          setReservations(response.data.reservations);
        } else {
          setReservations([]);
        }
      } catch (err) {
        setError("Erreur lors du chargement des réservations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [utilisateur_id]);

  // Charger les informations utilisateur pour une réservation sélectionnée
  useEffect(() => {
    if (selectedReservation) {
      setUserLoading(true);
      setUserError(null);
      setUserInfo(null);

      axios.get(
        `http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${selectedReservation.utilisateur_id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      )
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setUserInfo(res.data[0]);
          } else if (res.data && res.data.utilisateur) {
            setUserInfo(res.data.utilisateur);
          } else if (res.data && typeof res.data === 'object') {
            setUserInfo(res.data);
          } else {
            setUserInfo(null);
            setUserError("Aucune donnée utilisateur trouvée pour l'ID " + selectedReservation.utilisateur_id);
          }
        })
        .catch((err) => {
          setUserError("Erreur lors du chargement des infos utilisateur");
          console.error(err);
        })
        .finally(() => setUserLoading(false));
    } else {
      setUserInfo(null);
      setUserError(null);
      setUserLoading(false);
    }
  }, [selectedReservation]);

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }
    try {
      await axios.put(
        `http://localhost/api/Controllers/ReservationController.php`,
        { reservation_id: reservationId, statut: "annulée" },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((res) =>
          res.reservation_id === reservationId ? { ...res, statut: "annulée" } : res
        )
      );
    } catch (error) {
      alert("Erreur lors de l'annulation de la réservation");
      console.error(error);
    }
  };

  // Filtrage des réservations selon le statut sélectionné
  const filteredReservations = statutFilter === "tous"
    ? reservations
    : reservations.filter(r => r.statut === statutFilter);

  return (
    <div className="p-6 mb-6 bg-white border border-gray-100 shadow-lg rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center">Mes Réservations</h2>

      {/* Filtres par statut */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {STATUTS.map((statut) => (
          <button
            key={statut}
            className={`px-4 py-1 rounded-full border transition ${
              statutFilter === statut
                ? "bg-customGreen-100 text-white border-customGreen-100"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-customGreen-50"
            }`}
            onClick={() => setStatutFilter(statut)}
          >
            {statut.charAt(0).toUpperCase() + statut.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-4 text-center text-gray-500">Chargement des réservations...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-500">{error}</div>
      ) : filteredReservations.length === 0 ? (
        <div className="py-4 text-center text-gray-500">Aucune réservation trouvée.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className="flex flex-col p-5 transition-all duration-200 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                  {reservation.ville_depart} → {reservation.ville_arrivee}
                </h3>
                <span className="font-bold text-green-600">{reservation.prix} €</span>
              </div>
              <div className="mb-3 text-gray-600">{reservation.date_depart}</div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                  {reservation.nombre_places_reservees} place(s)
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    reservation.statut === "confirmé"
                      ? "bg-green-100 text-green-800"
                      : reservation.statut === "annulée"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {reservation.statut}
                </span>
              </div>
              <button
                className="px-4 py-2 mt-auto text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => setSelectedReservation(reservation)}
              >
                Voir les détails
              </button>
              {reservation.statut === "en_attente" && (
                <button
                  className="px-4 py-2 mt-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                  onClick={() => handleCancelReservation(reservation.reservation_id)}
                >
                  Annuler
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedReservation && (
        <div className="pt-6 mt-8 border-t">
          <div className="max-w-full p-6 bg-white border border-gray-100 shadow-md rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">Détail de la réservation</h3>
              <button
                className="px-3 py-1 text-sm text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
                onClick={() => setSelectedReservation(null)}
              >
                Fermer
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-3 font-semibold text-gray-800">Informations de la réservation</h4>
                <ul className="space-y-2">
                  <li><b>Départ :</b> {selectedReservation.ville_depart}</li>
                  <li><b>Arrivée :</b> {selectedReservation.ville_arrivee}</li>
                  <li><b>Date :</b> {selectedReservation.date_depart}</li>
                  <li><b>Prix :</b> {selectedReservation.prix} €</li>
                  <li><b>Places réservées :</b> {selectedReservation.nombre_places_reservees}</li>
                  <li><b>Statut :</b> {selectedReservation.statut}</li>
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
                  </ul>
                ) : (
                  <div className="text-gray-500">Aucune information utilisateur trouvée.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualiserReservations;