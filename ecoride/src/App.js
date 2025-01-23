import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CardAnnonce from "./components/Card-Annonce";
import CardTrajet from "./components/Card-trajet";
import CardAvis from "./components/CardAvisTrajets";

function App() {
  return (
    <div className="App">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <CardAnnonce />
        <CardTrajet />
        <CardAvis text="emplacement du texte" />
        <div>
          <h1>Bienvenue dans mon application</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
