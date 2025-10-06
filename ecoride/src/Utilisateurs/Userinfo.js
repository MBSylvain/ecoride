import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUserModal from './EditUserModal'; // Chemin relatif correct
const UserInfoSection = () => {


  // Définition des states au niveau supérieur du composant
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utilisateur_id] = useState(localStorage.getItem('utilisateur_id'));
  
  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const response = await axios.get(`http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${utilisateur_id}`,
      {withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
        
      });
      
      setUser(response.data);
      console.log("Données utilisateur chargées:", response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur", error);
    } finally {
      setUserLoading(false);
    }
  };
  
  // useEffect à l'intérieur du composant
  useEffect(() => {
    if (utilisateur_id) {
      fetchUserData();
    }
  }, [utilisateur_id]);

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    // Optionnel: rechargez les données complètes depuis le serveur
    fetchUserData();
  };

  // Le JSX reste inchangé
  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes informations personnelles</h2>
      {userLoading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : user ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><p className="text-gray-600">Nom:</p><p className="font-medium">{user.nom}</p></div>
          <div><p className="text-gray-600">Prénom:</p><p className="font-medium">{user.prenom}</p></div>
          <div><p className="text-gray-600">Email:</p><p className="font-medium">{user.email}</p></div>
          <div><p className="text-gray-600">Téléphone:</p><p className="font-medium">{user.telephone || "Non renseigné"}</p></div>
          <div><p className="text-gray-600">Adresse:</p><p className="font-medium">{user.adresse || "Non renseigné"}</p></div>
          <div><p className="text-gray-600">Date inscription:</p><p className="font-medium">{user.date_inscription || "Non renseigné"}</p></div>
          <div className="mt-4">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="px-4 py-2 text-white border-2 rounded bg-primary-100 border-customPink-100 hover:bg-white hover:border-customPink-80 hover:text-customPink-80"
            >
              Modifier mes informations
            </button>
            <EditUserModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              user={user}
              onUserUpdated={handleUserUpdated}
            />
    


          </div>
        </div>
      ) : (
        <p>Aucune information disponible.</p>
      )}
      
     
    </div>
  );
};

export default UserInfoSection;