import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simule la récupération de l'utilisateur connecté (à remplacer par ton auth context)
const getUserId = () => localStorage.getItem("utilisateur_id") || 1;

const CarForm = ({ initialData = null }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    initialData || {
      marque: "",
      modele: "",
      immatriculation: "",
      date_premiere_immatriculation: "",
      couleur: "",
      energie: "essence",
      nombre_places: 4,
      photo_url: "",
      description: "",
    }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const utilisateur_id = getUserId();
    const payload = { ...form, utilisateur_id, action: initialData ? "update" : "create" };

    try {
      const response = await fetch("https://api-ecride-production.up.railway.app/Controllers/VoitureController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        navigate("/dashboard/voitures");
      }
    } catch {
      setError("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{initialData ? "Modifier la voiture" : "Ajouter une voiture"}</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Marque</label>
            <input
              type="text"
              name="marque"
              value={form.marque}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Modèle</label>
            <input
              type="text"
              name="modele"
              value={form.modele}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Immatriculation</label>
            <input
              type="text"
              name="immatriculation"
              value={form.immatriculation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date de première immatriculation</label>
            <input
              type="date"
              name="date_premiere_immatriculation"
              value={form.date_premiere_immatriculation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Couleur</label>
            <input
              type="text"
              name="couleur"
              value={form.couleur}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Énergie</label>
            <select
              name="energie"
              value={form.energie}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electrique">Électrique</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Nombre de places</label>
            <input
              type="number"
              name="nombre_places"
              min="1"
              max="9"
              value={form.nombre_places}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">URL de la photo</label>
          <input
            type="text"
            name="photo_url"
            value={form.photo_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description (optionnelle)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md mr-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            {initialData ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;