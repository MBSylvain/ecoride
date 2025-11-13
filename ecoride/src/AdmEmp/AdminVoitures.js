import React, { useEffect, useState } from "react";
import axios from "axios";

// Modale de création/édition voiture
const VoitureModal = ({ voiture, isOpen, onClose, onSave, onDelete }) => {
  const [editData, setEditData] = useState(voiture || {});
  useEffect(() => {
    setEditData(voiture || {});
  }, [voiture]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold text-primary-100">{voiture ? "Modifier" : "Ajouter"} une voiture</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary-100">Modèle</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.modele || ""}
              onChange={e => setEditData({ ...editData, modele: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Immatriculation</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.immatriculation || ""}
              onChange={e => setEditData({ ...editData, immatriculation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Énergie</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.energie || ""}
              onChange={e => setEditData({ ...editData, energie: e.target.value })}
            >
              <option value="">Sélectionner</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Électrique">Électrique</option>
              <option value="Hybride">Hybride</option>
              <option value="GPL">GPL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Couleur</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.couleur || ""}
              onChange={e => setEditData({ ...editData, couleur: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Places</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.nombre_places || ""}
              onChange={e => setEditData({ ...editData, nombre_places: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Date 1ère immatriculation</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.date_premiere_immatriculation || ""}
              onChange={e => setEditData({ ...editData, date_premiere_immatriculation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.description || ""}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
              onClick={() => onSave(editData)}
            >
              Enregistrer
            </button>
            {voiture && (
              <button
                className="px-6 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md shadow-md hover:bg-red-600"
                onClick={() => {
                  if (window.confirm("Supprimer cette voiture ?")) onDelete(editData.voiture_id);
                }}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminVoitures = () => {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [selectedVoiture, setSelectedVoiture] = useState(null);
  const [showVoitureModal, setShowVoitureModal] = useState(false);

  // Filtres et pagination
  const [search, setSearch] = useState("");
  const [energieFilter, setEnergieFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const voituresPerPage = 10;

  useEffect(() => {
    fetchVoitures();
  }, []);

  const fetchVoitures = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ecride-production.up.railway.app/ControllersAdministrateur/VoitureAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setVoitures(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) {
      setFeedback("Erreur lors du chargement des voitures");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredVoitures = voitures
    .filter(v =>
      (search === "" ||
        v.modele?.toLowerCase().includes(search.toLowerCase()) ||
        v.immatriculation?.toLowerCase().includes(search.toLowerCase()) ||
        v.couleur?.toLowerCase().includes(search.toLowerCase()))
      && (energieFilter === "Tous" || v.energie === energieFilter)
    );

  // Pagination
  const totalPages = Math.ceil(filteredVoitures.length / voituresPerPage);
  const paginatedVoitures = filteredVoitures.slice((currentPage - 1) * voituresPerPage, currentPage * voituresPerPage);

  const handleSaveVoiture = async (voiture) => {
    try {
      if (voiture.voiture_id) {
        await axios.put("https://api-ecride-production.up.railway.app/ControllersAdministrateur/VoitureAdminController.php", voiture, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Voiture modifiée !");
      } else {
        await axios.post("https://api-ecride-production.up.railway.app/ControllersAdministrateur/VoitureAdminController.php", voiture, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Voiture ajoutée !");
      }
      setShowVoitureModal(false);
      fetchVoitures();
    } catch (e) {
      setFeedback("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteVoiture = async (voitureId) => {
    try {
      await axios.delete(`https://api-ecride-production.up.railway.app/ControllersAdministrateur/VoitureAdminController.php?voiture_id=${voitureId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setFeedback("Voiture supprimée !");
      setShowVoitureModal(false);
      fetchVoitures();
    } catch (e) {
      setFeedback("Erreur lors de la suppression");
    }
  };

  return (
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Gestion des voitures</h2>
      {feedback && (
        <div className="flex items-center justify-between p-4 mb-4 text-center text-white rounded-md shadow bg-customGreen2-100">
          <span>{feedback}</span>
          <button className="ml-4 text-sm text-white" onClick={() => setFeedback(null)}>x</button>
        </div>
      )}
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Recherche modèle, immatriculation ou couleur..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        />
        <select
          value={energieFilter}
          onChange={e => { setEnergieFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        >
          <option value="Tous">Toutes les énergies</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Électrique">Électrique</option>
          <option value="Hybride">Hybride</option>
          <option value="GPL">GPL</option>
        </select>
        <button
          className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
          onClick={() => { setSelectedVoiture(null); setShowVoitureModal(true); }}
        >
          Ajouter une voiture
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : paginatedVoitures.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Modèle</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Immatriculation</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Énergie</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Couleur</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Places</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date 1ère immatriculation</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Description</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVoitures.map(voiture => (
                <tr key={voiture.voiture_id}>
                  <td className="px-4 py-2 border-b">{voiture.modele}</td>
                  <td className="px-4 py-2 border-b">{voiture.immatriculation}</td>
                  <td className="px-4 py-2 border-b">{voiture.energie}</td>
                  <td className="px-4 py-2 border-b">{voiture.couleur}</td>
                  <td className="px-4 py-2 border-b">{voiture.nombre_places}</td>
                  <td className="px-4 py-2 border-b">{voiture.date_premiere_immatriculation}</td>
                  <td className="px-4 py-2 border-b">{voiture.description || "-"}</td>
                  <td className="flex flex-wrap gap-2 px-4 py-2 border-b">
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 rounded-md bg-primary-100 hover:bg-customGreen2-100"
                      onClick={() => { setSelectedVoiture(voiture); setShowVoitureModal(true); }}
                    >
                      Détail
                    </button>
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md hover:bg-red-600"
                      onClick={() => {
                        if (window.confirm("Supprimer cette voiture ?")) handleDeleteVoiture(voiture.voiture_id);
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">Aucune voiture trouvée.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 my-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${currentPage === idx + 1 ? "bg-customGreen-100 text-white" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      <VoitureModal
        voiture={selectedVoiture}
        isOpen={showVoitureModal}
        onClose={() => setShowVoitureModal(false)}
        onSave={handleSaveVoiture}
        onDelete={handleDeleteVoiture}
      />
    </section>
  );
};

export default AdminVoitures;