import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Accueil from "./pages/accueil";
import Aboutus from "./pages/Aboutus";
import Login from "./pages/login";
import RegisterPage from "./pages/RegisterPage";
import SearchPages from "./pages/SearchPage";
import Contact from "./pages/contact";
import Help from "./pages/Helpcenter";
import Privaty from "./pages/privaty";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Accueil />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/helpcenter" element={<Help />} />
          <Route path="/privaty" element={<Privaty />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
