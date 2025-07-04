import React, { useEffect, useState } from "react";
import axios from "axios";

const Validations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "http://localhost/api/Controllers/ReservationController.php?action=to_validate",
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
        "http://localhost/api/Controllers/ReservationController.php",
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
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
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
              className="border border-gray-200 rounded-lg p-5 bg-gray-50"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-primary-100 mb-2">
                  Informations du trajet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                <h3 className="font-semibold text-lg text-primary-100 mb-2">
                  Informations du réservant
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Valider
                </button>
                <button
                  onClick={() => handleValidation(reservation.id, "refuse")}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
