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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold text-primary-100">Détail réservation</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary-100">Utilisateur</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-customGrey-100"
              value={editData.utilisateur_id || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Trajet</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-customGrey-100"
              value={editData.trajet_id || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Statut</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            <label className="block text-sm font-semibold text-primary-100">Places réservées</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.nombre_places_reservees || ""}
              onChange={e => setEditData({ ...editData, nombre_places_reservees: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
              onClick={() => onSave(editData)}
            >
              Enregistrer
            </button>
            <button
              className="px-6 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md shadow-md hover:bg-red-600"
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
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

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
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Gestion des réservations</h2>
      {feedback && (
        <div className="flex items-center justify-between p-4 mb-4 text-center text-white rounded-md shadow bg-customGreen2-100">
          <span>{feedback}</span>
          <button className="ml-4 text-sm text-white" onClick={() => setFeedback(null)}>x</button>
        </div>
      )}
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Recherche utilisateur ou trajet..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        />
        <select
          value={statutFilter}
          onChange={e => { setStatutFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmé">Confirmé</option>
          <option value="annulée">Annulée</option>
          <option value="terminée">Terminée</option>
        </select>
        <button
          className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
          onClick={() => { setSelectedReservation(null); setShowReservationModal(true); }}
        >
          Ajouter une réservation
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : paginatedReservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Utilisateur</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Trajet</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Statut</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Places</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.map(reservation => (
                <tr key={reservation.reservation_id}>
                  <td className="px-4 py-2 border-b">{reservation.utilisateur_id}</td>
                  <td className="px-4 py-2 border-b">{reservation.trajet_id}</td>
                  <td className="px-4 py-2 border-b">{reservation.statut}</td>
                  <td className="px-4 py-2 border-b">{reservation.nombre_places_reservees}</td>
                  <td className="flex gap-2 px-4 py-2 border-b">
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 rounded-md bg-primary-100 hover:bg-customGreen2-100"
                      onClick={() => { setSelectedReservation(reservation); setShowReservationModal(true); }}
                    >
                      Détail
                    </button>
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md hover:bg-red-600"
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
        </div>
      ) : (
        <p className="text-gray-600">Aucune réservation trouvée.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 my-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${currentPage === idx + 1 ? "bg-customGreen-100 text-white" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg"
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