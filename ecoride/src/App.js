import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Button from "./components/Button";
import Accuiel from "./pages/accueil";

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <Accuiel />
      </div>
      <Footer />
    </div>
  );
}

export default App;
