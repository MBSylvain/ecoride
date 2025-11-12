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
          `https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`,
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
        setTrajets(response.data || []);
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      try {
        await axios.delete(
          `https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php?trajet_id=${trajetId}`,
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
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
    <div className="p-6 font-sans bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Mes trajets</h2>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : trajets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Ville de départ</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Ville d'arrivée</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map((trajet) => (
                <tr key={trajet.trajet_id}>
                  <td className="px-4 py-2 border-b">{trajet.ville_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.ville_arrivee}</td>
                  <td className="px-4 py-2 border-b">{trajet.date_depart}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleEdit(trajet)}
                      className="px-4 py-2 mr-2 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(trajet.trajet_id)}
                      className="px-4 py-2 font-bold text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-600 rounded-lg bg-customGrey-100">
          Aucun trajet trouvé.
        </div>
      )}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-6 py-2 mt-6 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
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