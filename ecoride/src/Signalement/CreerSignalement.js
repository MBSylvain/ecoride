import React, { useState } from "react";
import axios from "axios";

const motifs = [
  "Retard",
  "Comportement",
  "Sécurité",
  "Annulation non prévue",
  "Autre"
];

const CreerSignalement = ({ trajet_id, utilisateur_id, onSuccess }) => {
  const [form, setForm] = useState({
    trajet_id: trajet_id || "",
    utilisateur_id: localStorage.getItem("utilisateur_id") || "",
    motif: "",
    description: "",
    statut: "en attente"
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await axios.post(
        "https://api-ecride-production.up.railway.app/api/ControllersAdministrateur/SignalementAdminController.php",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      setFeedback("Signalement envoyé avec succès !");
      setForm({
        trajet_id: trajet_id || "",
        utilisateur_id: utilisateur_id || "",
        motif: "",
        description: "",
        statut: "en attente"
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setFeedback("Erreur lors de l'envoi du signalement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col max-w-xl gap-4 p-6 mx-auto my-8 font-sans bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-2 text-xl font-bold text-primary-100">Signaler un trajet problématique</h2>
      {/* Champs cachés pour trajet_id et utilisateur_id */}
      <input type="hidden" name="trajet_id" value={form.trajet_id} />
      <input type="hidden" name="utilisateur_id" value={utilisateur_id} />
      {feedback && (
        <div className={`p-2 rounded text-center font-semibold shadow-md ${
          feedback.includes("succès") ? "bg-customGreen2-100 text-white" : "bg-red-500 text-white"
        }`}>
          {feedback}
        </div>
      )}
      <div>
        <label className="block mb-1 text-sm font-semibold text-primary-100">Motif du signalement</label>
        <select
          name="motif"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          value={form.motif}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner un motif</option>
          {motifs.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold text-primary-100">Description détaillée</label>
        <textarea
          name="description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold text-primary-100">Statut</label>
        <input
          name="statut"
          className="w-full p-3 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          value={form.statut}
          disabled
        />
      </div>
      <button
        type="submit"
        className={`w-full py-2 mt-2 font-bold rounded-md shadow-md transition-colors ${
          loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary-100 text-white hover:bg-customPink-100"
        }`}
        disabled={loading}
      >
        {loading ? "Envoi en cours..." : "Envoyer le signalement"}
      </button>
    </form>
  );
};

export default CreerSignalement;