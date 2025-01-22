import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CardAnnonce from "./components/Card-Annonce";
import Cardfiltre from "./components/Card-filtre";

function App() {
  return (
    <div className="App">
      <CardAnnonce />
      <Header />
      <div>
        <h1>Bienvenue dans mon application</h1>
        <Cardfiltre />
      </div>
    </div>
  );
}

export default App;
