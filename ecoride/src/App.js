import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <h1>Bienvenue dans mon application</h1>
      </div>
      <Footer />
    </div>
  );
}

export default App;
