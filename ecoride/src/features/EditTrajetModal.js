import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const EditTrajetModal = ({ isOpen, onClose, trajet, onTrajetUpdated }) => {
  // Initialiser le formulaire avec les données du trajet ou des champs vides
  const [formData, setFormData] = useState({
    ville_depart: '',
    ville_arrivee: '',
    date_depart: '',
    heure_depart: '',
    prix: '',
    nombre_places: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
      
  // Remplir le formulaire avec les données du trajet existant quand il est disponible
  useEffect(() => {
    if (trajet) {
      // Séparer la date et l'heure si nécessaire
      const dateTimeString = trajet.date_depart || '';
      let datePart = '';
      let timePart = '';
      
      if (dateTimeString.includes(' ')) {
        [datePart, timePart] = dateTimeString.split(' ');
      } else {
        datePart = dateTimeString;
      }
      
      setFormData({
        ville_depart: trajet.ville_depart || '',
        ville_arrivee: trajet.ville_arrivee || '',
        date_depart: datePart || '',
        heure_depart: timePart || '',
        prix: trajet.prix || '',
        nombre_places: trajet.nombre_places || '',
        description: trajet.description || ''
      });
    }
  }, [trajet]);

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
    
    // Combiner date et heure
    const dateComplete = formData.date_depart + (formData.heure_depart ? ' ' + formData.heure_depart : '');
    
    try {
      const response = await axios.put(
        `http://localhost/api/Controllers/TrajetController.php`,
        {
          ...formData,
          date_depart: dateComplete,
          trajet_id: trajet.trajet_id,
          utilisateur_id: localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id"),
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      // Vérifier la réponse et notifier le parent
      if (response.data && response.data.success) {
        // Si on a un callback de mise à jour, on l'appelle avec le trajet mis à jour
        if (onTrajetUpdated) {
          const updatedTrajet = {
            ...trajet,
            ...formData,
            date_depart: dateComplete
          };
          onTrajetUpdated(updatedTrajet);
        }
        // Fermer la modal
        onClose();
      } else {
        // Afficher l'erreur retournée par le serveur
        setError(response.data?.message || 'Erreur lors de la mise à jour du trajet');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le trajet">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Ville de départ</label>
            <input
              type="text"
              name="ville_depart"
              value={formData.ville_depart}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Ville d'arrivée</label>
            <input
              type="text"
              name="ville_arrivee"
              value={formData.ville_arrivee}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Date de départ</label>
            <input
              type="date"
              name="date_depart"
              value={formData.date_depart}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Heure de départ</label>
            <input
              type="time"
              name="heure_depart"
              value={formData.heure_depart}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-primary-100">Prix (€)</label>
            <input
              type="number"
              name="prix"
              min="0"
              step="0.01"
              value={formData.prix}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
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
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-primary-100">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTrajetModal;