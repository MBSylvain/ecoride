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

  // Fonction séparée pour récupérer les réservations
  const fetchReservations = async () => {
    setReservationsLoading(true);
    setError(null);
    
    try {
      console.log("Tentative de récupération des réservations pour l'utilisateur:", utilisateur_id);
      
      // Ajout du paramètre action qui est crucial
      const response = await axios.get(
        `http://localhost/api/Controllers/ReservationController.php?&utilisateur_id=${utilisateur_id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      console.log("Réponse API réservations:", response.data);
      
      // Traitement de la réponse
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
      console.error("Erreur détaillée:", error);
      if (error.response) {
        console.error("Statut:", error.response.status);
        console.error("Données:", error.response.data);
      }
      setError("Erreur lors du chargement des réservations: " + error.message);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };
  
  // useEffect appelle maintenant la fonction séparée
  useEffect(() => {
    if (utilisateur_id) {
      fetchReservations();
    }
  }, [utilisateur_id]);

  // Gestion de l'annulation d'une réservation
  const handleCancelReservation = async (reservation_id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }
    
    try {
      // Ajout du paramètre action pour la requête d'annulation
      const response = await axios.put(
        `http://localhost/api/Controllers/ReservationController.php`,
        {
          action: "put",  // Ajout de l'action
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
        // Mise à jour de l'état local
        setReservations(prevReservations => 
          prevReservations.map(res => 
            res.reservation_id === reservation_id ? {...res, statut: "annulé"} : res
          )
        );
      } else {
        alert(response.data?.message || "Une erreur s'est produite lors de l'annulation");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation", error);
      alert("Erreur de connexion au serveur");
    }
  };

  // Style conditionnel selon le statut
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "confirmé": return "bg-green-100 text-green-800";
      case "en attente": return "bg-yellow-100 text-yellow-800";
      case "annulé": return "bg-red-100 text-red-800";
      case "refusé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Afficher les détails d'une réservation
  const viewReservationDetails = (trajet_id) => {
    navigate(`/dashboard/trajet/${trajet_id}`);
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes réservations</h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      {/* Ajout d'un bouton de rafraîchissement qui tire parti de la fonction séparée */}
      <button 
        onClick={fetchReservations} 
        className="px-4 py-2 mb-4 text-sm bg-blue-100 rounded hover:bg-blue-200"
      >
        Rafraîchir les données
      </button>
      
      {reservationsLoading ? (
        <div className="p-4 text-center text-customGreen-60">Chargement...</div>
      ) : reservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">Trajet</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Places</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.reservation_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{res.ville_depart} → {res.ville_arrivee}</td>
                  <td className="px-4 py-3">{res.date_depart}</td>
                  <td className="px-4 py-3">{res.nombre_places_reservees}</td>
                  <td className="px-4 py-3">{res.nombre_places_reservees}*{res.prix} €</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full ${getStatusClass(res.statut)}`}>
                      {res.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => viewReservationDetails(res.trajet_id)}
                      className="px-3 py-1 mr-2 text-white rounded bg-primary-100 hover:bg-primary-60"
                    >
                      Détails
                    </button>
                    <Link to={`../VisualiserTrajet/${res.trajet_id}`}>Voir le trajet</Link> 
                    {res.statut.toLowerCase() !== "annulé" && res.statut.toLowerCase() !== "refusé" && (
                      <button 
                        onClick={() => handleCancelReservation(res.reservation_id)}
                        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
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
          <p>Vous n'avez pas encore effectué de réservation.</p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/search')}
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
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