import React, { useEffect, useState } from "react";
import StatistiquesCredit from "../AdmEmp/Statistiques/StatistiquesCredits";
import StatistiquesUtilisateurs from "../AdmEmp/Statistiques/StatistiquesUtilisateurs";
import StatistiquesTrajets from "../AdmEmp/Statistiques/StatistiquesTrajets";
import StatistiquesReservations from "../AdmEmp/Statistiques/StatistiquesReservations";
import StatistiquesAvis from "../AdmEmp/Statistiques/StatistiquesAvis";
import StatistiquesVoitures from "../AdmEmp/Statistiques/StatistiquesVoitures";
import AdminVoitures from "../AdmEmp/AdminVoitures";
import AdminTrajets from "../AdmEmp/AdminTrajet";
import AdminReservations from "../AdmEmp/AdminReservation";
import AdminAvis from "../AdmEmp/AdminAvis";
import ListeUtilisateurs from "./ListeUtilisateurs";
import GestionAvis from "../AdmEmp/Employe/GestionAvis";
import TrajetsProblemes from "../AdmEmp/Employe/TrajetsProblemes";
import checkAuth from "../features/checkAuth";
import axiosInstance from "../api/axiosInstance";
import TraitementSignalements from "../Signalement/TaitementSignalement";

const DashboardAdmin = () => {
  const [role, setRole] = useState(null);
  const [utilisateur, setUtilisateur] = useState(null);
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const reponse = await axiosInstance.get("checkAuth.php", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setRole(reponse.data.role);
        setUtilisateur(reponse.data.utilisateur);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
      }
    };
    fetchAuth();
  }, []);

  if (role === "Administrateur") {
    return (
      <section className="mb-8">
        <h1 className="mb-6 text-2xl font-bold text-center text-customGreen-100">
          Tableau de Bord Administrateur
        </h1>
        <section className="mb-8 ">
          <h2 className="mb-4 text-xl font-semibold">Statistiques Clés</h2>
          <StatistiquesCredit />
          <StatistiquesUtilisateurs />
          <StatistiquesVoitures />
          <StatistiquesTrajets />
          <StatistiquesReservations />
          <StatistiquesAvis />
        </section>
        <section className="mb-8">
          <AdminVoitures />
          <AdminTrajets />
          <AdminReservations />
          <AdminAvis />
          <ListeUtilisateurs />
        </section>
      </section>
    );
  } else if (role === "Modérateur" || role === "Employé") {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-4 text-xl font-semibold text-center text-customGreen-100">
          Tableau de bord Employé
        </h2>
        <div className="mb-8 text-gray-700">
          <p className="">Gérez les avis des utilisateurs en attente de validation.</p>
          <GestionAvis />
        </div>
        <div className="mb-8 text-gray-700">
          <p className="">Gérer les problèmes de trajets signalés.</p>
          <TrajetsProblemes />
          <p className="mt-2 text-sm text-gray-500"> Gestion des litiges et problèmes signalés par les utilisateurs. </p>
          <TraitementSignalements />
        </div>
      </div>
    );
  } else if (role === null) {
    // Affiche rien tant que le rôle n'est pas chargé
    return <p>Chargement...</p>;
  } else {
    return (
      <p className="mt-8 text-center text-red-600">Accès refusé</p>
    );
  }
};

export default DashboardAdmin;