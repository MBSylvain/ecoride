import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Accueil from "./pages/accueil";
import Recherche from "./pages/SearchPage";

function App() {
  return (
    <div className="App">
      <div>
        <Accueil />
        <Recherche />
        <Footer />
      </div>
    </div>
  );
}

export default App;
