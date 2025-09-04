import React, { useState } from "react";
import { Link} from "react-router-dom";
import {  useNavigate } from "react-router-dom";
import Carlogin from "../assets/car-login.jpg"; // Mets à jour le chemin si besoin
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await axios.post(
        "http://localhost/api/Controllers/UtilisateurController.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      
      console.log("Réponse complète:", response.data);
      const data = response.data;
      
      if (data.success === true || data.success === "true" || data.success === 1) {
        if (data.user) {
          localStorage.setItem("utilisateur_id", data.user.id);
          localStorage.setItem("user_info", JSON.stringify(data.utilisateur));
          navigate("/Dashboard"); // Utilisation de navigate pour la redirection
          // Redirection correcte
        } else {
          setApiError("Données utilisateur manquantes dans la réponse");
        }
      } else {
        setApiError(data.error || "Erreur non spécifiée");
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      setApiError(err.response?.data?.error || "Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="flex items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-3xl font-bold text-primary-100">Connexion</h1>

          {apiError && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-white transition rounded-lg bg-primary-100 hover:bg-customPink-80 focus:outline-none focus:ring-2 focus:ring-customPink-80"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-customGreen-100 hover:text-customGreen2-80">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>

      <div className="md:w-1/2">
        <img
          src={Carlogin}
          alt="Connexion"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default LoginPage;