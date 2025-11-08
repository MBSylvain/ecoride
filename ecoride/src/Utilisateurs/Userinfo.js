import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import EditUserModal from './EditUserModal';

const UserInfoSection = () => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utilisateur_id] = useState(localStorage.getItem('utilisateur_id'));

  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const response = await axiosInstance.get(
        `UtilisateurController.php?utilisateur_id=${utilisateur_id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      setUser(response.data);
      console.log("Données utilisateur chargées:", response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (utilisateur_id) {
      fetchUserData();
    }
  }, [utilisateur_id]);

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    fetchUserData();
  };

  return (
    <div className="max-w-3xl p-8 mx-auto mb-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Mes informations personnelles</h2>
      {userLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : user ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-600">Nom :</p>
            <p className="font-semibold text-primary-100">{user.nom}</p>
          </div>
          <div>
            <p className="text-gray-600">Prénom :</p>
            <p className="font-semibold text-primary-100">{user.prenom}</p>
          </div>
          <div>
            <p className="text-gray-600">Email :</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Téléphone :</p>
            <p className="font-medium">{user.telephone || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-gray-600">Adresse :</p>
            <p className="font-medium">{user.adresse || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-gray-600">Date inscription :</p>
            <p className="font-medium">{user.date_inscription || "Non renseigné"}</p>
          </div>
          <div className="flex justify-end col-span-2 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 font-bold text-white transition-all duration-200 border-2 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100 border-customPink-100 hover:border-customPink-80 hover:text-customPink-80"
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
        <p className="text-gray-600">Aucune information disponible.</p>
      )}
    </div>
  );
};

export default UserInfoSection;