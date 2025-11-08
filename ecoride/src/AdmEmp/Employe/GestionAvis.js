import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

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
    axiosInstance
      .get("Administrateur/AvisAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then(res => setAvis(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setFeedback("Erreur lors du chargement des avis."))
      .finally(() => setLoading(false));
  };

  const handleValidation = (id, valider) => {
    axiosInstance
      .put(
        "Administrateur/AvisAdminController.php",
        { avis_id: id, statut: valider ? "publié" : "refusé" },
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

  return (
    <section className="max-w-3xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Gestion des avis à valider</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : (
        <>
          {feedback && (
            <div className="px-4 py-2 mb-4 font-semibold text-white rounded shadow bg-customGreen2-100">
              {feedback}
            </div>
          )}
          {avis.length === 0 ? (
            <p className="text-gray-600">Aucun avis à traiter.</p>
          ) : (
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
                  {avis.map(a => (
                    <tr key={a.avis_id || a.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">{a.utilisateur_id}</td>
                      <td className="px-4 py-2">{a.note}</td>
                      <td className="px-4 py-2">{a.commentaire}</td>
                      <td className="flex gap-2 px-4 py-2">
                        <button
                          className="px-4 py-2 font-bold text-white transition-all duration-200 rounded-md bg-customGreen-100 hover:bg-customGreen2-100"
                          onClick={() => handleValidation(a.avis_id || a.id, true)}
                        >
                          Valider
                        </button>
                        <button
                          className="px-4 py-2 font-bold text-white transition-all duration-200 bg-red-500 rounded-md hover:bg-red-600"
                          onClick={() => handleValidation(a.avis_id || a.id, false)}
                        >
                          Refuser
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default GestionAvis;