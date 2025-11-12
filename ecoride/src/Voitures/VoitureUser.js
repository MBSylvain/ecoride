import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CreateVehicleModal from './CreateVehicleModal';
import EditVehicleModal from './EditVehicleModal';

const VoitureUser = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const utilisateur_id = localStorage.getItem('utilisateur_id');
  const navigate = useNavigate();

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`,
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
        setVehicles(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (utilisateur_id) {
      fetchVehicles();
    }
  }, [utilisateur_id]);

  // Delete vehicle
  const handleDelete = async (vehicleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await axios.delete(
          `https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php?voiture_id=${vehicleId}`,
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
        setVehicles(vehicles.filter((vehicle) => vehicle.voiture_id !== vehicleId));
      } catch (error) {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    }
  };

  // Open edit modal
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
    navigate(`/vehicles/edit/${vehicle.voiture_id}`);
  };

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Mes véhicules</h2>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : vehicles.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-100 rounded-lg shadow">
          <thead>
            <tr className="bg-customGrey-100">
              <th className="px-4 py-2 font-semibold text-left text-primary-100">Modèle</th>
              <th className="px-4 py-2 font-semibold text-left text-primary-100">Immatriculation</th>
              <th className="px-4 py-2 font-semibold text-left text-primary-100">Énergie</th>
              <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.voiture_id} className="border-b border-gray-200">
                <td className="px-4 py-2">{vehicle.modele}</td>
                <td className="px-4 py-2">{vehicle.immatriculation}</td>
                <td className="px-4 py-2">{vehicle.energie}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/UpdateVehicleForm/${vehicle.voiture_id}`}
                    className="px-3 py-1 mr-2 font-semibold text-white transition-all duration-200 rounded-md bg-customGreen-100 hover:bg-customGreen2-100"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle.voiture_id)}
                    className="px-3 py-1 font-semibold text-white transition-all duration-200 bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">Aucun véhicule trouvé.</p>
      )}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-6 py-2 mt-6 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
      >
        Ajouter un véhicule
      </button>

      {/* Modals */}
      {showCreateModal && (
        <CreateVehicleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onVehicleCreated={(newVehicle) => setVehicles([...vehicles, newVehicle])}
        />
      )}
      {showEditModal && selectedVehicle && (
        <EditVehicleModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            navigate('/vehicles');
          }}
          onVehicleUpdated={(updatedVehicle) => {
            setVehicles(
              vehicles.map((vehicle) =>
                vehicle.voiture_id === updatedVehicle.voiture_id ? updatedVehicle : vehicle
              )
            );
          }}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};

export default VoitureUser;