import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const EditUserModal = ({ isOpen, onClose, onUserUpdated, user }) => {
  const [formData, setFormData] = useState(user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `https://api-ecride-production.up.railway.app/api/Controllers/UserController.php?user_id=${user.user_id}`,
        formData
      );
      onUserUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un utilisateur">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl p-6 mx-auto space-y-6 bg-white shadow-2xl rounded-2xl"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Nom</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Prénom</label>
                    <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Téléphone</label>
                    <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col md:col-span-2">
                    <label className="mb-2 font-semibold text-gray-700">Adresse</label>
                    <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Date de naissance</label>
                    <input
                        type="date"
                        name="date_naissance"
                        value={formData.date_naissance}
                        onChange={handleChange}
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Pseudo</label>
                    <input
                        type="text"
                        name="pseudo"
                        value={formData.pseudo}
                        onChange={handleChange}
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        name="mot_de_passe"
                        value={formData.mot_de_passe}
                        onChange={handleChange}
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">Rôle</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="Utilisateur">Utilisateur</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-4 font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Enregistrement...' : 'Modifier'}
            </button>
        </form>
    </Modal>
);
};

export default EditUserModal;