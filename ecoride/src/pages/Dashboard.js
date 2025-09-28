import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import EditUserModal from "../features/EditUserModal";
import EditVehicleModal from "../Voitures/EditVehicleModal";
import EditTrajetModal from "../features/EditTrajetModal";
import CreateTrajetModal from "../features/CreateTrajetModal";
import checkAuth from "../features/checkAuth";
import Userinfo from "../Utilisateurs/Userinfo";
import VoitureUser from "../Voitures/VoitureUser";
import VisualiserTrajets from "../Trajets/VisualiserTrajets";
import VisualiserReservations from "../Reservations/VisualiserReservations";
import VisualiserAvis from "../avis/VisualiserAvis";



const Dashboard = () => {
  
 

  // --- RENDU ---
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-customGreen-100">Mon Tableau de Bord</h1>
      <Userinfo />
      <VoitureUser />
      <VisualiserTrajets />
      <VisualiserReservations />
      <VisualiserAvis />
     </div> 
        
       
  );
};  
export default Dashboard;