import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Button from "./components/Button";
import Accuiel from "./pages/accueil";
import About from "./pages/Aboutus";

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <About />
      </div>
      <Footer />
    </div>
  );
}

export default App;
