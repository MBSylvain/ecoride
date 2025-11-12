import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';

// Fonction utilitaire pour mapper les champs du trajet vers le formulaire
const mapTrajetToFormData = (trajet) => {
  if (!trajet) return {};
  return {
    depart: trajet.ville_depart || "",
    arrivee: trajet.ville_arrivee || "",
    date: trajet.date_depart ? trajet.date_depart.split("T")[0] : "",
    heure: trajet.heure_depart || "",
    prix: trajet.prix || "",
    places_disponibles: trajet.nombre_places || "",
    description: trajet.description || "",
  };
};

const EditTrajetModal = ({ isOpen, onClose, onTrajetUpdated, trajet }) => {
  const [formData, setFormData] = useState(mapTrajetToFormData(trajet));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(mapTrajetToFormData(trajet));
  }, [trajet]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php?trajet_id=${trajet.trajet_id}`,
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
      <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans bg-white rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 text-sm font-semibold text-primary-100">Départ</label>
          <input
            type="text"
            name="depart"
            value={formData.depart}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-primary-100">Arrivée</label>
          <input
            type="text"
            name="arrivee"
            value={formData.arrivee}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
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
          <div className="flex-1">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Heure</label>
            <input
              type="time"
              name="heure"
              value={formData.heure}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Prix (€)</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Places disponibles</label>
            <input
              type="number"
              name="places_disponibles"
              value={formData.places_disponibles}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-primary-100">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            rows={3}
          />
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

export default EditTrajetModal;