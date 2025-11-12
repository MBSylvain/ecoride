import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from './Modal';

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

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api-ecride-production.up.railway.app/api/Controllers/ReservationController.php?utilisateur_id=${utilisateur_id}`,
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
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [utilisateur_id]);

  useEffect(() => {
    if (selectedReservation) {
      setUserLoading(true);
      setUserError(null);
      setUserInfo(null);

      axios.get(
        `https://api-ecride-production.up.railway.app/api/Controllers/UtilisateurController.php?utilisateur_id=${selectedReservation.utilisateur_id}`,
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
        .catch(() => {
          setUserError("Erreur lors du chargement des infos utilisateur");
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
        `https://api-ecride-production.up.railway.app/api/Controllers/ReservationController.php`,
        { reservation_id: reservationId, statut: "annulée" },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((res) =>
          res.reservation_id === reservationId ? { ...res, statut: "annulée" } : res
        )
      );
    } catch {
      alert("Erreur lors de l'annulation de la réservation");
    }
  };

  const filteredReservations = statutFilter === "tous"
    ? reservations
    : reservations.filter(r => r.statut === statutFilter);

  return (
    <div className="w-full p-6 mb-6 font-sans bg-white border border-gray-100 shadow-lg rounded-xl">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Mes Réservations</h2>
      {/* Filtres par statut */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {STATUTS.map((statut) => (
          <button
            key={statut}
            className={`px-4 py-1 rounded-full border font-semibold transition-colors ${
              statutFilter === statut
                ? "bg-customGreen-100 text-white border-customGreen-100"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-customGreen2-100 hover:text-white"
            }`}
            onClick={() => setStatutFilter(statut)}
          >
            {statut.charAt(0).toUpperCase() + statut.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement des réservations...</span>
        </div>
      ) : error ? (
        <div className="py-4 font-semibold text-center text-white bg-red-500 rounded-md shadow-md">{error}</div>
      ) : filteredReservations.length === 0 ? (
        <div className="py-4 text-center text-gray-600 rounded-md bg-customGrey-100">Aucune réservation trouvée.</div>
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className="flex flex-col p-5 transition-all duration-200 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-100">
                  {reservation.ville_depart} → {reservation.ville_arrivee}
                </h3>
                <span className="font-bold text-customGreen2-100">{reservation.prix} €</span>
              </div>
              <div className="mb-3 text-gray-600">{reservation.date_depart}</div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-sm font-semibold rounded-full text-primary-100 bg-customGrey-100">
                  {reservation.nombre_places_reservees} place(s)
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-bold ${
                    reservation.statut === "confirmé"
                      ? "bg-customGreen2-100 text-white"
                      : reservation.statut === "annulée"
                      ? "bg-red-500 text-white"
                      : reservation.statut === "en_attente"
                      ? "bg-yellow-400 text-black"
                      : "bg-primary-100 text-white"
                  }`}
                >
                  {reservation.statut}
                </span>
              </div>
              <button
                className="px-4 py-2 mt-auto font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                onClick={() => setSelectedReservation(reservation)}
              >
                Voir les détails
              </button>
              {reservation.statut === "en_attente" && (
                <button
                  className="px-4 py-2 mt-2 font-bold text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
                  onClick={() => handleCancelReservation(reservation.reservation_id)}
                >
                  Annuler
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title="Détail de la réservation"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 p-4 rounded-lg bg-customGrey-100">
            <h4 className="mb-3 font-semibold text-primary-100">Informations de la réservation</h4>
            <ul className="space-y-2 text-gray-700">
              <li><b>Départ :</b> {selectedReservation?.ville_depart}</li>
              <li><b>Date :</b> {selectedReservation?.date_depart}</li>
              <li><b>Heure :</b> {selectedReservation?.heure_depart}</li>
              <li><b>Arrivée :</b> {selectedReservation?.ville_arrivee}</li>
              <li><b>Date d'arrivée :</b> {selectedReservation?.date_arrivee}</li>
              <li><b>Heure d'arrivée :</b> {selectedReservation?.heure_arrivee}</li>
              <li><b>Prix :</b> {selectedReservation?.prix} €</li>
              <li><b>Places réservées :</b> {selectedReservation?.nombre_places_reservees}</li>
              <li><b>Statut :</b> {selectedReservation?.statut}</li>
            </ul>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-customGrey-100">
            <h4 className="mb-3 font-semibold text-primary-100">Informations sur le conducteur</h4>
            {userLoading ? (
              <div className="flex items-center">
                <div className="inline-block w-6 h-6 mr-2 border-4 rounded-full border-customGreen2-100 border-t-transparent animate-spin"></div>
                <span className="text-gray-600">Chargement des infos utilisateur...</span>
              </div>
            ) : userError ? (
              <div className="text-red-500">{userError}</div>
            ) : userInfo ? (
              <ul className="space-y-2 text-gray-700">
                <li><b>Nom :</b> {userInfo.nom || '-'}</li>
                <li><b>Prénom :</b> {userInfo.prenom || '-'}</li>
                <li><b>Email :</b> {userInfo.email || '-'}</li>
                <li><b>Téléphone :</b> {userInfo.telephone || '-'}</li>
                <li><b>Note :</b> {userInfo.note ? `${userInfo.note} / 5` : '-'}</li>
              </ul>
            ) : (
              <div className="text-gray-500">Aucune information utilisateur trouvée.</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisualiserReservations;