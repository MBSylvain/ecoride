import axiosInstance from '../api/axiosInstance';
import { useEffect, useState } from 'react';
import CreateTrajetModal from './CreateTrajetModal';
import EditTrajetModal from './EditTrajetModal';
import BoutonStatutTrajet from '../components/ButtonStatutTrajet';

// Modal conforme à la charte graphique EcoRide
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-lg p-8 transition-all duration-300 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
        {title && <h2 className="mb-4 text-lg font-bold text-primary-100">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

const VisualiserTrajets = () => {
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [trajetToEdit, setTrajetToEdit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [trajetToView, setTrajetToView] = useState(null);
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("utilisateur.id");
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Récupération des trajets
  const fetchTrajets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `TrajetController.php?utilisateur_id=${utilisateur_id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      if (Array.isArray(response.data)) {
        setTrajets(response.data);
      } else if (response.data && Array.isArray(response.data.trajets)) {
        setTrajets(response.data.trajets);
      } else {
        setTrajets([]);
      }
    } catch (err) {
      setError("Erreur lors du chargement des trajets");
      setTrajets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajets();
  }, []);

  // Récupérer les infos utilisateur et réservations quand selectedTrajet change
  useEffect(() => {
    if (selectedTrajet) {
      setUserLoading(true);
      setUserError(null);
      setUserInfo(null);
      setReservations([]);
      setPassengers([]);
      setReservationsLoading(true);
      setReservationsError(null);

      axiosInstance.get(
        `UtilisateurController.php?utilisateur_id=${selectedTrajet.utilisateur_id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      )
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setUserInfo(res.data[0]);
          } else if (res.data && res.data.utilisateur) {
            setUserInfo(res.data.utilisateur);
          } else if (res.data && typeof res.data === 'object') {
            setUserInfo(res.data);
          } else {
            setUserInfo(null);
            setUserError("Aucune donnée utilisateur trouvée pour l'ID " + selectedTrajet.utilisateur_id);
          }
        })
        .catch(() => setUserError("Erreur lors du chargement des infos utilisateur"))
        .finally(() => setUserLoading(false));

      axiosInstance.get(
        `ReservationController.php?trajet_id=${selectedTrajet.trajet_id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      )
        .then(res => {
          let reservationsList = [];
          if (res.data && Array.isArray(res.data)) {
            reservationsList = res.data;
          } else if (res.data && Array.isArray(res.data.reservations)) {
            reservationsList = res.data.reservations;
          }
          setReservations(reservationsList);
          if (reservationsList.length > 0) {
            Promise.all(reservationsList.map(r =>
              axiosInstance.get(
                `UtilisateurController.php?utilisateur_id=${r.utilisateur_id}`,
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
              )
                .then(uRes => {
                  if (Array.isArray(uRes.data) && uRes.data.length > 0) {
                    return uRes.data[0];
                  } else if (uRes.data && uRes.data.utilisateur) {
                    return uRes.data.utilisateur;
                  } else if (uRes.data && typeof uRes.data === 'object') {
                    return uRes.data;
                  }
                  return null;
                })
                .catch(() => null)
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

  // Mise à jour du statut d'une réservation
  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      await axiosInstance.post(`ReservationController.php`, {
        reservation_id: reservationId,
        statut: newStatus
      });
      if (selectedTrajet) {
        const res = await axiosInstance.get(
          `ReservationController.php?trajet_id=${selectedTrajet.trajet_id}`
        );
        let reservationsList = [];
        if (res.data && Array.isArray(res.data)) {
          reservationsList = res.data;
        } else if (res.data && Array.isArray(res.data.reservations)) {
          reservationsList = res.data.reservations;
        }
        setReservations(reservationsList);
      }
    } catch {
      alert("Erreur lors de la mise à jour du statut de la réservation");
    }
  };

  // Suppression d'un trajet
  async function handleDeleteTrajet(trajetId) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      setIsDeleting(true);
      setDeleteError('');
      try {
        await axiosInstance.delete(`TrajetController.php?trajet_id=${trajetId}`);
        fetchTrajets();
      } catch {
        setDeleteError("Erreur lors de la suppression du trajet.");
      } finally {
        setIsDeleting(false);
      }
    }
  }

  return (
    <div className="p-6 m-6 font-sans bg-white border border-gray-100 shadow-lg rounded-xl">
      <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-center text-primary-100 md:text-left">Tous les trajets</h2>
        <button
          className="px-5 py-2 mt-4 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100 md:mt-0"
          onClick={() => setShowCreateModal(true)}
        >
          + Ajouter un trajet
        </button>
      </div>

      {/* Affichage des erreurs ou du chargement */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement des trajets...</span>
        </div>
      ) : error ? (
        <div className="p-4 my-8 text-center text-white bg-red-500 rounded-lg shadow-md">{error}</div>
      ) : trajets.length === 0 ? (
        <div className="p-4 my-8 text-center text-gray-600 rounded-lg bg-customGrey-100">Aucun trajet trouvé.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Départ</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Arrivée</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Heure</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Prix</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Places</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map((trajet) => (
                <tr key={trajet.trajet_id}>
                  <td className="px-4 py-2 border-b">{trajet.ville_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.ville_arrivee}</td>
                  <td className="px-4 py-2 border-b">{trajet.date_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.heure_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.prix} €</td>
                  <td className="px-4 py-2 border-b">{trajet.nombre_places}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                        onClick={() => {
                          setTrajetToView(trajet);
                          setShowDetailModal(true);
                        }}
                      >
                        Détail
                      </button>
                      <button
                        className="px-4 py-2 font-bold text-black transition-colors bg-yellow-400 rounded-md shadow-md hover:bg-yellow-500"
                        onClick={() => {
                          setTrajetToEdit(trajet);
                          setShowEditModal(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="px-4 py-2 font-bold text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
                        onClick={() => handleDeleteTrajet(trajet.trajet_id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </button>
                      <BoutonStatutTrajet trajet={trajet} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteError && (
        <div className="p-4 my-4 text-center text-white bg-red-500 rounded-lg shadow-md">{deleteError}</div>
      )}

      {/* Modal création */}
      {showCreateModal && (
        <CreateTrajetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTrajetCreated={() => {
            setShowCreateModal(false);
            fetchTrajets();
          }}
        />
      )}

      {/* Modal édition */}
      {showEditModal && trajetToEdit && (
        <EditTrajetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onTrajetUpdated={() => {
            setShowEditModal(false);
            fetchTrajets();
          }}
          trajet={trajetToEdit}
        />
      )}

      {/* Modal détail */}
      {showDetailModal && trajetToView && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Détail du trajet">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><p className='font-bold text-primary-100'>Départ :</p> {trajetToView.ville_depart}</div>
            <div><p className='font-bold text-primary-100'>Arrivée :</p> {trajetToView.ville_arrivee}</div>
            <div><p className='font-bold text-primary-100'>Date :</p> {trajetToView.date_depart}</div>
            <div><p className='font-bold text-primary-100'>Heure :</p> {trajetToView.heure_depart}</div>
            <div><p className='font-bold text-primary-100'>Prix :</p> {trajetToView.prix} €</div>
            <div><p className='font-bold text-primary-100'>Places :</p> {trajetToView.nombre_places}</div>
            <div><p className='font-bold text-primary-100'>Description :</p> {trajetToView.description || 'Aucune'}</div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VisualiserTrajets;
