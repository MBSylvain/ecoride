import React, { useState } from 'react';
import Modal from '../components/Modal';
import axios from 'axios';

const EditReservationModal = ({ isOpen, onClose, onReservationUpdated, reservation }) => {
  const [formData, setFormData] = useState(reservation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost/api/Controllers/ReservationController.php?reservation_id=${reservation.reservation_id}`,
        formData
      );
      onReservationUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier une réservation">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans bg-white rounded-lg shadow-md">
        <div>
          <label className="block mb-2 text-sm font-semibold text-primary-100">Trajet ID</label>
          <input
            type="text"
            name="trajet_id"
            value={formData.trajet_id}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-primary-100">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-primary-100">Statut</label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          >
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-bold shadow-md transition-colors ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-100 text-white hover:bg-customPink-100'
          }`}
        >
          {isSubmitting ? 'Enregistrement...' : 'Modifier'}
        </button>
      </form>
    </Modal>
  );
};

export default EditReservationModal;