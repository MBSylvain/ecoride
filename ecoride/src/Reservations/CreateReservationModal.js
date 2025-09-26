import React, { useState } from 'react';
import Modal from '../components/Modal';
import axios from 'axios';

const CreateReservationModal = ({ isOpen, onClose, onReservationCreated }) => {
  const [formData, setFormData] = useState({
    trajet_id: '',
    date: '',
    statut: 'En attente',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost/api/Controllers/ReservationController.php',
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        }
      );
      onReservationCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une réservation">
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
          {isSubmitting ? 'Enregistrement...' : 'Ajouter'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateReservationModal;