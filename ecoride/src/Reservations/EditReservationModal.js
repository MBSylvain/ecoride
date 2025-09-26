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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Trajet ID</label>
          <input
            type="text"
            name="trajet_id"
            value={formData.trajet_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Statut</label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            required
          >
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Modifier'}
        </button>
      </form>
    </Modal>
  );
};

export default EditReservationModal;