import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Button from "./components/Button";
import Accuiel from "./pages/accueil";
import Profil from "./pages/profil";
import Document from "./pages/documents";
import Prefere from "./pages/preferenceProfil";
import Infocar from "./pages/InfoVéhicule";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="xl:flex-col md:flex-row container mx-auto px-4">
        <Profil />
        <Infocar />
        <Prefere />
      </div>
      <Footer />
    </div>
  );
}

export default App;
