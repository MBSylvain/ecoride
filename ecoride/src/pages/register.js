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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("L'email n'est pas valide.");
      return false;
    }
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
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 font-sans bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-primary-100">
          Créer un compte
        </h2>

        {error && (
          <div className="p-4 mb-4 text-white bg-red-500 rounded-md shadow">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-primary-100">Nom</label>
              <input
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-100">Prénom</label>
              <input
                name="prenom"
                type="text"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Mot de passe</label>
            <input
              name="mot_de_passe"
              type="password"
              required
              value={formData.mot_de_passe}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Confirmer le mot de passe</label>
            <input
              name="confirm_password"
              type="password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Pseudo (optionnel)</label>
            <input
              name="pseudo"
              type="text"
              value={formData.pseudo}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Téléphone (optionnel)</label>
            <input
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Adresse (optionnelle)</label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Date de naissance (optionnelle)</label>
            <input
              name="date_naissance"
              type="date"
              value={formData.date_naissance}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-100">Je souhaite m'inscrire en tant que</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            >
              <option value="Passager">Passager</option>
              <option value="Conducteur">Conducteur</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customPink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen2-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <Link to="/login" className="font-semibold text-customGreen2-100 hover:text-primary-100">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;