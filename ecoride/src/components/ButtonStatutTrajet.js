import React, { useState } from "react";
import axios from "axios";

const BoutonStatutTrajet = ({ trajet }) => {
  const [statut, setStatut] = useState(trajet.statut);

  // Fonction pour passer au statut suivant
  const changerStatut = async () => {
    let nouveauStatut = "";
    if (statut === "planifié") {
      nouveauStatut = "en_cours";
    } else if (statut === "en_cours") {
      nouveauStatut = "terminé";
    } else {
      return;
    }

    try {
      const response = await axios.post(
        "https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php",
        {
          trajet_id: trajet.trajet_id,
          statut: nouveauStatut,
          action: "STATUTS"
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      if (response.data && response.data.success) {
        setStatut(response.data.status); // statut confirmé par le backend
        alert("Statut du trajet mis à jour !");
      } else {
        alert(response.data.message || "Erreur lors du changement de statut.");
      }
    } catch (err) {
      alert("Erreur lors du changement de statut.");
    }
  };

  // Texte du bouton selon le statut
  let boutonTexte = "";
  if (statut === "planifié") boutonTexte = "Démarrer le trajet";
  else if (statut === "en_cours") boutonTexte = "Arrivée à destination";
  else boutonTexte = "Trajet terminé";

  return (
    <button
      className={`px-4 py-2 rounded font-semibold ${
        statut === "terminé"
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-customGreen-100 text-white hover:bg-customGreen-200"
      }`}
      onClick={changerStatut}
      disabled={statut === "terminé"}
    >
      {boutonTexte}
    </button>
  );
};

export default BoutonStatutTrajet;