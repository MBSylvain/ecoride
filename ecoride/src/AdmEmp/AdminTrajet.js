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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold">{trajet ? "Modifier" : "Ajouter"} un trajet</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Départ</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.ville_depart || ""}
              onChange={e => setEditData({ ...editData, ville_depart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Arrivée</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.ville_arrivee || ""}
              onChange={e => setEditData({ ...editData, ville_arrivee: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Adresse départ</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.adresse_depart || ""}
              onChange={e => setEditData({ ...editData, adresse_depart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Adresse arrivée</label>
            <input
              className="w-full px-2 py-1 border rounded"
              value={editData.adresse_arrivee || ""}
              onChange={e => setEditData({ ...editData, adresse_arrivee: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date départ</label>
            <input
              type="date"
              className="w-full px-2 py-1 border rounded"
              value={editData.date_depart || ""}
              onChange={e => setEditData({ ...editData, date_depart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Heure départ</label>
            <input
              type="time"
              className="w-full px-2 py-1 border rounded"
              value={editData.heure_depart || ""}
              onChange={e => setEditData({ ...editData, heure_depart: e.target.value })}
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
            <label className="block text-sm font-medium">Prix (€)</label>
            <input
              type="number"
              className="w-full px-2 py-1 border rounded"
              value={editData.prix || ""}
              onChange={e => setEditData({ ...editData, prix: e.target.value })}
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
            {trajet && (
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
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
      const res = await axios.get("http://localhost/api/ControllersAdministrateur/TrajetAdminController.php", {
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
        await axios.put("http://localhost/api/ControllersAdministrateur/TrajetAdminController.php", trajet, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        setFeedback("Trajet modifié !");
      } else {
        await axios.post("http://localhost/api/ControllersAdministrateur/TrajetAdminController.php", trajet, {
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
      await axios.delete(`http://localhost/api/ControllersAdministrateur/TrajetAdminController.php?trajet_id=${trajetId}`, {
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
    <section>
      <h2 className="mb-2 text-lg font-semibold">Trajets</h2>
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
          placeholder="Recherche ville ou adresse..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-2 py-1 border rounded"
        />
        <select value={statutFilter} onChange={e => { setStatutFilter(e.target.value); setCurrentPage(1); }} className="px-2 py-1 border rounded">
          <option value="Tous">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmé">Confirmé</option>
          <option value="annulé">Annulé</option>
          <option value="terminé">Terminé</option>
        </select>
      </div>
      <button
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        onClick={() => { setSelectedTrajet(null); setShowTrajetModal(true); }}
      >
        Ajouter un trajet
      </button>
      {loading ? (
        <p>Chargement...</p>
      ) : paginatedTrajets.length > 0 ? (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Départ</th>
              <th className="px-2 py-1 border">Arrivée</th>
              <th className="px-2 py-1 border">Date</th>
              <th className="px-2 py-1 border">Heure</th>
              <th className="px-2 py-1 border">Places</th>
              <th className="px-2 py-1 border">Prix (€)</th>
              <th className="px-2 py-1 border">Statut</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrajets.map(trajet => (
              <tr key={trajet.trajet_id}>
                <td className="px-2 py-1 border">{trajet.ville_depart}</td>
                <td className="px-2 py-1 border">{trajet.ville_arrivee}</td>
                <td className="px-2 py-1 border">{trajet.date_depart}</td>
                <td className="px-2 py-1 border">{trajet.heure_depart}</td>
                <td className="px-2 py-1 border">{trajet.nombre_places}</td>
                <td className="px-2 py-1 border">{trajet.prix}</td>
                <td className="px-2 py-1 border">{trajet.statut}</td>
                <td className="flex flex-wrap gap-2 px-2 py-1 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedTrajet(trajet); setShowTrajetModal(true); }}
                  >
                    Détail
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
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
      ) : (
        <p>Aucun trajet trouvé.</p>
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