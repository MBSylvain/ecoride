import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ReservationsSection = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");

  const fetchReservations = async () => {
    setReservationsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api-ecride-production.up.railway.app/api/Controllers/ReservationController.php?&utilisateur_id=${utilisateur_id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.data && typeof response.data === 'object') {
        if (response.data.reservations) {
          setReservations(Array.isArray(response.data.reservations) ? response.data.reservations : []);
        } else {
          setReservations(Array.isArray(response.data) ? response.data : []);
        }
      } else {
        setReservations([]);
      }
    } catch (error) {
      setError("Erreur lors du chargement des réservations: " + error.message);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    if (utilisateur_id) {
      fetchReservations();
    }
  }, [utilisateur_id]);

  const handleCancelReservation = async (reservation_id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }
    try {
      const response = await axios.put(
        `https://api-ecride-production.up.railway.app/api/Controllers/ReservationController.php`,
        {
          action: "put",
          reservation_id: reservation_id,
          statut: "annulée",
          utilisateur_id: utilisateur_id
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.data && response.data.success) {
        setReservations(prevReservations =>
          prevReservations.map(res =>
            res.reservation_id === reservation_id ? { ...res, statut: "annulée" } : res
          )
        );
      } else {
        alert(response.data?.message || "Une erreur s'est produite lors de l'annulation");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur");
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "confirmé": return "bg-customGreen2-100 text-white";
      case "en attente": return "bg-yellow-400 text-black";
      case "annulée": return "bg-red-500 text-white";
      case "refusé": return "bg-gray-300 text-gray-800";
      default: return "bg-primary-100 text-white";
    }
  };

  const viewReservationDetails = (trajet_id) => {
    navigate(`/dashboard/trajet/${trajet_id}`);
  };

  return (
    <div className="p-6 mb-6 font-sans bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-primary-100">Mes réservations</h2>
      {error && (
        <div className="p-3 mb-4 text-sm font-semibold text-white bg-red-500 rounded-md shadow-md">
          {error}
        </div>
      )}
      <button
        onClick={fetchReservations}
        className="px-4 py-2 mb-4 text-sm font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
      >
        Rafraîchir les données
      </button>
      {reservationsLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : reservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-3 font-semibold text-left text-primary-100">Trajet</th>
                <th className="px-4 py-3 font-semibold text-left text-primary-100">Date</th>
                <th className="px-4 py-3 font-semibold text-left text-primary-100">Places</th>
                <th className="px-4 py-3 font-semibold text-left text-primary-100">Montant</th>
                <th className="px-4 py-3 font-semibold text-left text-primary-100">Statut</th>
                <th className="px-4 py-3 font-semibold text-left text-primary-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.reservation_id} className="border-b hover:bg-customGrey-100">
                  <td className="px-4 py-3">{res.ville_depart} → {res.ville_arrivee}</td>
                  <td className="px-4 py-3">{res.date_depart}</td>
                  <td className="px-4 py-3">{res.nombre_places_reservees}</td>
                  <td className="px-4 py-3">{res.nombre_places_reservees} × {res.prix} €</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full font-bold ${getStatusClass(res.statut)}`}>
                      {res.statut}
                    </span>
                  </td>
                  <td className="flex flex-wrap gap-2 px-4 py-3">
                    <button
                      onClick={() => viewReservationDetails(res.trajet_id)}
                      className="px-3 py-1 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                    >
                      Détails
                    </button>
                    <Link
                      to={`../VisualiserTrajet/${res.trajet_id}`}
                      className="px-3 py-1 font-bold text-customGreen2-100 hover:underline"
                    >
                      Voir le trajet
                    </Link>
                    {res.statut.toLowerCase() !== "annulée" && res.statut.toLowerCase() !== "refusé" && (
                      <button
                        onClick={() => handleCancelReservation(res.reservation_id)}
                        className="px-3 py-1 font-bold text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
                      >
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="p-4 text-center text-gray-600 rounded-lg bg-customGrey-100">
            Vous n'avez pas encore effectué de réservation.
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate('/search')}
              className="px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
            >
              Rechercher un trajet
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationsSection;