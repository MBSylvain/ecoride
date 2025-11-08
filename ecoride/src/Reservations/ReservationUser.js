import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import CreateReservationModal from './CreateReservationModal';
import EditReservationModal from './EditReservationModal';

const ReservationUser = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const utilisateur_id = localStorage.getItem('utilisateur_id');

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `ReservationController.php?utilisateur_id=${utilisateur_id}`
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

  const handleDelete = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await axiosInstance.delete(
          `ReservationController.php?reservation_id=${reservationId}`
        );
        setReservations(
          reservations.filter((reservation) => reservation.reservation_id !== reservationId)
        );
      } catch (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
      }
    }
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 font-sans bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Mes réservations</h2>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : reservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Trajet</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Statut</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.reservation_id}>
                  <td className="px-4 py-2 border-b">{reservation.trajet}</td>
                  <td className="px-4 py-2 border-b">{reservation.date}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      reservation.statut === "confirmé" ? "bg-customGreen2-100 text-white"
                      : reservation.statut === "annulée" ? "bg-red-500 text-white"
                      : reservation.statut === "en_attente" ? "bg-yellow-400 text-black"
                      : "bg-primary-100 text-white"
                    }`}>
                      {reservation.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleEdit(reservation)}
                      className="px-4 py-2 mr-2 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.reservation_id)}
                      className="px-4 py-2 font-bold text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
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
        <div className="p-4 text-center text-gray-600 rounded-lg bg-customGrey-100">
          Aucune réservation trouvée.
        </div>
      )}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-6 py-2 mt-6 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
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