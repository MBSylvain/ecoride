import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/PrivateRoute";

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
// Import des composants pour la gestion des utilisateurs
import Dashboard from "./pages/Dashboard";
import Userinfo from "./Utilisateurs/Userinfo";
import PreferencesConducteur from "./Utilisateurs/PreferencesConducteur";
import HistoriqueOperations from "./Utilisateurs/HistoriqueOperations";

import Trajetinfo from "./features/Trajetinfo";
// Import des composants pour la gestion des administrateurs
import AdminDashboard from "./AdmEmp/dashboardAdmin";
import Statistiques from "./AdmEmp/Statistiques";
import StatistiquesUtilisateurs from "./AdmEmp/Statistiques/StatistiquesUtilisateurs";
import StatistiquesTrajets from "./AdmEmp/Statistiques/StatistiquesTrajets";
import StatistiquesCredits from "./AdmEmp/Statistiques/StatistiquesCredits";
import StatistiquesAvis from "./AdmEmp/Statistiques/StatistiquesAvis";
import StatistiquesEmployes from "./AdmEmp/Statistiques/StatistiquesEmployes";
import StatistiquesReservations from "./AdmEmp/Statistiques/StatistiquesReservations";
import StatistiquesVoitures from "./AdmEmp/Statistiques/StatistiquesVoitures";

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
          {/* Routes Protégées */}
          <Route path="/AdmEmp/dashboardAdmin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/AdmEmp/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />

          <Route path="/AdmEmp/statistiques/statistiquesutilisateurs" element={<ProtectedRoute><StatistiquesUtilisateurs /></ProtectedRoute>} />
          <Route path="/AdmEmp/statistiques/statistiquestrajets" element={<ProtectedRoute><StatistiquesTrajets /></ProtectedRoute>} />
          <Route path="/AdmEmp/statistiques/statistiquescredits" element={<ProtectedRoute><StatistiquesCredits /></ProtectedRoute>} />
          <Route path="/AdmEmp/statistiques/statistiquesavis" element={<ProtectedRoute><StatistiquesAvis /></ProtectedRoute>} />
          <Route path="/AdmEmp/statistiques/statistiquesemployes" element={<ProtectedRoute><StatistiquesEmployes /></ProtectedRoute>} />

          <Route path="/admin/statistiques/statistiquesreservations" element={<ProtectedRoute><StatistiquesReservations /></ProtectedRoute>} />
          <Route path="/admin/statistiques/statistiquesvoitures" element={<ProtectedRoute><StatistiquesVoitures /></ProtectedRoute>} />



          {/* Routes pour la gestion des utilisateurs */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           {/* Routes Protégées */}

          <Route path="/testapi" element={<ProtectedRoute><TestApi /></ProtectedRoute>} />
          <Route path="/Userinfo" element={<ProtectedRoute><Userinfo /></ProtectedRoute>} />
          <Route path="/PreferencesConducteur" element={<ProtectedRoute><PreferencesConducteur /></ProtectedRoute>} />
          <Route path="/HistoriqueOperations" element={<ProtectedRoute><HistoriqueOperations /></ProtectedRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/Trajetinfo" element={<ProtectedRoute><Trajetinfo /></ProtectedRoute>} />
          <Route path="/reservetrajet/:trajetId" element={<ProtectedRoute><Reservetrajet /></ProtectedRoute>} />
          <Route path="/reservation/:userId" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
          <Route path="/reservation/:trajetId" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />

          {/* Routes pour la gestion des Voiture */}
          <Route path="/VoitureUser" element={<ProtectedRoute><VoitureUser /></ProtectedRoute>} />
          <Route path="/Carinfo" element={<ProtectedRoute><Carinfo /></ProtectedRoute>} />
          <Route path="/UpdateVehicleForm/:voitureId" element={<ProtectedRoute><UpdateVehicleForm /></ProtectedRoute>} />


          {/* Routes pour la gestion des Avis */}
          <Route path="/VisualiserAvis" element={<ProtectedRoute><VisualiserAvis /></ProtectedRoute>} />
          <Route path="/AjouterAvisModal" element={<ProtectedRoute><AjouterAvisModal /></ProtectedRoute>} />

          {/* Routes pour la gestion des Réservations */}
          <Route path="/Reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          <Route path="/VisualiserReservations" element={<ProtectedRoute><VisualiserReservations /></ProtectedRoute>} />



          {/* Routes pour la gestion des trajets */}
          <Route path="/trajets" element={<ProtectedRoute><TrajetUser /></ProtectedRoute>} />
          <Route path="/trajets/:trajetId" element={<ProtectedRoute><TrajetUser /></ProtectedRoute>} />
          <Route path="/VisualiserTrajet" element={<ProtectedRoute><VisualiserTrajet /></ProtectedRoute>} />
          <Route path="/trajets/create" element={<ProtectedRoute><CreateTrajetModal isOpen={true} /></ProtectedRoute>} />
          <Route path="/trajets/edit/:trajetId" element={<ProtectedRoute><EditTrajetModal isOpen={true} /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
