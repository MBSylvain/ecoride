import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Simule la récupération de l'utilisateur connecté (à remplacer par ton auth context)
const getUserId = () => localStorage.getItem("utilisateur_id") || 1;

const TripForm = () => {
  const navigate = useNavigate();
  const { trajet_id } = useParams(); // Si tu utilises une route du type /dashboard/trajet/:trajet_id
  const [form, setForm] = useState({
    ville_depart: "",
    ville_arrivee: "",
    adresse_depart: "",
    adresse_arrivee: "",
    date_depart: "",
    nombre_places: 3,
    prix: "",
    voiture_id: "",
    description: "",
    bagages_autorises: false,
    fumeur_autorise: false,
    animaux_autorises: false,
  });
  const [voitures, setVoitures] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(!!trajet_id);
  const [error, setError] = useState("");

  useEffect(() => {
    // Récupère les voitures de l'utilisateur
    const utilisateur_id = getUserId();
    fetch(`http://localhost/ecoride-apie/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`)
      .then((res) => res.json())
      .then((data) => setVoitures(data))
      .catch(() => setVoitures([]));
    // Si modification, charge le trajet
    if (trajet_id) {
      setIsEdit(true);
      fetch(`http://localhost/ecoride-apie/Controllers/TrajetController.php?trajet_id=${trajet_id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            ville_depart: data.ville_depart || "",
            ville_arrivee: data.ville_arrivee || "",
            adresse_depart: data.adresse_depart || "",
            adresse_arrivee: data.adresse_arrivee || "",
            date_depart: data.date_depart ? data.date_depart.replace(" ", "T") : "",
            nombre_places: data.nombre_places || 3,
            prix: data.prix || "",
            voiture_id: data.voiture_id || "",
            description: data.description || "",
            bagages_autorises: !!data.bagages_autorises,
            fumeur_autorise: !!data.fumeur_autorise,
            animaux_autorises: !!data.animaux_autorises,
          });
          setLoading(false);
        })
        .catch(() => {
          setError("Impossible de charger le trajet.");
          setLoading(false);
        });
    }
  }, [trajet_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const utilisateur_id = getUserId();
    const payload = { ...form, utilisateur_id };
    if (isEdit) payload.trajet_id = trajet_id;
    payload.action = isEdit ? "update_trip" : "add_trip";

    try {
      const response = await fetch("http://localhost/ecoride-apie/Controllers/TrajetController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        navigate("/dashboard/trajets");
      }
    } catch {
      setError("Erreur lors de l'enregistrement.");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{isEdit ? "Modifier mon trajet" : "Proposer un trajet"}</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Ville de départ</label>
            <input
              type="text"
              name="ville_depart"
              value={form.ville_depart}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Ville d'arrivée</label>
            <input
              type="text"
              name="ville_arrivee"
              value={form.ville_arrivee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Adresse de départ</label>
            <input
              type="text"
              name="adresse_depart"
              value={form.adresse_depart}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Adresse d'arrivée</label>
            <input
              type="text"
              name="adresse_arrivee"
              value={form.adresse_arrivee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date de départ</label>
            <input
              type="datetime-local"
              name="date_depart"
              value={form.date_depart}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Places disponibles</label>
            <input
              type="number"
              name="nombre_places"
              min="1"
              max="8"
              value={form.nombre_places}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Prix par passager (€)</label>
            <input
              type="number"
              name="prix"
              min="0"
              step="0.01"
              value={form.prix}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Véhicule</label>
            <select
              name="voiture_id"
              value={form.voiture_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner un véhicule</option>
              {voitures.map((v) => (
                <option key={v.voiture_id} value={v.voiture_id}>
                  {v.marque} {v.modele} ({v.immatriculation})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description (optionnel)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="bagages_autorises"
              checked={form.bagages_autorises}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <label className="ml-2 block text-gray-700">Bagages volumineux acceptés</label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="fumeur_autorise"
              checked={form.fumeur_autorise}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <label className="ml-2 block text-gray-700">Fumeurs acceptés</label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="animaux_autorises"
              checked={form.animaux_autorises}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <label className="ml-2 block text-gray-700">Animaux acceptés</label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md mr-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            {isEdit ? "Modifier" : "Proposer"} le trajet
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;