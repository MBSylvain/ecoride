import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
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
import PreferencesConducteur from "../Utilisateurs/PreferencesConducteur";
import HistoriqueOperations from "../Utilisateurs/HistoriqueOperations";




const Dashboard = () => {
  
 

  // --- RENDU ---
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-customGreen-100">Mon Tableau de Bord</h1>
     <section className="flex justify-center w-full gap-5 overflow-x-auto"> 
      <div className="flex flex-row items-center mx-4 space-y-4">
      <Userinfo />
      <PreferencesConducteur />
      </div>
      <div className="flex flex-col items-center mx-4 space-y-4"> 
      <HistoriqueOperations />
      </div>
      </section>
      < section className="flex justify-center w-full overflow-x-auto">
      <VoitureUser />
      </section>
      <section className="flex justify-center w-full overflow-x-auto">
      <VisualiserTrajets />
      </section>
      <section className="flex justify-center w-full overflow-x-auto">
      <VisualiserReservations />
      </section>
      <section className="flex justify-center w-full overflow-x-auto">
      <VisualiserAvis />
      </section>
     </div> 
        
       
  );
};  
export default Dashboard;