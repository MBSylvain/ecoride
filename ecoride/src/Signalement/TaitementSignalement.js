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
      const res = await axios.get("https://api-ecride-production.up.railway.app/ControllersAdministrateur/SignalementAdminController.php", {
        withCredentials: true
      });
      setSignalements(Array.isArray(res.data) ? res.data : []);
    } catch {
      setFeedback("Erreur lors du chargement des signalements.");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await axios.put("https://api-ecride-production.up.railway.app/ControllersAdministrateur/SignalementAdminController.php", {
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
    <section className="max-w-4xl mx-auto my-8 font-sans">
      <h2 className="mb-4 text-2xl font-bold text-primary-100">Signalements à traiter</h2>
      {feedback && (
        <div className="p-2 mb-2 font-semibold text-center text-white rounded-md shadow-md bg-customGreen2-100">{feedback}</div>
      )}
      <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-md">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-customGrey-100">
              <th className="px-2 py-1 font-semibold border text-primary-100">ID</th>
              <th className="px-2 py-1 font-semibold border text-primary-100">Trajet</th>
              <th className="px-2 py-1 font-semibold border text-primary-100">Utilisateur</th>
              <th className="px-2 py-1 font-semibold border text-primary-100">Motif</th>
              <th className="px-2 py-1 font-semibold border text-primary-100">Statut</th>
              <th className="px-2 py-1 font-semibold border text-primary-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {signalements.map(s => (
              <tr key={s.id}>
                <td className="px-2 py-1 border">{s.id}</td>
                <td className="px-2 py-1 border">{s.trajet_id}</td>
                <td className="px-2 py-1 border">{s.utilisateur_id}</td>
                <td className="px-2 py-1 border">{s.motif}</td>
                <td className="px-2 py-1 border">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    s.statut === "traité" ? "bg-customGreen2-100 text-white"
                    : s.statut === "rejeté" ? "bg-red-500 text-white"
                    : s.statut === "en cours" ? "bg-yellow-400 text-black"
                    : "bg-primary-100 text-white"
                  }`}>
                    {s.statut}
                  </span>
                </td>
                <td className="px-2 py-1 border">
                  <button
                    className="px-3 py-1 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                    onClick={() => setSelected(s)}
                  >
                    Traiter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
          <div className="relative w-full max-w-lg p-8 transition-all duration-300 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <h3 className="mb-4 text-lg font-bold text-primary-100">Traitement du signalement #{selected.id}</h3>
            <div className="mb-2"><b>Motif :</b> {selected.motif}</div>
            <div className="mb-2"><b>Description :</b> {selected.description}</div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-primary-100">Statut</label>
              <select
                value={selected.statut}
                onChange={e => setSelected({ ...selected, statut: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
              >
                {STATUTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-primary-100">Action effectuée</label>
              <input
                type="text"
                value={selected.action_effectuee || ""}
                onChange={e => setSelected({ ...selected, action_effectuee: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
                placeholder="Action prise par l'employé"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
                onClick={() => handleUpdate(selected)}
              >
                Valider
              </button>
              <button
                className="px-4 py-2 font-bold text-gray-500 transition-colors bg-gray-300 rounded-md shadow-md hover:bg-gray-400"
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