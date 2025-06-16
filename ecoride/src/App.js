import React from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
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
import Userinfo from "./features/Userinfo"; 
import Carinfo from "./features/Carinfo"; // Assurez-vous que ce chemin est correct
import UpdateVehicleForm from "./features/UpdateVehicleForm"; // Assurez-vous que ce chemin est correct

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Accueil />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/helpcenter" element={<Help />} />
          <Route path="/privaty" element={<Privaty />} />
          <Route path="/testapi" element={<TestApi />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Userinfo" element={<Userinfo />} />
          <Route path="/Carinfo" element={<Carinfo />} />
          <Route path="/UpdateVehicleForm/:voitureId" element={<UpdateVehicleForm />} />          
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
