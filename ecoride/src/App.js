import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Button from "./components/Button";

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <h1>Bienvenue dans mon application</h1>
        <Button />
      </div>
      <Footer />
    </div>
  );
}

export default App;
