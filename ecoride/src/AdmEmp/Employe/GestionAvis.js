import React, { useEffect, useState } from "react";
import axios from "axios";

const GestionAvis = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchAvis();
    // eslint-disable-next-line
  }, []);

  const fetchAvis = () => {
    setLoading(true);
    axios
      .get("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then(res => setAvis(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setFeedback("Erreur lors du chargement des avis."))
      .finally(() => setLoading(false));
  };

  const handleValidation = (id, valider) => {
    axios
      .put(
        "http://localhost/api/ControllersAdministrateur/AvisAdminController.php",
        {avis_id: id, statut: valider ? "publié" : "refusé"  },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      )
      .then(() => {
        setFeedback("Avis traité !");
        setAvis(avis => avis.filter(a => a.avis_id !== id && a.id !== id));
      })
      .catch(() => setFeedback("Erreur lors du traitement."));
  };

  if (loading) return <p>Chargement...</p>;
  return (
    <section className="max-w-3xl p-4 mx-auto my-8 bg-white rounded shadow">
      <h2 className="mb-4 text-lg font-bold">Gestion des avis à valider</h2>
      {feedback && <div className="mb-2 text-green-700">{feedback}</div>}
      {avis.length === 0 ? (
        <p>Aucun avis à traiter.</p>
      ) : (
        <table className="min-w-full text-sm border">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Utilisateur</th>
              <th className="px-2 py-1 border">Note</th>
              <th className="px-2 py-1 border">Commentaire</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {avis.map(a => (
              <tr key={a.avis_id || a.id}>
                <td className="px-2 py-1 border">{a.utilisateur_id}</td>
                <td className="px-2 py-1 border">{a.note}</td>
                <td className="px-2 py-1 border">{a.commentaire}</td>
                <td className="flex gap-2 px-2 py-1 border">
                  <button
                    className="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                    onClick={() => handleValidation(a.avis_id || a.id, true)}
                  >
                    Valider
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    onClick={() => handleValidation(a.avis_id || a.id, false)}
                  >
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default GestionAvis;