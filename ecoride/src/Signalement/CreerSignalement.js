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
        "http://localhost/api/ControllersAdministrateur/SignalementAdminController.php",
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
      className="flex flex-col max-w-xl gap-4 p-6 mx-auto my-8 bg-white rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-2 text-xl font-bold text-customGreen-100">Signaler un trajet problématique</h2>
      {/* Champs cachés pour trajet_id et utilisateur_id */}
      <input type="hidden" name="trajet_id" value={form.trajet_id} />
      <input type="hidden" name="utilisateur_id" value={utilisateur_id} />
      {feedback && (
        <div className={`p-2 rounded text-center ${feedback.includes("succès") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {feedback}
        </div>
      )}
      <div>
        <label className="block mb-1 text-sm font-medium">Motif du signalement</label>
        <select
          name="motif"
          className="w-full px-2 py-1 border rounded"
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
        <label className="block mb-1 text-sm font-medium">Description détaillée</label>
        <textarea
          name="description"
          className="w-full px-2 py-1 border rounded"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Statut</label>
        <input
          name="statut"
          className="w-full px-2 py-1 border rounded"
          value={form.statut}
          disabled
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 mt-2 font-semibold text-white transition rounded bg-customGreen-100 hover:bg-customGreen-200"
        disabled={loading}
      >
        {loading ? "Envoi en cours..." : "Envoyer le signalement"}
      </button>
    </form>
  );
};

export default CreerSignalement;