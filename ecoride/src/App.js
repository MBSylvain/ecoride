import React from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Accueil from "./pages/accueil";

function App() {
  return (
    <div className="App">
      <div>
        <Header />
        <Accueil />
        <Footer />
      </div>
    </div>
  );
}

export default App;
