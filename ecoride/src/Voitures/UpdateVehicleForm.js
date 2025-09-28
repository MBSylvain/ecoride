import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditVehicleForm = () => {
  const { voitureId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    voiture_id: '',
    modele: '',
    immatriculation: '',
    energie: '',
    couleur: '',
    nombre_places: '',
    date_premiere_immatriculation: '',
    image: '',
    description: ''
  });
  const [reponse, setReponse] = useState({});
 

  // Charger les données de la voiture uniquement au montage du composant
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost/api/Controllers/VoitureController.php?voiture_id=${voitureId}`,
          { withCredentials: true },
          
        );
      // Vérifiaction de reponse
        console.log('Données récupérées :', response);
        console.log('Données récupérées :', response.data);
        console.log('voiture id récupérées :', response.data.voiture_id);
        setReponse(response);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données du véhicule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [voitureId]); // Seulement l'ID comme dépendance

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setReponse(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value
      }
    }));
  
  };
  // Soumettre les données modifiées
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost/api/Controllers/VoitureController.php?voiture_id=${voitureId}`,
        {
          ...formData,
          utilisateur_id: localStorage.getItem("utilisateur_id")
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        alert('Véhicule mis à jour avec succès!');
        console.log('Réponse du serveur:', response.data);
        navigate('/Dashboard'); // Redirection après succès
      } else {
        setError(response.data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError('Erreur lors de la mise à jour du véhicule');
    }
  };

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Modifier ma voiture</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="voiture_id" value={localStorage.getItem("voiture_id")} />
        <div>
          <label htmlFor="modele" className="block mb-1 font-medium">Modèle</label>
          <input
            type="text"
            id="modele"
            name="modele"
            value={reponse.data.modele }
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            placeholder={formData.modele}
          />
        </div>
        
        <div>
          <label htmlFor="immatriculation" className="block mb-1 font-medium">Immatriculation</label>
          <input
            type="text"
            id="immatriculation"
            name="immatriculation"
            value={reponse.data.immatriculation}
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
            value={reponse.data.energie}
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
            value={reponse.data.couleur}
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
            value={reponse.data.nombre_places}
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
            value={reponse.data.date_premiere_immatriculation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1 font-medium">Image (URL)</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="URL de l'image de la voiture"
          />                   
          </div>
          <div>
          <label htmlFor="description" className="block mb-1 font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={reponse.data.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            placeholder="Description de la voiture"
          ></textarea>
          </div>        
        <div className="flex pt-4 space-x-3 border-t">
          <button
            type="button"
            onClick={() => navigate('/Carinfo')}
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