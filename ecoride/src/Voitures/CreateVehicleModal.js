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
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        },
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="hidden"
          name="utilisateur_id"
          value={formData.utilisateur_id}
        />
        <input
          type="hidden"
          name="voiture_id"
          value={formData.voiture_id}
        />
        <input
          type="hidden"
          name="action"
          value='PUT'
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-primary-100">Modèle</label>
          <input
            type="text"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="Ex: Renault Clio"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-primary-100">Marque</label>
          <input
            type="text"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-primary-100">Immatriculation</label>
          <input
            type="text"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Énergie</label>
            <select
              name="energie"
              value={formData.energie}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Sélectionnez</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Électrique">Électrique</option>
              <option value="Hybride">Hybride</option>
              <option value="GPL">GPL</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Couleur</label>
            <input
              type="text"
              name="couleur"
              value={formData.couleur}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Nombre de places</label>
            <input
              type="number"
              name="nombre_places"
              min="1"
              max="9"
              value={formData.nombre_places}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Date de première immatriculation</label>
            <input
              type="date"
              name="date_premiere_immatriculation"
              min="1980"
              max={new Date().getFullYear()}
              value={formData.date_premiere_immatriculation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-primary-100">Photo URL</label>
          <input
            type="text"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
          ></textarea>
        </div>
        
        <div className="flex justify-end pt-4 space-x-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded text-primary-100 hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded bg-primary-100-600 hover:bg-customPink-80 focus:outline-none focus:ring-2 focus:ring-customPink-80"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateVehicleModal;