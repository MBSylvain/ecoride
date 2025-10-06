import React, { useState, useEffect } from 'react';
import axios from 'axios';

const defaultPrefs = {
  fumeur_autorise: 0,
  animaux_autorises: 0,
  bagages_volumineux: 0,
  musique_autorisee: 1,
  discussion: 1,
  pauses_prevues: 0,
  climatisation: 1,
  nourriture_autorisee: 1,
  type_conduite: '',
  accessibilite_pmr: 0,
};

const PreferencesConducteur = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newPrefs, setNewPrefs] = useState(defaultPrefs);
  const [utilisateur_id] = useState(localStorage.getItem('utilisateur_id'));

  // Charger les préférences du conducteur connecté
  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost/api/Controllers/PreferenceConducteurController.php?utilisateur_id=${utilisateur_id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      setPreferences(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des préférences", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (utilisateur_id) {
      fetchPreferences();
    }
  }, [utilisateur_id]);

  // Supprimer une préférence
  const handleDelete = async (preference_id) => {
    if (!window.confirm('Supprimer cette préférence ?')) return;
    try {
      await axios.delete(
        `http://localhost/api/Controllers/PreferenceConducteurController.php?preference_id=${preference_id}`,
        { withCredentials: true }
      );
      setPreferences(prefs => prefs.filter(p => p.preference_id !== preference_id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  // Préparer la modification
  const handleEdit = (pref) => {
    setEditId(pref.preference_id);
    setEditValue(pref.valeur);
  };

  // Sauvegarder la modification
  const handleSave = async (preference_id) => {
    try {
      await axios.put(
        `http://localhost/api/Controllers/PreferenceConducteurController.php`,
        { preference_id, valeur: editValue },
        { withCredentials: true }
      );
      setPreferences(prefs =>
        prefs.map(p => p.preference_id === preference_id ? { ...p, valeur: editValue } : p)
      );
      setEditId(null);
    } catch (error) {
      console.error("Erreur lors de la modification", error);
    }
  };

  // Gérer les changements du formulaire d'ajout
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNewPrefs({
      ...newPrefs,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  // Enregistrer les nouvelles préférences
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      if (preferences && preferences.length > 0) {
        // Mise à jour
        await axios.put(
          `http://localhost/api/Controllers/PreferenceConducteurController.php`,
          { utilisateur_id, ...newPrefs, preference_id: preferences[0].preference_id },
          { withCredentials: true }
        );
      } else {
        // Création
        await axios.post(
          `http://localhost/api/Controllers/PreferenceConducteurController.php`,
          { utilisateur_id, ...newPrefs },
          { withCredentials: true }
        );
      }
      setShowAdd(false);
      setNewPrefs(defaultPrefs);
      fetchPreferences();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences", error);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes préférences conducteur</h2>
      <button
        className="px-4 py-2 mb-4 text-white rounded bg-primary-100 hover:bg-primary-200"
        onClick={() => {
          // Si l'utilisateur a déjà des préférences, pré-remplir le formulaire
          if (preferences && preferences.length > 0) {
            setNewPrefs({
              ...preferences[0]
            });
          } else {
            setNewPrefs(defaultPrefs);
          }
          setShowAdd(true);
        }}
      >
        {preferences && preferences.length > 0 ? "Modifier mes préférences" : "Ajouter une préférence"}
      </button>

      {/* Modale d'ajout de préférences */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Sélectionnez vos préférences</h3>
            <form onSubmit={handleAddSubmit} className="space-y-2">
              <label>
                <input
                  type="checkbox"
                  name="fumeur_autorise"
                  checked={!!newPrefs.fumeur_autorise}
                  onChange={handleChange}
                /> Fumeur autorisé
              </label>
              <label>
                <input
                  type="checkbox"
                  name="animaux_autorises"
                  checked={!!newPrefs.animaux_autorises}
                  onChange={handleChange}
                /> Animaux autorisés
              </label>
              <label>
                <input
                  type="checkbox"
                  name="bagages_volumineux"
                  checked={!!newPrefs.bagages_volumineux}
                  onChange={handleChange}
                /> Bagages volumineux
              </label>
              <label>
                <input
                  type="checkbox"
                  name="musique_autorisee"
                  checked={!!newPrefs.musique_autorisee}
                  onChange={handleChange}
                /> Musique autorisée
              </label>
              <label>
                <input
                  type="checkbox"
                  name="discussion"
                  checked={!!newPrefs.discussion}
                  onChange={handleChange}
                /> Discussion autorisée
              </label>
              <label>
                <input
                  type="checkbox"
                  name="pauses_prevues"
                  checked={!!newPrefs.pauses_prevues}
                  onChange={handleChange}
                /> Pauses prévues
              </label>
              <label>
                <input
                  type="checkbox"
                  name="climatisation"
                  checked={!!newPrefs.climatisation}
                  onChange={handleChange}
                /> Climatisation
              </label>
              <label>
                <input
                  type="checkbox"
                  name="nourriture_autorisee"
                  checked={!!newPrefs.nourriture_autorisee}
                  onChange={handleChange}
                /> Nourriture autorisée
              </label>
              <label>
                Type de conduite :
                <select
                  name="type_conduite"
                  value={newPrefs.type_conduite}
                  onChange={handleChange}
                  className="ml-2 border rounded"
                >
                  <option value="">Sélectionner</option>
                  <option value="souple">Souple</option>
                  <option value="normale">Normale</option>
                  <option value="rapide">Rapide</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="accessibilite_pmr"
                  checked={!!newPrefs.accessibilite_pmr}
                  onChange={handleChange}
                /> Accessibilité PMR
              </label>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowAdd(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded bg-primary-100 hover:bg-primary-200"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : preferences && preferences.length > 0 ? (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">Préférences actuelles :</h3>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <li>Fumeur autorisé : <strong>{preferences[0].fumeur_autorise ? "Oui" : "Non"}</strong></li>
            <li>Animaux autorisés : <strong>{preferences[0].animaux_autorises ? "Oui" : "Non"}</strong></li>
            <li>Bagages volumineux : <strong>{preferences[0].bagages_volumineux ? "Oui" : "Non"}</strong></li>
            <li>Musique autorisée : <strong>{preferences[0].musique_autorisee ? "Oui" : "Non"}</strong></li>
            <li>Discussion : <strong>{preferences[0].discussion ? "Oui" : "Non"}</strong></li>
            <li>Pauses prévues : <strong>{preferences[0].pauses_prevues ? "Oui" : "Non"}</strong></li>
            <li>Climatisation : <strong>{preferences[0].climatisation ? "Oui" : "Non"}</strong></li>
            <li>Nourriture autorisée : <strong>{preferences[0].nourriture_autorisee ? "Oui" : "Non"}</strong></li>
            <li>Type de conduite : <strong>{preferences[0].type_conduite || "Non renseigné"}</strong></li>
            <li>Accessibilité PMR : <strong>{preferences[0].accessibilite_pmr ? "Oui" : "Non"}</strong></li>
          </ul>
        </div>
      ) : (
        <p>Aucune préférence enregistrée.</p>
      )}
    </div>
  );
};

export default PreferencesConducteur;