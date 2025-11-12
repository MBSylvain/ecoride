import React, { useEffect, useState } from "react";
import axios from "axios";

const TrajetsProblemes = () => {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [trajetDetails, setTrajetDetails] = useState(null);
  const [conducteurDetails, setConducteurDetails] = useState(null);
  const [voitureDetails, setVoitureDetails] = useState(null);
  const [utilisateurDetails, setUtilisateurDetails] = useState(null);

  useEffect(() => {
    fetchSignalements();
  }, []);

  const fetchSignalements = () => {
    setLoading(true);
    axios
      .get("https://api-ecride-production.up.railway.app/api/ControllersAdministrateur/SignalementAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then(res => setSignalements(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setSignalements([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selected) {
      axios
        .get(`https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php?trajet_id=${selected.trajet_id}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        })
        .then(res => setTrajetDetails(res.data))
        .catch(() => setTrajetDetails(null));

      axios
        .get(`https://api-ecride-production.up.railway.app/api/Controllers/UtilisateurController.php?utilisateur_id=${selected.conducteur_id}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        })
        .then(res => setConducteurDetails(res.data))
        .catch(() => setConducteurDetails(null));

      axios
        .get(`https://api-ecride-production.up.railway.app/api/Controllers/VoitureController.php?voiture_id=${selected.voiture_id}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        })
        .then(res => setVoitureDetails(res.data))
        .catch(() => setVoitureDetails(null));

      axios
        .get(`https://api-ecride-production.up.railway.app/api/Controllers/UtilisateurController.php?utilisateur_id=${selected.utilisateur_id}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        })
        .then(res => setUtilisateurDetails(res.data))
        .catch(() => setUtilisateurDetails(null));
    } else {
      setTrajetDetails(null);
      setConducteurDetails(null);
      setVoitureDetails(null);
      setUtilisateurDetails(null);
    }
  }, [selected]);

  return (
    <section className="max-w-6xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Signalements de trajets problématiques</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : signalements.length === 0 ? (
        <p className="text-gray-600">Aucun signalement à traiter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Trajet</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Utilisateur</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date signalement</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Motif</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Statut</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {signalements.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-2 border-b">
                    {s.ville_depart && s.ville_arrivee
                      ? `${s.ville_depart} → ${s.ville_arrivee}`
                      : `Trajet ID: ${s.trajet_id}`}
                  </td>
                  <td className="px-4 py-2 border-b">{s.utilisateur_id}</td>
                  <td className="px-4 py-2 border-b">{s.date_signalement}</td>
                  <td className="px-4 py-2 border-b">{s.motif}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      s.statut === "en attente"
                        ? "bg-yellow-400 text-black"
                        : s.statut === "traité"
                        ? "bg-customGreen2-100 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {s.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-4 py-2 font-bold text-white transition-all duration-200 rounded-md bg-primary-100 hover:bg-customGreen2-100"
                      onClick={() => setSelected(s)}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full max-w-lg p-8 transition-all duration-300 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <h3 className="mb-4 text-lg font-bold text-primary-100">Détail du signalement</h3>
            {utilisateurDetails ? (
              <div className="mb-2">
                <b>Nom :</b> {utilisateurDetails.nom} {utilisateurDetails.prenom}<br />
                <b>Email :</b> {utilisateurDetails.email}
              </div>
            ) : (
              <div className="mb-2 text-gray-500">Chargement des infos utilisateur...</div>
            )}
            <section className="mb-4">
              <div className="mb-2"><b>Date du signalement :</b> {selected.date_signalement}</div>
              <div className="mb-2"><b>Motif :</b> {selected.motif}</div>
              <div className="mb-2"><b>Description :</b> {selected.description}</div>
              <div className="mb-2"><b>Statut :</b> {selected.statut}</div>
              <div className="mb-2"><b>Employé traitant :</b> {selected.employe_id || "Non attribué"}</div>
              <div className="mb-2"><b>Date de traitement :</b> {selected.date_traitement || "Non traité"}</div>
              <div className="mb-2"><b>Action effectuée :</b> {selected.action_effectuee || "Aucune"}</div>
            </section>
            {trajetDetails ? (
              <section className="mb-4">
                <hr className="my-3" />
                <h4 className="mb-2 font-semibold text-md text-primary-100">Informations du trajet</h4>
                <div className="mb-1"><b>Départ :</b> {trajetDetails.ville_depart} ({trajetDetails.adresse_depart})</div>
                <div className="mb-1"><b>Arrivée :</b> {trajetDetails.ville_arrivee} ({trajetDetails.adresse_arrivee})</div>
                <div className="mb-1"><b>Date :</b> {trajetDetails.date_depart} à {trajetDetails.heure_depart}</div>
              </section>
            ) : (
              <div className="my-3 text-gray-500">Chargement des infos du trajet...</div>
            )}
            {conducteurDetails ? (
              <section className="mb-4">
                <hr className="my-3" />
                <h4 className="mb-2 font-semibold text-md text-primary-100">Informations du conducteur</h4>
                <div className="mb-1"><b>Nom :</b> {conducteurDetails.nom} {conducteurDetails.prenom}</div>
                <div className="mb-1"><b>Email :</b> {conducteurDetails.email}</div>
                <div className="mb-1"><b>Téléphone :</b> {conducteurDetails.telephone}</div>
              </section>
            ) : (
              <div className="my-3 text-gray-500">Chargement des infos conducteur...</div>
            )}
            {voitureDetails ? (
              <section className="mb-4">
                <hr className="my-3" />
                <h4 className="mb-2 font-semibold text-md text-primary-100">Informations de la voiture</h4>
                <div className="mb-1"><b>Marque :</b> {voitureDetails.marque}</div>
                <div className="mb-1"><b>Modèle :</b> {voitureDetails.modele}</div>
                <div className="mb-1"><b>Immatriculation :</b> {voitureDetails.immatriculation}</div>
                <div className="mb-1"><b>Couleur :</b> {voitureDetails.couleur}</div>
              </section>
            ) : (
              <div className="my-3 text-gray-500">Chargement des infos voiture...</div>
            )}
            <button
              className="px-4 py-2 mt-4 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
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