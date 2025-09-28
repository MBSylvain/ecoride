import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EditVehicleModal from '../Voitures/EditVehicleModal'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const VehiclesSection = ( ) => {
// Récupération de l'ID utilisateur depuis le localStorage
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");
  // Définition des states pour les voitures et le chargement
  const [voitures, setVoitures] = useState([]);
  const [voituresLoading, setVoituresLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
    const navigate = useNavigate();


// Fonction pour récupérer les voitures de l'utilisateur

  useEffect(() => {
    const fetchVoitures = async () => {
      setVoituresLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`);
        
        // Handle different response formats cleanly
        if (response.data && typeof response.data === 'object') {
          if (response.data.voitures) {
            setVoitures(Array.isArray(response.data.voitures) ? response.data.voitures : []);
          } else {
            setVoitures(Array.isArray(response.data) ? response.data : []);
          }
        } else {
          setVoitures([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des voitures", error);
        setVoitures([]);
      } finally {
        setVoituresLoading(false);
      }
    };
    
    if (utilisateur_id) {
      fetchVoitures();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [utilisateur_id]);
  const handleEditVehicle = (vehicle) => {
    setSelectedCar(vehicle);
    setShowModal(true);
  };

  const handleUpdateVehicle = (voiture_id) => {
// Using URL parameters (cleaner for REST-style routes)
//navigate(`../UpdateVehicleForm/${voiture_id}`);

// OR using query parameters (better for optional/multiple parameters)
navigate(`../UpdateVehicleForm/voiture_id=${voiture_id}`);
  };



return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes voitures</h2>
        {voituresLoading ? (
            <div className="p-4 text-center text-primary-90">Chargement...</div>
        ) : voitures.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="px-4 py-3 text-left">Modèle</th>
                            <th className="px-4 py-3 text-left">Immatriculation</th>
                            <th className="px-4 py-3 text-left">Énergie</th>
                            <th className="px-4 py-3 text-left">Couleur</th>
                            <th className="px-4 py-3 text-left">Places</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voitures.map((voit) => (
                            <tr key={voit.voiture_id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{voit.modele}</td>
                                <td className="px-4 py-3">{voit.immatriculation}</td>
                                <td className="px-4 py-3">{voit.energie}</td>
                                <td className="px-4 py-3">{voit.couleur}</td>
                                <td className="px-4 py-3">{voit.nombre_places}</td>
                                <td className="px-4 py-3">
                                    <button 
                                      onClick={() => handleUpdateVehicle(voit.voiture_id)} 
                                      voiture_id={voit.voiture_id}
                                      type="button"
                                      className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-pink-700"
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <button 
                    onClick={() => setShowModal(true)} 
                      variant="primary"
                    >
                        Ajouter une voiture
                    </button>
                </div>
            </div>
        ) : (
            <div>
                <p>Vous n'avez pas encore ajouté de voiture.</p>
                <div className="mt-4">
                    <button 
                    className="px-4 py-2 text-white border-2 rounded bg-primary-100 border-customPink-100 hover:bg-white hover:border-customPink-80 hover:text-customPink-80"
                      onClick={() => setShowModal(true)} 
                      variant="primary">
                    
                        Ajouter une voiture
                    </button>
                </div>
            </div>
        )}
        
        {/* Ajoutez ici votre modal de modification */}
       
          <EditVehicleModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}                                  
            />

        
        
    </div>
);
};

export default VehiclesSection;