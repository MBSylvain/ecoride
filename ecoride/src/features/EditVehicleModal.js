import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal'; // Assurez-vous que ce chemin est correct

const EditVehicleModal = ({ isOpen, onClose, onVehicleUpdated }) => {
  const { voitureId } = useParams();
  const navigate = useNavigate();
  // Initialiser le formulaire avec des champs vides
  const [formData, setFormData] = useState({
    voiture_id: '',
    modele: '',
    immatriculation: '',
    energie: '',
    couleur: '',
    nombre_places: '',
    date_premiere_immatriculation: '',
    image: '',
    description: '',
  });
  // Initialiser la soumission et l'erreur
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
      
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost/api/Controllers/VoitureController.php?${voitureId}`,
          { withCredentials: true }
        );

        console.log('Données récupérées :', response);

        if (response.data && response.data.data) {
          setFormData(response.data.data);
        } else {
          setError('Véhicule non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await axios.put(
        `http://localhost/api/Controllers/VoitureController.php?${voitureId}`,
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        }
      );

      if (response.data.success) {
        alert('Véhicule mis à jour avec succès!');
        // Si on a un callback de mise à jour, on l'appelle avec la nouvelle voiture
        if (onVehicleUpdated) {
          const newVehicle = {
            ...formData,
            voiture_id: response.data.voiture_id || response.data.id
          };
          onVehicleUpdated(newVehicle);
        }
        // Fermer la modal
        onClose();
        navigate('/Dashboard');
      } else {
        // Afficher l'erreur retournée par le serveur
        setError(response.data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la modification :', err);
      setError('Erreur lors de la mise à jour du véhicule');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div>Chargement des données du véhicule...</div>;
  if (error) return <div className="error">{error}</div>;

  // Vérification des champs requis avant l'envoi
  const validateFields = () => {
    if (!formData.modele || !formData.marque || !formData.immatriculation || !formData.energie || !formData.couleur || !formData.nombre_places) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    if (formData.nombre_places < 1 || formData.nombre_places > 9) {
      setError('Le nombre de places doit être compris entre 1 et 9.');
      return false;
    }
    return true;
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier ma voiture">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      
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

export default EditVehicleModal;