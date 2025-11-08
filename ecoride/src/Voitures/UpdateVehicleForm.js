import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EditVehicleForm = () => {
  const { voitureId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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

  // Charger les données de la voiture uniquement au montage du composant
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `VoitureController.php?voiture_id=${voitureId}`,
          { withCredentials: true }
        );
        if (response.data) {
          setFormData({
            voiture_id: response.data.voiture_id || '',
            modele: response.data.modele || '',
            immatriculation: response.data.immatriculation || '',
            energie: response.data.energie || '',
            couleur: response.data.couleur || '',
            nombre_places: response.data.nombre_places || '',
            date_premiere_immatriculation: response.data.date_premiere_immatriculation || '',
            image: response.data.image || '',
            description: response.data.description || ''
          });
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
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `VoitureController.php?voiture_id=${voitureId}`,
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
        navigate('/Dashboard');
      } else {
        setError(response.data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du véhicule');
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
        <span className="ml-2 text-gray-600">Chargement en cours...</span>
      </div>
    );
  if (error)
    return (
      <div className="px-4 py-2 m-4 text-white bg-red-500 rounded-md">{error}</div>
    );

  return (
    <div className="max-w-lg p-6 mx-auto font-sans bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-primary-100">Modifier ma voiture</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="voiture_id" value={formData.voiture_id} />
        <div>
          <label htmlFor="modele" className="block mb-1 text-sm font-semibold text-primary-100">Modèle *</label>
          <input
            type="text"
            id="modele"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            required
            placeholder="Ex: Clio"
          />
        </div>
        <div>
          <label htmlFor="immatriculation" className="block mb-1 text-sm font-semibold text-primary-100">Immatriculation *</label>
          <input
            type="text"
            id="immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            required
            placeholder="AA-123-BB"
          />
        </div>
        <div>
          <label htmlFor="energie" className="block mb-1 text-sm font-semibold text-primary-100">Énergie *</label>
          <select
            id="energie"
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
          <label htmlFor="couleur" className="block mb-1 text-sm font-semibold text-primary-100">Couleur *</label>
          <input
            type="text"
            id="couleur"
            name="couleur"
            value={formData.couleur}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            required
            placeholder="Ex: Bleu"
          />
        </div>
        <div>
          <label htmlFor="nombre_places" className="block mb-1 text-sm font-semibold text-primary-100">Nombre de places *</label>
          <input
            type="number"
            id="nombre_places"
            name="nombre_places"
            value={formData.nombre_places}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            min="1"
            max="9"
            required
            placeholder="Ex: 5"
          />
        </div>
        <div>
          <label htmlFor="date_premiere_immatriculation" className="block mb-1 text-sm font-semibold text-primary-100">Année</label>
          <input
            type="date"
            id="date_premiere_immatriculation"
            name="date_premiere_immatriculation"
            value={formData.date_premiere_immatriculation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            min="1980-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1 text-sm font-semibold text-primary-100">Image (URL)</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            placeholder="URL de l'image de la voiture"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-semibold text-primary-100">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            rows="4"
            placeholder="Description de la voiture"
          ></textarea>
        </div>
        <div className="flex pt-4 space-x-3 border-t">
          <button
            type="button"
            onClick={() => navigate('/Carinfo')}
            className="px-6 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
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