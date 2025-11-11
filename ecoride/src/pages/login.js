import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carlogin from "../assets/car-login.jpg";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/Controllers/CheckAuth.php",
          { withCredentials: true }
        );
        if (response.data.authenticated) {
          await axios.post(
            "http://localhost/api/Controllers/logout.php",
            {},
            { withCredentials: true }
          );
        }
      } catch (err) {
        // ignore
      }
    };
    checkAuth();
  }, []);

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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const userData = response.data;
      const userRole = userData.user?.role;
      if (userRole) {
        const userInfo = {
          id: userData.user.id,
          email: userData.user.email,
          role: userData.user.role,
          name: userData.user.name || userData.user.email
        };
        login(userInfo);
        if (userRole === "Administrateur" || userRole === "Modérateur") {
          navigate("/AdmEmp/dashboardAdmin");
        } else if (userRole === "Passager" || userRole === "Conducteur") {
          navigate("/Dashboard");
        } else {
          setApiError("Rôle utilisateur inconnu.");
        }
      } else {
        setApiError("Rôle utilisateur manquant dans la réponse.");
      }
    } catch (err) {
      setApiError(err.response?.data?.error || "Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans md:flex-row bg-customGrey-100">
      <div className="flex items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-lg shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-primary-100">Connexion</h1>
          {apiError && (
            <div className="p-3 mb-4 font-semibold text-white bg-red-500 rounded shadow-md">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-primary-100">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-primary-100">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full py-3 font-bold rounded-md shadow-md transition-colors ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-100 text-white hover:bg-customPink-100"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="font-semibold text-customGreen-100 hover:text-customGreen2-100"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:w-1/2 md:block">
        <img
          src={Carlogin}
          alt="Connexion"
          className="object-cover w-full h-full rounded-r-lg"
        />
      </div>
    </div>
  );
};

export default LoginPage;