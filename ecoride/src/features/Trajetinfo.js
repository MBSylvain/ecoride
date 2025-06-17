import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditTrajetModal from './EditTrajetModal'; // Assurez-vous que ce chemin est correct
import CreateTrajetModal from './CreateTrajetModal'; // Assurez-vous que ce chemin est correct

const Trajetinfo = () => {
  const navigate = useNavigate();
  const [trajets, setTrajets] = useState([]);
  const [trajetsLoading, setTrajetsLoading] = useState(true);
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");
  const [trajetsError, setTrajetsError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

// Fonction pour gérer la création d'un trajet
const handleTrajetCreated = (newTrajet) => {
    setTrajets((prevTrajets) => [newTrajet, ...prevTrajets]);
  };
  // Fonction pour gérer l'édition d'un trajet
  const onEditTrip = (trajet) => {
    setSelectedTrip(trajet);
    setIsEditModalOpen(true);
  };
  // Fonction pour gérer la mise à jour d'un trajet
  const handleTrajetUpdated = (updatedTrajet) => {
    setTrajets((prevTrajets) =>
      prevTrajets.map((trajet) => 
        trajet.trajet_id === updatedTrajet.trajet_id ? updatedTrajet : trajet
      )    
    );
  };

  // Recupération des informations des trajets de l'utilisateur
    useEffect(() => {
      const fetchTrajets = async () => {
        setTrajetsLoading(true);
        try {
          const response = await axios.get(`http://localhost/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`);
          
          // Handle different response formats cleanly
          if (response.data && typeof response.data === 'object') {
            if (response.data.trajets) {
              setTrajets(Array.isArray(response.data.trajets) ? response.data.trajets : []);
            } else {
              setTrajets(Array.isArray(response.data) ? response.data : []);
            }
          } else {
            setTrajets([]);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des trajets", error);
          setTrajetsError(error.message);
          setTrajets([]);
        } finally {
          setTrajetsLoading(false);
        }
      };
      
      if (utilisateur_id) {
        fetchTrajets();
      }
      
      return () => {
        // Cleanup if needed
      };
    }, [utilisateur_id]);
    console.log("utilisateur_id", utilisateur_id);
  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes trajets récents</h2>
      {trajetsLoading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : trajets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">Départ</th>
                <th className="px-4 py-3 text-left">Arrivée</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Prix</th>
                <th className="px-4 py-3 text-left">Places</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map((trajet) => (
                <tr key={trajet.trajet_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{trajet.ville_depart}</td>
                  <td className="px-4 py-3">{trajet.ville_arrivee}</td>
                  <td className="px-4 py-3">{trajet.date_depart}</td>
                  <td className="px-4 py-3">{trajet.prix} €</td>
                  <td className="px-4 py-3">{trajet.nombre_places}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onEditTrip(trajet)} className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">Détails</button>
                    <button onClick={() => navigate(`/dashboard/reservations/${trajet.trajet_id}`)} className="ml-2 text-green-600 hover:text-green-800">Réservations</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <button onClick={() => setIsCreateModalOpen(true)}
 className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Proposer un trajet</button>
          </div>
        </div>
      ) : (
        <>
          <p>Vous n'avez pas encore proposé de trajet.</p>
          <div className="mt-4">
            <button onClick={() => setIsCreateModalOpen(true)}  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
              Proposer un trajet
            </button>
          </div>
        </>
      )}

      {/* Modal pour créer un trajet */}
      <CreateTrajetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTrajetCreated={handleTrajetCreated}
      /> 
    
    <EditTrajetModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        trajet={selectedTrip}
        onTrajetUpdated={handleTrajetUpdated}
      />

    </div>
  );
 
};

export default Trajetinfo;
