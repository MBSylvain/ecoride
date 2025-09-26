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
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Départ</label>
          <input
            type="text"
            name="depart"
            value={formData.depart}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Arrivée</label>
          <input
            type="text"
            name="arrivee"
            value={formData.arrivee}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex flex-col flex-1">
            <label className="mb-1 font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="flex flex-col flex-1 mt-4 md:mt-0">
            <label className="mb-1 font-medium text-gray-700">Heure</label>
            <input
              type="time"
              name="heure"
              value={formData.heure}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex flex-col flex-1">
            <label className="mb-1 font-medium text-gray-700">Prix</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="flex flex-col flex-1 mt-4 md:mt-0">
            <label className="mb-1 font-medium text-gray-700">Places disponibles</label>
            <input
              type="number"
              name="places_disponibles"
              value={formData.places_disponibles}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="px-3 py-2 border rounded resize-none focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : 'Modifier'}
        </button>
      </form>
    </Modal>
  );
};

export default EditTrajetModal;