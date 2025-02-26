import React, { useState } from "react";
import Carlogin from "../assets/car-login.jpg";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

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
      <div className="flex flex-col justify-center w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Connectez-vous à votre compte ecoride
        </h1>
        {Object.keys(errors).length > 0 && (
          <p className="text-red-500 text-sm mb-3">
            Veuillez corriger les erreurs ci-dessous.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            value={formData.email}
            onChange={handleChange}
            className={`mb-4 p-3 w-80 border  ${
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
            className={`mb-6 p-3 w-80 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-3">{errors.password}</p>
          )}

          <button
            type="submit"
            className="px-6 py-3 w-80 justify-center bg-primary-100 text-white border-2 border-primary-100 rounded-lg hover:bg-white hover:text-primary-100  hover:border-customPink-80"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Connexion..." : "Login"}
          </button>
        </form>
        <div className="mt-4">
          <p>Vous n'avez pas de compte?</p>
          <Link to="/register" className="text-blue-500 hover:underline">
            Créer un compte en 2 munites!
          </Link>
        </div>
      </div>
      <div className="w-1/2">
        <img
          src={Carlogin}
          alt="Connexion"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </div>
  );
};

export default LoginPage;
