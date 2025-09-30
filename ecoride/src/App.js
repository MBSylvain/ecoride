import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

 // Import des composants pour les pages
import Accueil from "./pages/accueil";
import Aboutus from "./pages/Aboutus";
import Login from "./pages/login";
import Register from "./pages/register";
import SearchPages from "./pages/SearchPage";
import Contact from "./pages/contact";
import Help from "./pages/Helpcenter";
import Privaty from "./pages/privaty";

import TestApi from "./pages/testapi";
import Dashboard from "./pages/Dashboard";
import Userinfo from "./Utilisateurs/Userinfo";

import Trajetinfo from "./features/Trajetinfo";
// Import des composants pour la gestion des administrateurs
import AdminDashboard from "./AdmEmp/dashboardAdmin";
import Statistiques from "./AdmEmp/Statistiques";

// Import des composants pour la gestion des avis
import AjouterAvisModal from "./avis/AjouterAvisModal";
import VisualiserAvis from "./avis/VisualiserAvis";

// Import des composants pour la gestion des voitures
import Carinfo from "./features/Carinfo";
import UpdateVehicleForm from "./Voitures/UpdateVehicleForm";
import VoitureUser from "./Voitures/VoitureUser";

// Import des composants pour la gestion des trajets
import TrajetUser from "./Trajets/TrajetUser";
import CreateTrajetModal from "./Trajets/CreateTrajetModal";
import EditTrajetModal from "./Trajets/EditTrajetModal";
import VisualiserTrajet from "./Trajets/VisualiserTrajets";

// Import des composants pour la gestion des réservations
import Reservetrajet from "./Trajets/reservetrajet";
import Reservation from "./Reservations/ReservationUser";
import Reservations from "./Reservations/Reservations";
import VisualiserReservations from "./Reservations/VisualiserReservations";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Routes pour la gestion des pages*/}
          <Route exact path="/" element={<Accueil />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/search" element={<SearchPages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/helpcenter" element={<Help />} />
          <Route path="/privaty" element={<Privaty />} />
          {/* Routes pour la gestion des administrateurs */}
          <Route path="/AdmEmp/dashboardAdmin" element={<AdminDashboard />} />
          <Route path="/AdmEmp/statistiques" element={<Statistiques />} />

          {/* Routes pour la gestion des utilisateurs */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/testapi" element={<TestApi />} />
          <Route path="/Userinfo" element={<Userinfo />} />
          
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/Trajetinfo" element={<Trajetinfo />} />
          <Route path="/reservetrajet/:trajetId" element={<Reservetrajet />} />
          <Route path="/reservation/:userId" element={<Reservation />} />
          <Route path="/reservation/:trajetId" element={<Reservation />} />

          {/* Routes pour la gestion des Voiture */}
          <Route path="/VoitureUser" element={<VoitureUser />} />
          <Route path="/Carinfo" element={<Carinfo />} />
          <Route path="/UpdateVehicleForm/:voitureId" element={<UpdateVehicleForm />} />


          {/* Routes pour la gestion des Avis */}
          <Route path="/VisualiserAvis" element={<VisualiserAvis />} />
          <Route path="/AjouterAvisModal" element={<AjouterAvisModal />} />

          {/* Routes pour la gestion des Réservations */}
          <Route path="/Reservations" element={<Reservations />} />
          <Route path="/VisualiserReservations" element={<VisualiserReservations />} />



          {/* Routes pour la gestion des trajets */}
          <Route path="/trajets" element={<TrajetUser />} />
          <Route path="/trajets/:trajetId" element={<TrajetUser />} />
          <Route path="/VisualiserTrajet" element={<VisualiserTrajet />} />
          <Route path="/trajets/create" element={<CreateTrajetModal isOpen={true} />} />
          <Route path="/trajets/edit/:trajetId" element={<EditTrajetModal isOpen={true} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
