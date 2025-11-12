import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../features/Modal'; // Assurez-vous que ce chemin est correct

const EditVehicleModal = ({ isOpen, onClose, onVehicleUpdated }) => {
  const { voitureId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    voiture_id: '',
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php?${voitureId}`,
          { withCredentials: true }
        );
        if (response.data && response.data.data) {
          setFormData(response.data.data);
        } else {
          setError('Véhicule non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données du véhicule');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicleData();
  }, [voitureId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const validateFields = () => {
    if (
      !formData.modele ||
      !formData.marque ||
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
    if (!validateFields()) return;
    setIsSubmitting(true);
    setError('');
    try {
      const response = await axios.put(
        `https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php?${voitureId}`,
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        }
      );
      if (response.data.success) {
        if (onVehicleUpdated) {
          const newVehicle = {
            ...formData,
            voiture_id: response.data.voiture_id || response.data.id
          };
          onVehicleUpdated(newVehicle);
        }
        onClose();
        navigate('/Dashboard');
      } else {
        setError(response.data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du véhicule');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
      <span className="ml-2 text-gray-600">Chargement des données du véhicule...</span>
    </div>
  );
  if (error) return (
    <div className="px-4 py-2 m-4 text-white bg-red-500 rounded-md">{error}</div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier ma voiture">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans bg-white rounded-lg shadow-lg">
        <input type="hidden" name="utilisateur_id" value={formData.utilisateur_id} />
        <input type="hidden" name="voiture_id" value={formData.voiture_id} />
        <input type="hidden" name="action" value="PUT" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Modèle *</label>
            <input
              type="text"
              name="modele"
              value={formData.modele}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              required
              placeholder="Ex: Renault Clio"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Marque *</label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              required
              placeholder="Ex: Renault"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Immatriculation *</label>
            <input
              type="text"
              name="immatriculation"
              value={formData.immatriculation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              required
              placeholder="AA-123-BB"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Énergie *</label>
            <select
              name="energie"
              value={formData.energie}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
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
            <label className="block mb-1 text-sm font-semibold text-primary-100">Couleur *</label>
            <input
              type="text"
              name="couleur"
              value={formData.couleur}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              required
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              required
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
          <label htmlFor="description" className="block mb-1 text-sm font-semibold text-primary-100">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            rows="4"
            placeholder="Description du véhicule"
          ></textarea>
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

export default EditVehicleModal;