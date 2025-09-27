import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
import Carinfo from "./features/Carinfo";
import UpdateVehicleForm from "./features/UpdateVehicleForm";
import Trajetinfo from "./features/Trajetinfo";
import Reservations from "./Reservations/Reservations";
import Reservetrajet from "./pages/reservetrajet";
import VisualiserTrajet from "./Trajets/VisualiserTrajets";
import Reservation from "./Reservations/ReservationUser";
import VisualiserReservations from "./Reservations/VisualiserReservations";

// Import des composants pour la gestion des trajets
import TrajetUser from "./Trajets/TrajetUser";
import CreateTrajetModal from "./Trajets/CreateTrajetModal";
import EditTrajetModal from "./Trajets/EditTrajetModal";


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

          {/* Routes pour la gestion des utilisateurs */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/testapi" element={<TestApi />} />
          <Route path="/Userinfo" element={<Userinfo />} />
          

          <Route path="/Trajetinfo" element={<Trajetinfo />} />
          <Route path="/reservetrajet/:trajetId" element={<Reservetrajet />} />
          <Route path="/reservation/:userId" element={<Reservation />} />
          <Route path="/reservation/:trajetId" element={<Reservation />} />

          {/* Routes pour la gestion des Voiture */}
          <Route path="/Carinfo" element={<Carinfo />} />
          <Route path="/UpdateVehicleForm/:voitureId" element={<UpdateVehicleForm />} />


          {/* Routes pour la gestion des Avis */}

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
