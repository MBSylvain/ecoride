import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const EditTrajetModal = ({ isOpen, onClose, onTrajetUpdated, trajet }) => {
  const [formData, setFormData] = useState(trajet);
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
        `http://localhost/api/Controllers/TrajetController.php?trajet_id=${trajet.trajet_id}`,
        formData
      );
      onTrajetUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du trajet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un trajet">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Départ</label>
          <input
            type="text"
            name="depart"
            value={formData.depart}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Arrivée</label>
          <input
            type="text"
            name="arrivee"
            value={formData.arrivee}
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
          <label>Heure</label>
          <input
            type="time"
            name="heure"
            value={formData.heure}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Prix</label>
          <input
            type="number"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Places disponibles</label>
          <input
            type="number"
            name="places_disponibles"
            value={formData.places_disponibles}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Modifier'}
        </button>
      </form>
    </Modal>
  );
};

export default EditTrajetModal;