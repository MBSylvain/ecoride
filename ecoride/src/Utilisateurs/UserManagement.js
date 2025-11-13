import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api-ecride-production.up.railway.app/Controllers/UserController.php');
        setUsers(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`https://api-ecride-production.up.railway.app/Controllers/UserController.php?user_id=${userId}`);
        setUsers(users.filter((user) => user.user_id !== userId));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      }
    }
  };

  // Open edit modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Gestion des utilisateurs</h2>
      {isLoading ? (
        <p>Chargement...</p>
      ) : users.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-2 py-1 text-white bg-blue-500 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
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
        <p>Aucun utilisateur trouvé.</p>
      )}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
      >
        Ajouter un utilisateur
      </button>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onUserCreated={(newUser) => setUsers([...users, newUser])}
        />
      )}
      {showEditModal && selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={(updatedUser) => {
            setUsers(
              users.map((user) =>
                user.user_id === updatedUser.user_id ? updatedUser : user
              )
            );
          }}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagement;