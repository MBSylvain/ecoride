import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Assurez-vous que ce chemin est correct

const EditVehicleModal = ({ isOpen, onClose, onVehicleUpdated }) => {
  // Initialiser le formulaire avec des champs vides
  const [formData, setFormData] = useState({
    modele: '',
    immatriculation: '',
    energie: '',
    couleur: '',
    nombre_places: '',
    annee: ''
  });
  // Initialiser la soumission et l'erreur
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
      
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost/api/Controllers/VoitureController.php',
        {
          ...formData,
          utilisateur_id: localStorage.getItem("utilisateur_id"),
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      // Vérifier la réponse et notifier le parent
      if (response.data && response.data.success) {
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
      } else {
        // Afficher l'erreur retournée par le serveur
        setError(response.data?.message || 'Erreur lors de la création du véhicule');
      }
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une voiture">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}  className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-primary-100">Modèle</label>
          <input
            type="text"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            action="POST" //
            required
            
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
            <label className="block mb-1 text-sm font-medium text-primary-100">Année</label>
            <input
              type="date"
              name="date_premiere_immatriculation"
              min="1990"
              max={new Date().getFullYear()}
              value={formData.annee}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
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
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
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