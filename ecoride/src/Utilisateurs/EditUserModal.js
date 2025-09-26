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
        `http://localhost/api/Controllers/UserController.php?user_id=${user.user_id}`,
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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rôle</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Utilisateur">Utilisateur</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Modifier'}
        </button>
      </form>
    </Modal>
  );
};

export default EditUserModal;