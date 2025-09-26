import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateTrajetModal from './CreateTrajetModal';
import EditTrajetModal from './EditTrajetModal';

const TrajetUser = () => {
  const [trajets, setTrajets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrajet, setSelectedTrajet] = useState(null);

  const utilisateur_id = localStorage.getItem('utilisateur_id');

  // Fetch trajets
  useEffect(() => {
    const fetchTrajets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`,
          { withCredentials: true },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setTrajets(response.data || []);
        console.log('Trajets récupérés:', response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des trajets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (utilisateur_id) {
      fetchTrajets();
    }
  }, [utilisateur_id]);

  // Delete trajet
  const handleDelete = async (trajetId) => {
    console.log('Suppression du trajet avec ID:', trajetId);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      try {
        await axios.delete(
          `http://localhost/api/Controllers/TrajetController.php?trajet_id=${trajetId}`,
            { withCredentials: true },
            { headers: { 'Content-Type': 'application/json' } },
            { data: { action: 'DELETE' } }
        );
        setTrajets(trajets.filter((trajet) => trajet.trajet_id !== trajetId));
      } catch (error) {
        console.error('Erreur lors de la suppression du trajet:', error);
      }
    }
  };

  // Open edit modal
  const handleEdit = (trajet) => {
    setSelectedTrajet(trajet);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes trajets</h2>
      {isLoading ? (
        <p>Chargement...</p>
      ) : trajets.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Ville de départ</th>
              <th>Ville d'arrivée</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trajets.map((trajet) => (
              <tr key={trajet.trajet_id}>
                <td>{trajet.ville_depart}</td>
                <td>{trajet.ville_arrivee}</td>
                <td>{trajet.date_depart}</td>
                <td>
                  <button
                    onClick={() => handleEdit(trajet)}
                    className="px-2 py-1 text-white bg-blue-500 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(trajet.trajet_id)}
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
        <p>Aucun trajet trouvé.</p>
      )}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
      >
        Ajouter un trajet
      </button>

      {/* Modals */}
      {showCreateModal && (
        <CreateTrajetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTrajetCreated={(newTrajet) => setTrajets([...trajets, newTrajet])}
        />
      )}
      {showEditModal && selectedTrajet && (
        <EditTrajetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onTrajetUpdated={(updatedTrajet) => {
            setTrajets(
              trajets.map((trajet) =>
                trajet.trajet_id === updatedTrajet.trajet_id ? updatedTrajet : trajet
              )
            );
          }}
          trajet={selectedTrajet}
        />
      )}
    </div>
  );
};

export default TrajetUser;