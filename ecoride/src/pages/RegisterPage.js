import React, { useState } from "react";
import carregister from "../assets/car-registrer.jpg";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "nom":
        if (!value.trim()) {
          newErrors.nom = "Le nom est requis";
        } else if (/\d/.test(value)) {
          newErrors.nom = "Le nom ne doit pas contenir de chiffres";
        } else {
          delete newErrors.nom;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          newErrors.email = "Email invalide";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 6) {
          newErrors.password =
            "Le mot de passe doit contenir au moins 6 caractères";
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (/\d/.test(formData.nom)) {
      newErrors.nom = "Le nom ne doit pas contenir de chiffres";
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Validation du mot de passe
    if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Traitement du formulaire
      console.log("Formulaire valide", formData);
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-96 mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">
          Créer votre compte ecoride! et commence à partager vos trajets
        </h1>
        {Object.keys(errors).length > 0 && (
          <p className="text-red-500 text-sm mb-3">
            Veuillez corriger les erreurs ci-dessous.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            aria-label="Nom"
            value={formData.nom}
            onChange={handleChange}
            className={`mb-1 p-3 w-full border ${
              errors.nom ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.nom && (
            <p className="text-red-500 text-sm mb-3">{errors.nom}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            value={formData.email}
            onChange={handleChange}
            className={`mb-1 p-3 w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            aria-label="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className={`mb-1 p-3 w-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-3">{errors.password}</p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            aria-label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`mb-1 p-3 w-full border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-3">
              {errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "S'enregistrer"}
          </button>
        </form>
      </div>
      <div className="w-1/2">
        <img
          src={carregister}
          alt="Enregistrement"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
