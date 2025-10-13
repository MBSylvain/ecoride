import React, { useEffect, useState } from "react";
import axios from "axios";

const TrajetsProblemes = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Récupère le rôle depuis le localStorage (ou adapte selon ton auth)
  const utilisateur_role = localStorage.getItem("utilisateur_role") || localStorage.getItem("utilisateur.role");

  useEffect(() => {
    fetchTrajets();
  }, []);

  const fetchTrajets = () => {
    setLoading(true);
    axios
      .get("http://localhost/api/ControllersAdministrateur/TrajetAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        params: { utilisateur_role }
      })
      .then(res => setTrajets(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setTrajets([]))
      .finally(() => setLoading(false));
  };

  return (
    <section className="max-w-5xl p-4 mx-auto my-8 bg-white rounded shadow">
      <h2 className="mb-4 text-lg font-bold">Trajets signalés comme problématiques</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : trajets.length === 0 ? (
        <p>Aucun trajet problématique à traiter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Trajet</th>
                <th className="px-2 py-1 border">Conducteur</th>
                <th className="px-2 py-1 border">Passagers</th>
                <th className="px-2 py-1 border">Motif</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map(t => (
                <tr key={t.trajet_id}>
                  <td className="px-2 py-1 border">{t.ville_depart} → {t.ville_arrivee}</td>
                  <td className="px-2 py-1 border">{t.conducteur_nom} ({t.conducteur_id})</td>
                  <td className="px-2 py-1 border">{t.passagers?.join(", ")}</td>
                  <td className="px-2 py-1 border">{t.motif_signalement}</td>
                  <td className="px-2 py-1 border">
                    <button
                      className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                      onClick={() => setSelected(t)}
                    >
                      Détail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modale de détail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <h3 className="mb-2 text-lg font-bold">Détail du trajet</h3>
            <div className="mb-2"><b>Départ :</b> {selected.ville_depart} ({selected.adresse_depart})</div>
            <div className="mb-2"><b>Arrivée :</b> {selected.ville_arrivee} ({selected.adresse_arrivee})</div>
            <div className="mb-2"><b>Date :</b> {selected.date_depart} à {selected.heure_depart}</div>
            <div className="mb-2"><b>Conducteur :</b> {selected.conducteur_nom} (ID: {selected.conducteur_id})</div>
            <div className="mb-2"><b>Passagers :</b> {selected.passagers?.join(", ")}</div>
            <div className="mb-2"><b>Motif du signalement :</b> {selected.motif_signalement}</div>
            <div className="mb-2"><b>Description :</b> {selected.description_signalement}</div>
            <button
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => setSelected(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrajetsProblemes;