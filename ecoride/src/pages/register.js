import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    confirm_password: "",
    pseudo: "",
    telephone: "",
    adresse: "",
    date_naissance: "",
    role: "Passager",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.mot_de_passe || !formData.confirm_password) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return false;
    }
    if (formData.mot_de_passe !== formData.confirm_password) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost/ecoride-apie/Controllers/UtilisateurController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, action: "register" }),
        credentials: "include", // Pour envoyer les cookies de session
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || "Erreur lors de l'inscription.");
      } else {
        // Redirige ou affiche un message de succès
         //navigate("/login");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Créer un compte
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                name="prenom"
                type="text"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              name="mot_de_passe"
              type="password"
              required
              value={formData.mot_de_passe}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              name="confirm_password"
              type="password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pseudo (optionnel)</label>
            <input
              name="pseudo"
              type="text"
              value={formData.pseudo}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone (optionnel)</label>
            <input
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse (optionnelle)</label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance (optionnelle)</label>
            <input
              name="date_naissance"
              type="date"
              value={formData.date_naissance}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Je souhaite m'inscrire en tant que</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg"
            >
              <option value="Passager">Passager</option>
              <option value="Conducteur">Conducteur</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;