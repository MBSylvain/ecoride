import React, { useEffect, useState } from "react";
import axios from "axios";

// Modale de détail/édition avis
const AvisModal = ({ avis, isOpen, onClose, onSave, onDelete }) => {
  const [editData, setEditData] = useState(avis || {});
  useEffect(() => {
    setEditData(avis || {});
  }, [avis]);
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
        <h2 className="mb-4 text-xl font-bold">Détail avis</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Utilisateur</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.utilisateur_id || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Note</label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full px-2 py-1 border rounded"
              value={editData.note || ""}
              onChange={e => setEditData({ ...editData, note: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Commentaire</label>
            <textarea
              className="w-full px-2 py-1 border rounded"
              value={editData.commentaire || ""}
              onChange={e => setEditData({ ...editData, commentaire: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => onSave(editData)}
            >
              Enregistrer
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              onClick={() => {
                if (window.confirm("Supprimer cet avis ?")) onDelete(editData.id);
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAvis = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [selectedAvis, setSelectedAvis] = useState(null);
  const [showAvisModal, setShowAvisModal] = useState(false);

  // Filtres et pagination
  const [search, setSearch] = useState("");
  const [noteFilter, setNoteFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const avisPerPage = 10;

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setAvis(res.data.data || res.data || []);
    } catch (e) {
      setFeedback("Erreur lors du chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredAvis = avis
    .filter(a =>
      (search === "" ||
        String(a.utilisateur_id).toLowerCase().includes(search.toLowerCase()) ||
        (a.commentaire || "").toLowerCase().includes(search.toLowerCase()))
      && (noteFilter === "Tous" || String(a.note) === noteFilter)
    );

  // Pagination
  const totalPages = Math.ceil(filteredAvis.length / avisPerPage);
  const paginatedAvis = filteredAvis.slice((currentPage - 1) * avisPerPage, currentPage * avisPerPage);

  const handleSaveAvis = async (avis) => {
    try {
      if (avis.id) {
        await axios.put("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", avis, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Avis modifié !");
      } else {
        await axios.post("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", avis, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Avis ajouté !");
      }
      setShowAvisModal(false);
      fetchAvis();
    } catch (e) {
      setFeedback("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteAvis = async (avisId) => {
    try {
      await axios.delete(`http://localhost/api/ControllersAdministrateur/AvisAdminController.php?id=${avisId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setFeedback("Avis supprimé !");
      setShowAvisModal(false);
      fetchAvis();
    } catch (e) {
      setFeedback("Erreur lors de la suppression");
    }
  };

  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">Avis</h2>
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
          placeholder="Recherche utilisateur ou commentaire..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-2 py-1 border rounded"
        />
        <select value={noteFilter} onChange={e => { setNoteFilter(e.target.value); setCurrentPage(1); }} className="px-2 py-1 border rounded">
          <option value="Tous">Toutes les notes</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <button
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        onClick={() => { setSelectedAvis(null); setShowAvisModal(true); }}
      >
        Ajouter un avis
      </button>
      {loading ? (
        <p>Chargement...</p>
      ) : paginatedAvis.length > 0 ? (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Utilisateur</th>
              <th className="px-2 py-1 border">Note</th>
              <th className="px-2 py-1 border">Commentaire</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAvis.map(a => (
              <tr key={a.id}>
                <td className="px-2 py-1 border">{a.utilisateur_id}</td>
                <td className="px-2 py-1 border">{a.note}</td>
                <td className="px-2 py-1 border">{a.commentaire}</td>
                <td className="flex flex-wrap gap-2 px-2 py-1 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedAvis(a); setShowAvisModal(true); }}
                  >
                    Détail
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => {
                      if (window.confirm("Supprimer cet avis ?")) handleDeleteAvis(a.id);
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
        <p>Aucun avis trouvé.</p>
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

      <AvisModal
        avis={selectedAvis}
        isOpen={showAvisModal}
        onClose={() => setShowAvisModal(false)}
        onSave={handleSaveAvis}
        onDelete={handleDeleteAvis}
      />
    </section>
  );
};

export default AdminAvis;