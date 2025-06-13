import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditVehicleForm = () => {
const { voitureId } = useParams(); // Récupérer l'ID depuis l'URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    modele: '',
    immatriculation: '',
    energie: '',
    couleur: '',
    nombre_places: '',
    date_premiere_immatriculation: ''
  });
console.log("ID de la voiture:", voitureId); // Pour débogage
  // Charger les données de la voiture au chargement du composant
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(`http://localhost/api/Controllers/VoitureController.php?voiture_id=${voitureId}`);
        console.log("Réponse de l'API:", response.data); // Pour débogage
        if (response.data && response.data.length > 0) {
          // Si c'est un tableau (comme dans votre API actuelle)
          setFormData(response.data[0]);
        } else if (response.data && response.data.success) {
          // Si c'est un objet avec une propriété data
          setFormData(response.data.data);
            console.log("Données du formulaire initiales:", formData); // Pour débogage

        } else {
          setError('Voiture non trouvée');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [voitureId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost/api/Controllers/VoitureController.php',
        {
          ...formData,
          voiture_id: voitureId,
          action: 'update',
          utilisateur_id: localStorage.getItem("utilisateur_id")
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      if (response.data && response.data.success) {
        // Redirection vers la page des voitures après mise à jour
        navigate('/vehicles');
      } else {
        setError(response.data?.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(`Erreur de connexion: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Modifier ma voiture</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modele" className="block mb-1 font-medium">Modèle</label>
          <input
            type="text"
            id="modele"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            placeholder="Ex: Renault Clio"
          />
        </div>
        
        <div>
          <label htmlFor="immatriculation" className="block mb-1 font-medium">Immatriculation</label>
          <input
            type="text"
            id="immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="energie" className="block mb-1 font-medium">Énergie</label>
          <select
            id="energie"
            name="energie"
            value={formData.energie}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Sélectionnez</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="couleur" className="block mb-1 font-medium">Couleur</label>
          <input
            type="text"
            id="couleur"
            name="couleur"
            value={formData.couleur}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="nombre_places" className="block mb-1 font-medium">Nombre de places</label>
          <input
            type="number"
            id="nombre_places"
            name="nombre_places"
            value={formData.nombre_places}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            min="1"
            max="9"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date_premiere_immatriculation" className="block mb-1 font-medium">Année</label>
          <input
            type="date"
            id="date_premiere_immatriculation"
            name="date_premiere_immatriculation"
            value={formData.date_premiere_immatriculation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div className="flex pt-4 space-x-3 border-t">
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicleForm;