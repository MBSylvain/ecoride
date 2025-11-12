import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const CreateTrajetModal = ({ isOpen, onClose, onTrajetCreated }) => {
    // Initialiser le formulaire avec des champs vides
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
    const [userCars, setUserCars] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    
    // Fetch user's cars when modal opens
    React.useEffect(() => {
        if (isOpen) {
            fetchUserCars();
        }
    }, [isOpen]);
    
    const fetchUserCars = async () => {
        try {
            const utilisateurId = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");
            const response = await axios.get(
                `https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php?utilisateur_id=${utilisateurId}`,
                { withCredentials: true }
            );
            
            if (response.data && Array.isArray(response.data)) {
                setUserCars(response.data);
                if (response.data.length > 0) {
                    setSelectedCarId(response.data[0].voiture_id);
                }
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des voitures:', err);
            setError('Impossible de récupérer vos voitures');
        }
    };
            
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCarChange = (e) => {
        setSelectedCarId(e.target.value);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        // Vérifier qu'une voiture est sélectionnée
        if (!selectedCarId) {
            setError('Veuillez sélectionner une voiture');
            setIsSubmitting(false);
            return;
        }
        
        // Combiner date et heure
        const dateComplete = formData.date_depart + (formData.heure_depart ? ' ' + formData.heure_depart : '');
        
        try {
            const response = await axios.post(
                `https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php`,
                {
                    ...formData,
                    date_depart: dateComplete,
                    utilisateur_id: localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id"),
                    voiture_id: selectedCarId
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            // Vérifier la réponse et notifier le parent
            if (response.data && response.data.success) {
                // Si on a un callback de création, on l'appelle avec le nouveau trajet
                if (onTrajetCreated) {
                    const newTrajet = {
                        ...formData,
                        date_depart: dateComplete,
                        trajet_id: response.data.trajet_id || response.data.id,
                        voiture_id: selectedCarId
                    };
                    onTrajetCreated(newTrajet);
                }
                // Fermer la modal
                onClose();
                // Réinitialiser le formulaire
                setFormData({
                    ville_depart: '',
                    ville_arrivee: '',
                    date_depart: '',
                    heure_depart: '',
                    prix: '',
                    nombre_places: '',
                    description: ''
                });
                setSelectedCarId('');
            } else {
                // Afficher l'erreur retournée par le serveur
                setError(response.data?.message || 'Erreur lors de la création du trajet');
            }
        } catch (err) {
            console.error('Erreur lors de la création:', err);
            setError('Erreur de connexion au serveur');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Proposer un trajet">
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
                
                <div>
                    <label className="block mb-1 text-sm font-medium text-primary-100">Sélectionner votre voiture</label>
                    {userCars.length > 0 ? (
                        <select
                            value={selectedCarId}
                            onChange={handleCarChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">--Sélectionner une voiture--</option>
                            {userCars.map(car => (
                                <option key={car.voiture_id} value={car.voiture_id}>
                                    {car.marque} {car.modele} - {car.couleur}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-sm text-red-500">
                            Aucune voiture disponible. Veuillez d'abord ajouter une voiture.
                        </p>
                    )}
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
                        disabled={isSubmitting || userCars.length === 0}
                    >
                        {isSubmitting ? 'Création...' : 'Proposer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTrajetModal;