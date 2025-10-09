import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const RegisterPage = () => {
  const navigate = useNavigate();
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
    // regex pour l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("L'email n'est pas valide.");
      return false;
    }
    // regex pour le mot de passe (au moins 8 caractères, une majuscule, un chiffre)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.mot_de_passe)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
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
      const response = await axios.post(
        "http://localhost/api/Controllers/UtilisateurController.php",
        { ...formData, action: "register" },
        {
          headers: {
        "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await response.data;
      if (response.status >= 400 || data.success === false) {
      setError(data.message || "Erreur lors de l'inscription.");
      } else {
        // Redirige ou affiche un message de succès
        navigate("/dashboard"); // Redirige vers la page de connexion
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-extrabold text-center text-primary-100">
          Créer un compte
        </h2>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-primary-80">Nom</label>
              <input
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-lg border-primary-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-80">Prénom</label>
              <input
                name="prenom"
                type="text"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-lg border-primary-80"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Mot de passe</label>
            <input
              name="mot_de_passe"
              type="password"
              required
              value={formData.mot_de_passe}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Confirmer le mot de passe</label>
            <input
              name="confirm_password"
              type="password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Pseudo (optionnel)</label>
            <input
              name="pseudo"
              type="text"
              value={formData.pseudo}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Téléphone (optionnel)</label>
            <input
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Adresse (optionnelle)</label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-80">Date de naissance (optionnelle)</label>
            <input
              name="date_naissance"
              type="date"
              value={formData.date_naissance}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Je souhaite m'inscrire en tant que</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg border-primary-80"
            >
              <option value="Passager">Passager</option>
              <option value="Conducteur">Conducteur</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white border border-transparent rounded-lg shadow-sm bg-primary-100 hover:bg-customPink-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-customGreen-100 hover:text-customGreen2-100">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;