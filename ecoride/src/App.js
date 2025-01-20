import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CardAnnonce from "./components/Card-Annonce";

function App() {
  return (
    <div className="App">
      <CardAnnonce />
      <div>
        <h1>Bienvenue dans mon application</h1>
      </div>
    </div>
  );
}

export default App;
