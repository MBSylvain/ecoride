import React, { useEffect, useState } from "react";
import axios from "axios";

// Modale de détail/édition réservation
const ReservationModal = ({ reservation, isOpen, onClose, onSave, onDelete }) => {
  const [editData, setEditData] = useState(reservation || {});
  useEffect(() => {
    setEditData(reservation || {});
  }, [reservation]);
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
        <h2 className="mb-4 text-xl font-bold">Détail réservation</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Utilisateur</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.utilisateur_id || ""}
              onChange={e => setEditData({ ...editData, utilisateur_id: e.target.value })}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Trajet</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.trajet_id || ""}
              onChange={e => setEditData({ ...editData, trajet_id: e.target.value })}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Statut</label>
            <select
              className="w-full px-2 py-1 border rounded"
              value={editData.statut || ""}
              onChange={e => setEditData({ ...editData, statut: e.target.value })}
            >
              <option value="en_attente">En attente</option>
              <option value="confirmé">Confirmé</option>
              <option value="annulée">Annulée</option>
              <option value="terminée">Terminée</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Places réservées</label>
            <input
              type="number"
              className="w-full px-2 py-1 border rounded"
              value={editData.nombre_places_reservees || ""}
              onChange={e => setEditData({ ...editData, nombre_places_reservees: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => onSave(editData)}
            >
              Enregistrer
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              onClick={() => {
                if (window.confirm("Supprimer cette réservation ?")) onDelete(editData.reservation_id);
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminReservation = () => {
  const [reservations, setReservations] = useState([] ||null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
    const [users, setUsers] = useState([]);

  // Filtres et pagination
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 10;

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost/api/ControllersAdministrateur/ReservationAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      const reservationsArray = Array.isArray(res.data)
  ? res.data
  : Array.isArray(res.data.data)
    ? res.data.data
    : [];
setReservations(reservationsArray);
    } catch (e) {
      setFeedback("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredReservations = reservations
    .filter(r =>
      (search === "" ||
        String(r.utilisateur_id).toLowerCase().includes(search.toLowerCase()) ||
        String(r.trajet_id).toLowerCase().includes(search.toLowerCase()))
      && (statutFilter === "Tous" || r.statut === statutFilter)
    );

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * reservationsPerPage, currentPage * reservationsPerPage);

  const handleSaveReservation = async (reservation) => {
    try {
      if (reservation.reservation_id) {
        await axios.put("http://localhost/api/ControllersAdministrateur/ReservationAdminController.php", reservation, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Réservation modifiée !");
      } else {
        await axios.post("http://localhost/api/ControllersAdministrateur/ReservationAdminController.php", reservation, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Réservation ajoutée !");
      }
      setShowReservationModal(false);
      fetchReservations();
    } catch (e) {
      setFeedback("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost/api/ControllersAdministrateur/ReservationAdminController.php?reservation_id=${reservationId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setFeedback("Réservation supprimée !");
      setShowReservationModal(false);
      fetchReservations();
    } catch (e) {
      setFeedback("Erreur lors de la suppression");
    }
  };

  
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">Réservations</h2>
      {feedback && (
        <div className="p-2 mb-2 text-center text-green-800 bg-green-100 rounded">
          {feedback}
          <button className="ml-4 text-sm text-green-900" onClick={() => setFeedback(null)}>x</button>
        </div>
      )}
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Recherche utilisateur ou trajet..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-2 py-1 border rounded"
        />
        <select value={statutFilter} onChange={e => { setStatutFilter(e.target.value); setCurrentPage(1); }} className="px-2 py-1 border rounded">
          <option value="Tous">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmé">Confirmé</option>
          <option value="annulée">Annulée</option>
          <option value="terminée">Terminée</option>
        </select>
      </div>
      <button
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        onClick={() => { setSelectedReservation(null); setShowReservationModal(true); }}
      >
        Ajouter une réservation
      </button>
      {loading ? (
        <p>Chargement...</p>
      ) : paginatedReservations.length > 0 ? (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Utilisateur</th>
              <th className="px-2 py-1 border">Trajet</th>
              <th className="px-2 py-1 border">Statut</th>
              <th className="px-2 py-1 border">Places</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map(reservation => (
              <tr key={reservation.reservation_id}>
                <td className="px-2 py-1 border">{reservation.utilisateur_id}</td>
                <td className="px-2 py-1 border">{reservation.trajet_id}</td>
                <td className="px-2 py-1 border">{reservation.statut}</td>
                <td className="px-2 py-1 border">{reservation.nombre_places_reservees}</td>
                <td className="flex flex-wrap gap-2 px-2 py-1 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedReservation(reservation); setShowReservationModal(true); }}
                  >
                    Détail
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => {
                      if (window.confirm("Supprimer cette réservation ?")) handleDeleteReservation(reservation.reservation_id);
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune réservation trouvée.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 my-4">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-2 py-1 border rounded ${currentPage === idx + 1 ? "bg-customGreen-100 text-white" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      <ReservationModal
        reservation={selectedReservation}
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onSave={handleSaveReservation}
        onDelete={handleDeleteReservation}
      />
    </section>
  );
};

export default AdminReservation;