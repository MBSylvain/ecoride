import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const CreateVehicleModal = ({ isOpen, onClose, onVehicleCreated }) => {
  const [formData, setFormData] = useState({
    modele: '',
    immatriculation: '',
    energie: '',
    couleur: '',
    nombre_places: '',
    date_premiere_immatriculation: '',
    image: '',
    description: '',
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
        'http://localhost/api/Controllers/VoitureController.php',
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        }
      );
      onVehicleCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du véhicule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un véhicule">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Modèle</label>
          <input
            type="text"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Immatriculation</label>
          <input
            type="text"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Énergie</label>
          <select
            name="energie"
            value={formData.energie}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Ajouter'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateVehicleModal;