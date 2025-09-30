import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Userinfo from "../Utilisateurs/Userinfo";
import VoitureUser from "../Voitures/VoitureUser";
import VisualiserTrajets from "../Trajets/VisualiserTrajets";
import VisualiserReservations from "../Reservations/VisualiserReservations";
import VisualiserAvis from "../avis/VisualiserAvis";
import Statistiques from "../AdmEmp/Statistiques";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérification de l'authentification et récupération des informations utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost/api/Controllers/checkAuth.php", {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user); // Récupère les informations utilisateur
        } else {
          navigate("/login"); // Redirige vers la page de connexion si non authentifié
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <p>Chargement...</p>; // Affiche un message de chargement pendant la récupération des données
  }

  // Détermine si l'utilisateur est un administrateur
  const isAdmin = user.role === "admin";

  // --- RENDU ---
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-customGreen-100">
        Tableau de Bord {isAdmin ? "Administrateur" : "Employé"}
      </h1>
      <Userinfo />
      <VoitureUser />
      <VisualiserTrajets />
      <VisualiserReservations />
      <VisualiserAvis />
      {isAdmin && <Statistiques />} {/* Affiche les statistiques uniquement pour les administrateurs */}
    </div>
  );
};

export default Dashboard;