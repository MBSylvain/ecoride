import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../features/Modal';
import Bouton from '../components/Button';

const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    pseudo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Initialiser le formulaire avec les données utilisateur actuelles
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        pseudo: user.pseudo || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await axios.post('https://api-ecride-production.up.railway.app/Controllers/UtilisateurController.php',
        {
          ...formData,
          utilisateur_id: user.id,
          action: 'PUT'
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        // Notifier le parent que la mise à jour a réussi
        onUserUpdated(response.data.utilisateur || formData);
        onClose();
      } else {
        setError(response.data.error || 'Une erreur est survenue lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };
  
return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-primary-100" title="Modifier mes informations">
        {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} action={'PUT'} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium text-primary-100">Nom</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium text-primary-100">Prénom</label>
                    <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
            </div>
            
            <div>
                <label className="block mb-1 text-sm font-medium text-primary-100">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            
            <div>
                <label className="block mb-1 text-sm font-medium text-primary-100">Téléphone</label>
                <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            
            <div>
                <label className="block mb-1 text-sm font-medium text-primary-100">Adresse</label>
                <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="2"
                ></textarea>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-primary-100">Date de naissance</label>
                    <input type='date'
                            name="date_naissance"
                            value={formData.date_naissance}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Laissez vide pour ne pas modifier"
                            
                        />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-primary-900">Mot de passe</label>
                    <input
                            type="password"
                            name="mot_de_passe"
                            value={formData.mot_de_passe}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Laissez vide pour ne pas modifier"
                            required
                        />
            </div>

                 

            
            <div>
                <label className="block mb-1 text-sm font-medium text-primary-900">Pseudo</label>
                <input
                    type="text"
                    name="pseudo"
                    value={formData.pseudo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            
            <div className="flex justify-end pt-4 space-x-3 border-t">
                
                    
                <Bouton
                    type="submit"
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    disabled={isSubmitting}
                > Enregistrer
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Bouton>
            </div>
        </form>
    </Modal>
);
};

export default EditUserModal;