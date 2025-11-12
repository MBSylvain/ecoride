import React, { useEffect, useState } from "react";
import axios from "axios";

// Modale de création/édition trajet
const TrajetModal = ({ trajet, isOpen, onClose, onSave, onDelete }) => {
  const [editData, setEditData] = useState(trajet || {});
  useEffect(() => {
    setEditData(trajet || {});
  }, [trajet]);
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
        <h2 className="mb-4 text-xl font-bold text-primary-100">{trajet ? "Modifier" : "Ajouter"} un trajet</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary-100">Départ</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.ville_depart || ""}
              onChange={e => setEditData({ ...editData, ville_depart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Arrivée</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.ville_arrivee || ""}
              onChange={e => setEditData({ ...editData, ville_arrivee: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Adresse départ</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.adresse_depart || ""}
              onChange={e => setEditData({ ...editData, adresse_depart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Adresse arrivée</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.adresse_arrivee || ""}
              onChange={e => setEditData({ ...editData, adresse_arrivee: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Date départ</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.date_depart || ""}
              onChange={e => setEditData({ ...editData, date_depart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-100">Heure départ</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.heure_depart || ""}
              onChange={e => setEditData({ ...editData, heure_depart: e.target.value })}
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
            <label className="block text-sm font-semibold text-primary-100">Prix (€)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={editData.prix || ""}
              onChange={e => setEditData({ ...editData, prix: e.target.value })}
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
            {trajet && (
              <button
                className="px-6 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md shadow-md hover:bg-red-600"
                onClick={() => {
                  if (window.confirm("Supprimer ce trajet ?")) onDelete(editData.trajet_id);
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

const AdminTrajet = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [showTrajetModal, setShowTrajetModal] = useState(false);

  // Filtres et pagination
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const trajetsPerPage = 10;

  useEffect(() => {
    fetchTrajets();
  }, []);

  const fetchTrajets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ecride-production.up.railway.app/api/ControllersAdministrateur/TrajetAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setTrajets(res.data.data || res.data || []);
    } catch (e) {
      setFeedback("Erreur lors du chargement des trajets");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredTrajets = trajets
    .filter(t =>
      (search === "" ||
        t.ville_depart?.toLowerCase().includes(search.toLowerCase()) ||
        t.ville_arrivee?.toLowerCase().includes(search.toLowerCase()) ||
        t.adresse_depart?.toLowerCase().includes(search.toLowerCase()) ||
        t.adresse_arrivee?.toLowerCase().includes(search.toLowerCase()))
      && (statutFilter === "Tous" || t.statut === statutFilter)
    );

  // Pagination
  const totalPages = Math.ceil(filteredTrajets.length / trajetsPerPage);
  const paginatedTrajets = filteredTrajets.slice((currentPage - 1) * trajetsPerPage, currentPage * trajetsPerPage);

  const handleSaveTrajet = async (trajet) => {
    try {
      if (trajet.trajet_id) {
        await axios.put("https://api-ecride-production.up.railway.app/api/ControllersAdministrateur/TrajetAdminController.php", trajet, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Trajet modifié !");
      } else {
        await axios.post("https://api-ecride-production.up.railway.app/api/ControllersAdministrateur/TrajetAdminController.php", trajet, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Trajet ajouté !");
      }
      setShowTrajetModal(false);
      fetchTrajets();
    } catch (e) {
      setFeedback("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteTrajet = async (trajetId) => {
    try {
      await axios.delete(`https://api-ecride-production.up.railway.app/api/ControllersAdministrateur/TrajetAdminController.php?trajet_id=${trajetId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setFeedback("Trajet supprimé !");
      setShowTrajetModal(false);
      fetchTrajets();
    } catch (e) {
      setFeedback("Erreur lors de la suppression");
    }
  };

  return (
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Gestion des trajets</h2>
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
          placeholder="Recherche ville ou adresse..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        />
        <select
          value={statutFilter}
          onChange={e => { setStatutFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmé">Confirmé</option>
          <option value="annulé">Annulé</option>
          <option value="terminé">Terminé</option>
        </select>
        <button
          className="px-6 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
          onClick={() => { setSelectedTrajet(null); setShowTrajetModal(true); }}
        >
          Ajouter un trajet
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : paginatedTrajets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Départ</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Arrivée</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Heure</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Places</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Prix (€)</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Statut</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrajets.map(trajet => (
                <tr key={trajet.trajet_id}>
                  <td className="px-4 py-2 border-b">{trajet.ville_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.ville_arrivee}</td>
                  <td className="px-4 py-2 border-b">{trajet.date_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.heure_depart}</td>
                  <td className="px-4 py-2 border-b">{trajet.nombre_places}</td>
                  <td className="px-4 py-2 border-b">{trajet.prix}</td>
                  <td className="px-4 py-2 border-b">{trajet.statut}</td>
                  <td className="flex gap-2 px-4 py-2 border-b">
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 rounded-md bg-primary-100 hover:bg-customGreen2-100"
                      onClick={() => { setSelectedTrajet(trajet); setShowTrajetModal(true); }}
                    >
                      Détail
                    </button>
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md hover:bg-red-600"
                      onClick={() => {
                        if (window.confirm("Supprimer ce trajet ?")) handleDeleteTrajet(trajet.trajet_id);
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
        <p className="text-gray-600">Aucun trajet trouvé.</p>
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

      <TrajetModal
        trajet={selectedTrajet}
        isOpen={showTrajetModal}
        onClose={() => setShowTrajetModal(false)}
        onSave={handleSaveTrajet}
        onDelete={handleDeleteTrajet}
      />
    </section>
  );
};

export default AdminTrajet;