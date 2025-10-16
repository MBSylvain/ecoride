import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUTS = ["en attente", "en cours", "traité", "rejeté"];

const TraitementSignalements = () => {
  const [signalements, setSignalements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchSignalements();
  }, []);

  const fetchSignalements = async () => {
    try {
      const res = await axios.get("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php", {
        withCredentials: true
      });
      setSignalements(Array.isArray(res.data) ? res.data : []);
    } catch {
      setFeedback("Erreur lors du chargement des signalements.");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await axios.put("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php", {
        id: data.id,
        statut: data.statut,
        employe_id: localStorage.getItem("utilisateur_id"),
        action_effectuee: data.action_effectuee || ""
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setFeedback("Signalement mis à jour !");
      setSelected(null);
      fetchSignalements();
    } catch {
      setFeedback("Erreur lors de la mise à jour.");
    }
  };

  return (
    <section className="max-w-4xl mx-auto my-8">
      <h2 className="mb-4 text-xl font-bold">Signalements à traiter</h2>
      {feedback && (
        <div className="p-2 mb-2 text-center text-green-700 bg-green-100 rounded">{feedback}</div>
      )}
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Trajet</th>
            <th className="px-2 py-1 border">Utilisateur</th>
            <th className="px-2 py-1 border">Motif</th>
            <th className="px-2 py-1 border">Statut</th>
            <th className="px-2 py-1 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {signalements.map(s => (
            <tr key={s.id}>
              <td className="px-2 py-1 border">{s.id}</td>
              <td className="px-2 py-1 border">{s.trajet_id}</td>
              <td className="px-2 py-1 border">{s.utilisateur_id}</td>
              <td className="px-2 py-1 border">{s.motif}</td>
              <td className="px-2 py-1 border">{s.statut}</td>
              <td className="px-2 py-1 border">
                <button
                  className="px-2 py-1 text-white bg-blue-600 rounded"
                  onClick={() => setSelected(s)}
                >
                  Traiter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h3 className="mb-2 text-lg font-bold">Traitement du signalement #{selected.id}</h3>
            <div className="mb-2"><b>Motif :</b> {selected.motif}</div>
            <div className="mb-2"><b>Description :</b> {selected.description}</div>
            <div className="mb-2">
              <label className="block mb-1 text-sm font-medium">Statut</label>
              <select
                value={selected.statut}
                onChange={e => setSelected({ ...selected, statut: e.target.value })}
                className="w-full px-2 py-1 border rounded"
              >
                {STATUTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-sm font-medium">Action effectuée</label>
              <input
                type="text"
                value={selected.action_effectuee || ""}
                onChange={e => setSelected({ ...selected, action_effectuee: e.target.value })}
                className="w-full px-2 py-1 border rounded"
                placeholder="Action prise par l'employé"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 text-white bg-green-600 rounded"
                onClick={() => handleUpdate(selected)}
              >
                Valider
              </button>
              <button
                className="px-4 py-2 text-white bg-gray-400 rounded"
                onClick={() => setSelected(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TraitementSignalements;