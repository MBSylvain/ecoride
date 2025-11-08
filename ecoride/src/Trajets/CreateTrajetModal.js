import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axiosInstance from '../api/axiosInstance';

const CreateTrajetModal = ({ isOpen, onClose, onTrajetCreated }) => {
  const [formData, setFormData] = useState({
    ville_depart: '',
    ville_arrivee: '',
    adresse_depart: '',
    adresse_arrivee: '',
    date_depart: '',
    heure_depart: '',
    heure_arrivee: '',
    nombre_places: '',
    prix: '',
    description: '',
    bagages_autorises: false,
    animaux_autorises: false,
    voiture_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voitures, setVoitures] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchVoitures = async () => {
      try {
        const response = await axiosInstance.get(
          `VoitureController.php?utilisateur_id=${localStorage.getItem('utilisateur_id')}`,
          { withCredentials: true }
        );
        setVoitures(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des voitures.');
      }
    };
    fetchVoitures();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.ville_depart || !formData.ville_arrivee || !formData.date_depart || !formData.nombre_places || !formData.prix || !formData.voiture_id) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    if (formData.nombre_places <= 0 || formData.prix <= 0) {
      setError('Le nombre de places et le prix doivent être positifs.');
      return false;
    }
    if (formData.date_depart < new Date().toISOString().split('T')[0]) {
      setError('La date de départ ne peut pas être dans le passé.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        'TrajetController.php',
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        }
      );
      setSuccess('Trajet créé avec succès !');
      onTrajetCreated(response.data);
      onClose();
    } catch (error) {
      setError('Erreur lors de la création du trajet : ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un trajet">
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-4 font-sans bg-white rounded-lg shadow-lg"
      >
        {error && <div className="px-4 py-2 mb-2 text-white bg-red-500 rounded-md">{error}</div>}
        {success && <div className="px-4 py-2 mb-2 text-white rounded-md bg-customGreen2-100">{success}</div>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Ville de départ *</label>
            <input
              type="text"
              name="ville_depart"
              value={formData.ville_depart}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Ville d'arrivée *</label>
            <input
              type="text"
              name="ville_arrivee"
              value={formData.ville_arrivee}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Adresse de départ</label>
            <input
              type="text"
              name="adresse_depart"
              value={formData.adresse_depart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Adresse d'arrivée</label>
            <input
              type="text"
              name="adresse_arrivee"
              value={formData.adresse_arrivee}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Date de départ *</label>
            <input
              type="date"
              name="date_depart"
              value={formData.date_depart}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Heure de départ</label>
            <input
              type="time"
              name="heure_depart"
              value={formData.heure_depart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Heure d'arrivée</label>
            <input
              type="time"
              name="heure_arrivee"
              value={formData.heure_arrivee}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Nombre de places *</label>
            <input
              type="number"
              name="nombre_places"
              value={formData.nombre_places}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary-100">Prix *</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-primary-100">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="bagages_autorises"
              checked={formData.bagages_autorises}
              onChange={handleChange}
              className="w-4 h-4 border-gray-300 rounded text-customGreen2-100 focus:ring-customGreen2-100"
            />
            <label className="text-sm font-semibold text-primary-100">Bagages autorisés</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="animaux_autorises"
              checked={formData.animaux_autorises}
              onChange={handleChange}
              className="w-4 h-4 border-gray-300 rounded text-customGreen2-100 focus:ring-customGreen2-100"
            />
            <label className="text-sm font-semibold text-primary-100">Animaux autorisés</label>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-primary-100">Voiture *</label>
            <select
              name="voiture_id"
              value={formData.voiture_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            >
              <option value="">Sélectionnez une voiture</option>
              {voitures.map((voiture) => (
                <option key={voiture.voiture_id} value={voiture.voiture_id}>
                  {voiture.marque} {voiture.modele}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 font-bold rounded-md shadow-md transition-colors ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-100 text-white hover:bg-customPink-100'
            }`}
          >
            {isSubmitting ? 'Enregistrement...' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTrajetModal;