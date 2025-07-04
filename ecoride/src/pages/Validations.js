import React, { useEffect, useState } from "react";
import axios from "axios";

const Validations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Utilise le bon chemin de ton API PHP
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
    // status: 'valide' ou 'refuse'
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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Réservations à valider</h2>
      {reservations.length === 0 ? (
        <p>Aucune réservation à valider.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id} style={{ marginBottom: "1em" }}>
              <div>
                <strong>Trajet :</strong> {reservation.trajet}
              </div>
              <div>
                <strong>Réservé par :</strong> {reservation.utilisateur}
              </div>
              <button
                onClick={() => handleValidation(reservation.id, "valide")}
              >
                Valider
              </button>
              <button
                onClick={() => handleValidation(reservation.id, "refuse")}
                style={{ marginLeft: "1em" }}
              >
                Refuser
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Validations;
