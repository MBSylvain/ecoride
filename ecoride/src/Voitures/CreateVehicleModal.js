import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const CreateVehicleModal = ({ isOpen, onClose, onVehicleCreated }) => {
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    immatriculation: '',
    energie: '',
    couleur: '',
    nombre_places: '',
    date_premiere_immatriculation: '',
    photo_url: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (
      !formData.marque ||
      !formData.modele ||
      !formData.immatriculation ||
      !formData.energie ||
      !formData.couleur ||
      !formData.nombre_places
    ) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    if (formData.nombre_places < 1 || formData.nombre_places > 9) {
      setError('Le nombre de places doit être compris entre 1 et 9.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php',
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      onVehicleCreated(response.data);
      onClose();
    } catch (error) {
      setError('Erreur lors de la création du véhicule.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un véhicule">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans bg-white rounded-lg shadow-lg">
        {error && <div className="px-4 py-2 text-white bg-red-500 rounded-md">{error}</div>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Marque *</label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              placeholder="Ex: Renault"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Modèle *</label>
            <input
              type="text"
              name="modele"
              value={formData.modele}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              placeholder="Ex: Clio"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Immatriculation *</label>
            <input
              type="text"
              name="immatriculation"
              value={formData.immatriculation}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              placeholder="AA-123-BB"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Énergie *</label>
            <select
              name="energie"
              value={formData.energie}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
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
            <label className="block mb-1 text-sm font-semibold text-primary-100">Couleur *</label>
            <input
              type="text"
              name="couleur"
              value={formData.couleur}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              placeholder="Ex: Bleu"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Nombre de places *</label>
            <input
              type="number"
              name="nombre_places"
              min="1"
              max="9"
              value={formData.nombre_places}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              placeholder="Ex: 5"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Date de première immatriculation</label>
            <input
              type="date"
              name="date_premiere_immatriculation"
              value={formData.date_premiere_immatriculation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              min="1980-01-01"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Photo URL</label>
            <input
              type="text"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              placeholder="Lien vers la photo"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-primary-100">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            rows="3"
            placeholder="Description du véhicule"
          />
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 font-bold rounded-md shadow-md transition-colors ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-100 text-white hover:bg-customPink-100'
            }`}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateVehicleModal;