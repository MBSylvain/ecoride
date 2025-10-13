import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTrajetModal from './CreateTrajetModal';
import EditTrajetModal from './EditTrajetModal';

// Exemple de composant Modal générique pour la consultation des détails
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
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

  // Fonction pour recharger les trajets après création/modification
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
// Fonction pour supprimer un trajet
  const [deleteError, setDeleteError] = useState('');
const [isDeleting, setIsDeleting] = useState(false);

async function handleDeleteTrajet(trajetId) {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await axios.delete(`http://localhost/api/Controllers/TrajetController.php?trajet_id=${trajetId}`);
      fetchTrajets(); // Rafraîchir la liste
    } catch (error) {
      setDeleteError("Erreur lors de la suppression du trajet.");
      console.error("Erreur lors de la suppression du trajet :", error);
    } finally {
      setIsDeleting(false);
    }
  }
}

  return (
    <div className="p-6 m-6 bg-white border border-gray-100 shadow-lg rounded-xl">
      <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold text-center md:text-left">Tous les trajets</h2>
        <button
          className="px-5 py-2 mt-4 text-white transition rounded-lg md:mt-0 bg-customGreen-100 hover:bg-customGreen-200"
          onClick={() => setShowCreateModal(true)}
        >
          + Ajouter un trajet
        </button>
      </div>

      {/* Affichage des erreurs ou du chargement */}
      {loading ? (
        <div className="my-8 text-center text-gray-500">Chargement des trajets...</div>
      ) : error ? (
        <div className="my-8 text-center text-red-500">{error}</div>
      ) : trajets.length === 0 ? (
        <div className="my-8 text-center text-gray-500">Aucun trajet trouvé.</div>
      ) : (
        <table className="m-2">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Départ</th>
              <th className="px-2 py-1 border">Arrivée</th>
              <th className="px-2 py-1 border">Date</th>
              <th className="px-2 py-1 border">Heure</th>
              <th className="px-2 py-1 border">Prix</th>
              <th className="px-2 py-1 border">Places</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trajets.map((trajet) => (
              <tr key={trajet.utilisateur_id}>
                <td className="px-2 py-1 border">{trajet.ville_depart}</td>
                <td className="px-2 py-1 border">{trajet.ville_arrivee}</td>
                <td className="px-2 py-1 border">{trajet.date_depart}</td>
                <td className="px-2 py-1 border">{trajet.heure_depart}</td>
                <td className="px-2 py-1 border">{trajet.prix}</td>
                <td className="px-2 py-1 border">{trajet.nombre_places}</td>
                <td className="px-2 py-1 border">
                  <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                    onClick={() => {
                      setTrajetToView(trajet);
                      setShowDetailModal(true);
                    }}
                  >
                    Détail
                  </button>
                  <button
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                    onClick={() => {
                      setTrajetToEdit(trajet);
                      setShowEditModal(true);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    onClick={() => handleDeleteTrajet(trajet.trajet_id)}
                  >
                    Supprimer
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
            <div><p className='font-bold'>Départ :</p> {trajetToView.ville_depart}</div>
            <div><p className='font-bold'>Arrivée :</p> {trajetToView.ville_arrivee}</div>
            <div><p className='font-bold'>Date :</p> {trajetToView.date_depart}</div>
            <div><p className='font-bold'>Heure :</p> {trajetToView.heure_depart}</div>
            <div><p className='font-bold'>Prix :</p> {trajetToView.prix} €</div>
            <div><p className='font-bold'>Places :</p> {trajetToView.nombre_places}</div>
            <div><p className='font-bold'>Description :</p> {trajetToView.description || 'Aucune'}</div>
            {/* Ajoute d'autres champs si besoin */}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VisualiserTrajets;
