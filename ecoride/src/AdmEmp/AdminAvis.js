import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

// Modale de détail/édition avis
const AvisModal = ({ avis, isOpen, onClose, onSave, onDelete }) => {
  const [editData, setEditData] = useState(avis || {});
  useEffect(() => {
    setEditData(avis || {});
  }, [avis]);
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
        <h2 className="mb-4 text-xl font-bold text-primary-100">Détail de l'avis</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary-100">Utilisateur</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-customGrey-100"
              value={editData.utilisateur_id || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Note</label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.note || ""}
              onChange={e => setEditData({ ...editData, note: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Commentaire</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.commentaire || ""}
              onChange={e => setEditData({ ...editData, commentaire: e.target.value })}
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
            <button
              className="px-6 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md shadow-md hover:bg-red-600"
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
    // eslint-disable-next-line
  }, []);

  const fetchAvis = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("Administrateur/AvisAdminController.php");
      setAvis(response.data);
    } catch (error) {
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
        await axiosInstance.put("Administrateur/AvisAdminController.php", avis);
        setFeedback("Avis modifié !");
      } else {
        await axiosInstance.post("Administrateur/AvisAdminController.php", avis);
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
      await axiosInstance.delete(`Administrateur/AvisAdminController.php?id=${avisId}`);
      setFeedback("Avis supprimé !");
      setShowAvisModal(false);
      fetchAvis();
    } catch (e) {
      setFeedback("Erreur lors de la suppression");
    }
  };

  return (
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Gestion des avis</h2>
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
          placeholder="Recherche utilisateur ou commentaire..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        />
        <select
          value={noteFilter}
          onChange={e => { setNoteFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        >
          <option value="Tous">Toutes les notes</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button
          className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
          onClick={() => { setSelectedAvis(null); setShowAvisModal(true); }}
        >
          Ajouter un avis
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : paginatedAvis.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Utilisateur</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Note</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Commentaire</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAvis.map(a => (
                <tr key={a.id}>
                  <td className="px-4 py-2 border-b">{a.utilisateur_id}</td>
                  <td className="px-4 py-2 border-b">{a.note}</td>
                  <td className="px-4 py-2 border-b">{a.commentaire}</td>
                  <td className="flex gap-2 px-4 py-2 border-b">
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 rounded-md bg-primary-100 hover:bg-customGreen2-100"
                      onClick={() => { setSelectedAvis(a); setShowAvisModal(true); }}
                    >
                      Détail
                    </button>
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md hover:bg-red-600"
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
        </div>
      ) : (
        <p className="text-gray-600">Aucun avis trouvé.</p>
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