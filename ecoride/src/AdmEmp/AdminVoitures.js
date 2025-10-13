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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold">{voiture ? "Modifier" : "Ajouter"} une voiture</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Modèle</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.modele || ""}
              onChange={e => setEditData({ ...editData, modele: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Immatriculation</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.immatriculation || ""}
              onChange={e => setEditData({ ...editData, immatriculation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Énergie</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.energie || ""}
              onChange={e => setEditData({ ...editData, energie: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Couleur</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.couleur || ""}
              onChange={e => setEditData({ ...editData, couleur: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Places</label>
            <input
              type="number"
              className="w-full px-2 py-1 border rounded"
              value={editData.nombre_places || ""}
              onChange={e => setEditData({ ...editData, nombre_places: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date 1ère immatriculation</label>
            <input
              type="date"
              className="w-full px-2 py-1 border rounded"
              value={editData.date_premiere_immatriculation || ""}
              onChange={e => setEditData({ ...editData, date_premiere_immatriculation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full px-2 py-1 border rounded"
              value={editData.description || ""}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => onSave(editData)}
            >
              Enregistrer
            </button>
            {voiture && (
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
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
      const res = await axios.get("http://localhost/api/ControllersAdministrateur/VoitureAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setVoitures(res.data.data || res.data || []);
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
        await axios.put("http://localhost/api/ControllersAdministrateur/VoitureAdminController.php", voiture, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Voiture modifiée !");
      } else {
        await axios.post("http://localhost/api/ControllersAdministrateur/VoitureAdminController.php", voiture, {
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
      await axios.delete(`http://localhost/api/ControllersAdministrateur/VoitureAdminController.php?voiture_id=${voitureId}`, {
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
    <section>
      <h2 className="mb-2 text-lg font-semibold">Voitures</h2>
      {feedback && (
        <div className="p-2 mb-2 text-center text-green-800 bg-green-100 rounded">
          {feedback}
          <button className="ml-4 text-sm text-green-900" onClick={() => setFeedback(null)}>x</button>
        </div>
      )}
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Recherche modèle, immatriculation ou couleur..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-2 py-1 border rounded"
        />
        <select value={energieFilter} onChange={e => { setEnergieFilter(e.target.value); setCurrentPage(1); }} className="px-2 py-1 border rounded">
          <option value="Tous">Toutes les énergies</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Électrique">Électrique</option>
          <option value="Hybride">Hybride</option>
        </select>
      </div>
      <button
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        onClick={() => { setSelectedVoiture(null); setShowVoitureModal(true); }}
      >
        Ajouter une voiture
      </button>
      {loading ? (
        <p>Chargement...</p>
      ) : paginatedVoitures.length > 0 ? (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Modèle</th>
              <th className="px-2 py-1 border">Immatriculation</th>
              <th className="px-2 py-1 border">Énergie</th>
              <th className="px-2 py-1 border">Couleur</th>
              <th className="px-2 py-1 border">Places</th>
              <th className="px-2 py-1 border">Date 1ère immatriculation</th>
              <th className="px-2 py-1 border">Description</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVoitures.map(voiture => (
              <tr key={voiture.voiture_id}>
                <td className="px-2 py-1 border">{voiture.modele}</td>
                <td className="px-2 py-1 border">{voiture.immatriculation}</td>
                <td className="px-2 py-1 border">{voiture.energie}</td>
                <td className="px-2 py-1 border">{voiture.couleur}</td>
                <td className="px-2 py-1 border">{voiture.nombre_places}</td>
                <td className="px-2 py-1 border">{voiture.date_premiere_immatriculation}</td>
                <td className="px-2 py-1 border">{voiture.description || "-"}</td>
                <td className="flex flex-wrap gap-2 px-2 py-1 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedVoiture(voiture); setShowVoitureModal(true); }}
                  >
                    Détail
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
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
      ) : (
        <p>Aucune voiture trouvée.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 my-4">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-2 py-1 border rounded ${currentPage === idx + 1 ? "bg-customGreen-100 text-white" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 border rounded"
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