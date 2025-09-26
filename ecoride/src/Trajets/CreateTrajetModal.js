import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';

const CreateTrajetModal = ({ isOpen, onClose, onTrajetCreated }) => {
  const [formData, setFormData] = useState({
    depart: '',
    arrivee: '',
    date: '',
    heure: '',
    prix: '',
    places_disponibles: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
   // Récupération des voitures de l'utilisateur pour le champ déroulant 
  const [voitures, setVoitures] = useState([]);
    useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/Controllers/VoitureController.php?utilisateur_id=${localStorage.getItem('utilisateur_id')}`,
          { withCredentials: true },
          { headers: { 'Content-Type': 'application/json' } }

        );
        setVoitures(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des voitures:', error);
      }
    };
    fetchVoitures();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost/api/Controllers/TrajetController.php',
        {
          ...formData,
          utilisateur_id: localStorage.getItem('utilisateur_id'),
        }
      );
      onTrajetCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du trajet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un trajet">
        <form
            onSubmit={handleSubmit}
            className="px-4 py-2 space-y-2 md:px-8 md:py-4"
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium">Ville de départ</label>
                    <input
                        type="text"
                        name="ville_depart"
                        value={formData.ville_depart}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Ville d'arrivée</label>
                    <input
                        type="text"
                        name="ville_arrivee"
                        value={formData.ville_arrivee}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Adresse de départ</label>
                    <input
                        type="text"
                        name="adresse_depart"
                        value={formData.adresse_depart}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Adresse d'arrivée</label>
                    <input
                        type="text"
                        name="adresse_arrivee"
                        value={formData.adresse_arrivee}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Date de départ</label>
                    <input
                        type="date"
                        name="date_depart"
                        value={formData.date_depart}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Heure de départ</label>
                    <input
                        type="time"
                        name="heure_depart"
                        value={formData.heure_depart}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Heure d'arrivée</label>
                    <input
                        type="time"
                        name="heure_arrivee"
                        value={formData.heure_arrivee}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Nombre de places</label>
                    <input
                        type="number"
                        name="nombre_places"
                        value={formData.nombre_places}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Prix</label>
                    <input
                        type="number"
                        name="prix"
                        value={formData.prix}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="bagages_autorises"
                        checked={formData.bagages_autorises}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium">Bagages autorisés</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="animaux_autorises"
                        checked={formData.animaux_autorises}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium">Animaux autorisés</label>
                </div>
                <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium">Voiture</label>
                    <select
                        name="voiture_id"
                        value={formData.voiture_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    >
                        <option value="">Sélectionnez une voiture</option>
                        {/* Ajoutez dynamiquement les options ici */}
                        {voitures.map((voiture) => (
                            <option key={voiture.id} value={voiture.id}>
                                {voiture.marque} {voiture.modele}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 text-white transition bg-blue-600 rounded shadow hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Enregistrement...' : 'Ajouter'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-white transition bg-gray-600 rounded shadow hover:bg-gray-700"
                >
                    Annuler
                </button>
            </div>
        </form>
    </Modal>
);
};

export default CreateTrajetModal;