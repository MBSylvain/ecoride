import React, { useEffect, useState } from "react";
import axios from "axios";

const Validations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://api-ecride-production.up.railway.app/Controllers/ReservationController.php?action=to_validate",
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setReservations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des réservations");
        setLoading(false);
      });
  }, []);

  const handleValidation = (reservationId, status) => {
    axios
      .post(
        "https://api-ecride-production.up.railway.app/Controllers/ReservationController.php",
        {
          action: "validate",
          reservation_id: reservationId,
          status: status,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        setReservations(reservations.filter((r) => r.id !== reservationId));
      })
      .catch((err) => {
        alert("Erreur lors de la validation");
      });
  };

  if (loading) return <div className="p-6 text-center">Chargement...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">
        Réservations à valider
      </h2>
      {reservations.length === 0 ? (
        <p className="text-gray-500">Aucune réservation à valider.</p>
      ) : (
        <ul className="space-y-6">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="p-5 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-primary-100">
                  Informations du trajet
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <span className="font-medium">Départ :</span>{" "}
                    {reservation.trajet_depart}
                  </div>
                  <div>
                    <span className="font-medium">Arrivée :</span>{" "}
                    {reservation.trajet_arrivee}
                  </div>
                  <div>
                    <span className="font-medium">Date :</span>{" "}
                    {reservation.trajet_date}
                  </div>
                  <div>
                    <span className="font-medium">Heure :</span>{" "}
                    {reservation.trajet_heure}
                  </div>
                  <div>
                    <span className="font-medium">Prix :</span>{" "}
                    {reservation.trajet_prix} €
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-primary-100">
                  Informations du réservant
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <span className="font-medium">Nom :</span>{" "}
                    {reservation.utilisateur_nom}
                  </div>
                  <div>
                    <span className="font-medium">Prénom :</span>{" "}
                    {reservation.utilisateur_prenom}
                  </div>
                  <div>
                    <span className="font-medium">Email :</span>{" "}
                    {reservation.utilisateur_email}
                  </div>
                  <div>
                    <span className="font-medium">Téléphone :</span>{" "}
                    {reservation.utilisateur_telephone}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-medium">
                  Nombre de places réservées :
                </span>{" "}
                {reservation.nombre_places_reservees}
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleValidation(reservation.id, "valide")}
                  className="px-4 py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
                >
                  Valider
                </button>
                <button
                  onClick={() => handleValidation(reservation.id, "refuse")}
                  className="px-4 py-2 text-white transition bg-red-500 rounded hover:bg-red-600"
                >
                  Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Validations;
