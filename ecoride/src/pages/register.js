import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RouteAutomne from "../assets/routeautonne.jpg";

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
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState(""); // Pour les erreurs API globales
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Format d'email invalide.";
      }
    }
    if (name === "nom" || name === "prenom") {
      const nameRegex = /^[A-Za-zÀ-ÿ' -]{2,}$/;
      if (!nameRegex.test(value)) {
        errorMsg = "Seules les lettres sont autorisées (2 caractères minimum).";
      }
    }

    setError((prev) => ({ ...prev, [name]: errorMsg }));
    setApiError(""); // Efface l'erreur API si l'utilisateur modifie un champ
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.nom) {
      newErrors.nom = "Le nom est requis.";
      valid = false;
    } else if (!/^[A-Za-zÀ-ÿ' -]{2,}$/.test(formData.nom)) {
      newErrors.nom = "Seules les lettres sont autorisées (2 caractères minimum).";
      valid = false;
    }

    if (!formData.prenom) {
      newErrors.prenom = "Le prénom est requis.";
      valid = false;
    } else if (!/^[A-Za-zÀ-ÿ' -]{2,}$/.test(formData.prenom)) {
      newErrors.prenom = "Seules les lettres sont autorisées (2 caractères minimum).";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
      valid = false;
    }

    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = "Le mot de passe est requis.";
      valid = false;
    } else if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.mot_de_passe)) {
      newErrors.mot_de_passe = "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.";
      valid = false;
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "La confirmation du mot de passe est requise.";
      valid = false;
    } else if (formData.mot_de_passe !== formData.confirm_password) {
      newErrors.confirm_password = "Les mots de passe ne correspondent pas.";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); // Efface l'erreur API précédente
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://api-ecride-production.up.railway.app/api/Controllers/UtilisateurController.php",
        { ...formData, action: "register" },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      if (response.status >= 400 || data.success === false) {
        setApiError(data.message || "Erreur lors de l'inscription.");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setApiError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans md:flex-row bg-customGrey-100">
      <div className="hidden md:w-1/2 md:block">
        <img src={RouteAutomne} alt="Route en automne" className="object-cover w-full h-full rounded-r-lg" />
      </div>
      <div className="flex items-center justify-center p-8 md:w-1/2">

        <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-center text-primary-100">
            Créer un compte
          </h2>

          {apiError && (
            <div className="p-4 mb-4 text-white bg-red-500 rounded-md shadow" role="alert">
              {apiError}
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
                {error.nom && (
                  <p className="mt-1 text-sm text-red-500">{error.nom}</p>
                )}
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
                {error.prenom && (
                  <p className="mt-1 text-sm text-red-500">{error.prenom}</p>
                )}
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
              {error.email && (
                <p className="mt-1 text-sm text-red-500">{error.email}</p>
              )}
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
              {error.mot_de_passe && (
                <p className="mt-1 text-sm text-red-500">{error.mot_de_passe}</p>
              )}
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
              {error.confirm_password && (
                <p className="mt-1 text-sm text-red-500">{error.confirm_password}</p>
              )}
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
              {error.pseudo && (
                <p className="mt-1 text-sm text-red-500">{error.pseudo}</p>
              )}
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
              {error.telephone && (
                <p className="mt-1 text-sm text-red-500">{error.telephone}</p>
              )}
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
              {error.adresse && (
                <p className="mt-1 text-sm text-red-500">{error.adresse}</p>
              )}
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
              {error.date_naissance && (
                <p className="mt-1 text-sm text-red-500">{error.date_naissance}</p>
              )}
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
              {error.role && (
                <p className="mt-1 text-sm text-red-500">{error.role}</p>
              )}
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
    </div>
  );
};

export default RegisterPage;