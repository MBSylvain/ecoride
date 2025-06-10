import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button'; // Adjust path as needed
import EditVehicleModal from './EditVehicleModal'; // Adjust path as needed

const VehiclesSection = ( ) => {
// Récupération de l'ID utilisateur depuis le localStorage
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");
  // Définition des states pour les voitures et le chargement
  const [voitures, setVoitures] = React.useState([]);
  const [voituresLoading, setVoituresLoading] = React.useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);


// Fonction pour récupérer les voitures de l'utilisateur

  
  useEffect(() => {
    const fetchVoitures = async () => {
      setVoituresLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`);
        setVoitures(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des voitures", error);
      } finally {
        setVoituresLoading(false);
      }
    };
    
    fetchVoitures();
  }, [utilisateur_id]);
  const handleEditVehicle = (vehicle) => {
    setSelectedCar(vehicle);
    setShowModal(true);
  };



return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Mes voitures</h2>
        {voituresLoading ? (
            <div className="p-4 text-center">Chargement...</div>
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
                                    <Button 
                                      onClick={() => handleEditVehicle(voit)} 
                                      variant="text"
                                      className="mr-2"
                                    >
                                        Modifier
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <Button 
                    onClick={() => setShowModal(true)} 
                      variant="primary"
                    >
                        Ajouter une voiture
                    </Button>
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