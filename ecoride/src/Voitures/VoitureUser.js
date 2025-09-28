import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateVehicleModal from './CreateVehicleModal';
import EditVehicleModal from './EditVehicleModal';

const VoitureUser = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const utilisateur_id = localStorage.getItem('utilisateur_id');

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost/api/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`,
          { withCredentials: true },
          { headers: { 'Content-Type': 'application/json' } }
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
          `http://localhost/api/Controllers/VoitureController.php?voiture_id=${vehicleId}`,
          { withCredentials: true },
          { headers: { 'Content-Type': 'application/json' } }
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
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes véhicules</h2>
      {isLoading ? (
        <p>Chargement...</p>
      ) : vehicles.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Modèle</th>
              <th>Immatriculation</th>
              <th>Énergie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.voiture_id}>
                <td>{vehicle.modele}</td>
                <td>{vehicle.immatriculation}</td>
                <td>{vehicle.energie}</td>
                <td>
                  <button
                    onClick={() => handleEdit(vehicle.voiture_id)}
                    className="px-2 py-1 text-white bg-blue-500 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.voiture_id)}
                    className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun véhicule trouvé.</p>
      )}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
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
          onClose={() => setShowEditModal(false)}
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