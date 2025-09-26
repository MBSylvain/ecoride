import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateReservationModal from './CreateReservationModal';
import EditReservationModal from './EditReservationModal';

const ReservationUser = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const utilisateur_id = localStorage.getItem('utilisateur_id');

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost/api/Controllers/ReservationController.php?utilisateur_id=${utilisateur_id}`
        );
        setReservations(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (utilisateur_id) {
      fetchReservations();
    }
  }, [utilisateur_id]);

  // Delete reservation
  const handleDelete = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await axios.delete(
          `http://localhost/api/Controllers/ReservationController.php?reservation_id=${reservationId}`
        );
        setReservations(
          reservations.filter((reservation) => reservation.reservation_id !== reservationId)
        );
      } catch (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
      }
    }
  };

  // Open edit modal
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes réservations</h2>
      {isLoading ? (
        <p>Chargement...</p>
      ) : reservations.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Trajet</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.reservation_id}>
                <td>{reservation.trajet}</td>
                <td>{reservation.date}</td>
                <td>{reservation.statut}</td>
                <td>
                  <button
                    onClick={() => handleEdit(reservation)}
                    className="px-2 py-1 text-white bg-blue-500 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(reservation.reservation_id)}
                    className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
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
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
      >
        Ajouter une réservation
      </button>

      {/* Modals */}
      {showCreateModal && (
        <CreateReservationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onReservationCreated={(newReservation) =>
            setReservations([...reservations, newReservation])
          }
        />
      )}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onReservationUpdated={(updatedReservation) => {
            setReservations(
              reservations.map((reservation) =>
                reservation.reservation_id === updatedReservation.reservation_id
                  ? updatedReservation
                  : reservation
              )
            );
          }}
          reservation={selectedReservation}
        />
      )}
    </div>
  );
};

export default ReservationUser;