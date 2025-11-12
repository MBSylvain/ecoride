import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

// Simule la récupération de l'utilisateur connecté (à remplacer par ton auth context)
const getUserId = () => localStorage.getItem("utilisateur_id") || 1;

const statusClass = (statut) => {
  switch (statut) {
    case "confirmé": return "bg-green-100 text-green-800";
    case "en attente": return "bg-yellow-100 text-yellow-800";
    case "annulé": return "bg-red-100 text-red-800";
    case "refusé": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const DashboardReservations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const utilisateur_id = getUserId();

  // States
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationData, setReservationData] = useState(null);
  const [trajet, setTrajet] = useState(null);
  const [isConductor, setIsConductor] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérification de l'authentification
    useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://api-ecride-production.up.railway.app/api/Controllers/CheckAuth.php",
          { withCredentials: true }
        );
  
        if (!response.data.authenticated) {
          navigate("/login");
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de l'authentification");
      }
    };
  
    checkAuth();
  }, []);

  // Helpers pour API
  const fetchReservations = async () => {
    setLoading(true);
    setReservationData(null);
    setTrajet(null);
    setIsConductor(false);
    setMessage("");
    setMessageType("");
    // Option 1: Détail d'une réservation
    if (searchParams.get("reservation_id")) {
      const id = searchParams.get("reservation_id");
      const res = await fetch(`https://api-ecride-production.up.railway.app/ecoride-apie/Controllers/ReservationController.php?reservation_id=${id}&utilisateur_id=${utilisateur_id}`);
      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
        setMessageType("danger");
      } else {
        setReservationData(data.reservation);
        setTrajet(data.trajet);
        setIsConductor(data.is_conductor);
      }
      setLoading(false);
      return;
    }
    // Option 2: Liste des réservations pour un trajet (conducteur)
    if (searchParams.get("trajet_id")) {
      const id = searchParams.get("trajet_id");
      const res = await fetch(`https://api-ecride-production.up.railway.app/ecoride-apie/Controllers/ReservationController.php?trajet_id=${id}&utilisateur_id=${utilisateur_id}`);
      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
        setMessageType("danger");
      } else {
        setReservations(data.reservations || []);
        setTrajet(data.trajet);
        setIsConductor(true);
      }
      setLoading(false);
      return;
    }
    // Option 3: Liste des réservations de l'utilisateur
    const res = await fetch(`https://api-ecride-production.up.railway.app/ecoride-apie/Controllers/ReservationController.php?utilisateur_id=${utilisateur_id}`);
    const data = await res.json();
    setReservations(data.reservations || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, [searchParams]);

  // Actions (confirmer, refuser, annuler)
  const handleAction = async (action, id) => {
    if (action === "annuler" && !window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;
    setMessage("");
    setMessageType("");
    const res = await fetch(`https://api-ecride-production.up.railway.app/ecoride-apie/Controllers/ReservationController.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reservation_id: id, utilisateur_id }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(data.success);
      setMessageType("success");
      fetchReservations();
    } else {
      setMessage(data.error || "Erreur lors de l'action.");
      setMessageType("danger");
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  // Option 1: Détail d'une réservation
  if (reservationData && trajet) {
    const rd = reservationData;
    const canConfirm = isConductor && rd.statut === "en attente";
    const canRefuse = isConductor && rd.statut === "en attente";
    const canAnnuler = (isConductor || rd.utilisateur_id === Number(utilisateur_id)) && rd.statut !== "annulé";
    const showContact = rd.statut === "confirmé";
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour
          </button>
        </div>
        {message && (
          <div className={`mb-6 p-4 rounded-md ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="p-4 text-white bg-blue-600">
            <h1 className="text-xl font-bold">Détails de la réservation #{rd.reservation_id}</h1>
            <p>{trajet.ville_depart} → {trajet.ville_arrivee}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            {/* Infos réservation */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Informations sur le trajet</h2>
              <div className="mb-4">
                <p className="mb-2 text-gray-700"><strong>Date et heure de départ:</strong> {new Date(trajet.date_depart + "T" + trajet.heure_depart).toLocaleString("fr-FR")}</p>
                <p className="mb-2 text-gray-700"><strong>Prix par place:</strong> {Number(trajet.prix).toFixed(2)} €</p>
                <p className="mb-2 text-gray-700"><strong>Statut actuel:</strong>
                  <span className={`px-2 py-1 rounded-full text-xs ml-2 ${statusClass(rd.statut)}`}>
                    {rd.statut.charAt(0).toUpperCase() + rd.statut.slice(1)}
                  </span>
                </p>
              </div>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Détails de la réservation</h2>
              <div className="mb-4">
                <p className="mb-2 text-gray-700"><strong>Places réservées:</strong> {rd.nombre_places_reservees}</p>
                <p className="mb-2 text-gray-700"><strong>Montant total:</strong> {Number(rd.montant_total).toFixed(2)} €</p>
                <p className="mb-2 text-gray-700"><strong>Date de réservation:</strong> {new Date(rd.date_reservation).toLocaleString("fr-FR")}</p>
                {rd.date_confirmation && (
                  <p className="mb-2 text-gray-700"><strong>Date de confirmation:</strong> {new Date(rd.date_confirmation).toLocaleString("fr-FR")}</p>
                )}
                <p className="mb-2 text-gray-700"><strong>Bagages:</strong> {rd.bagages ? "Oui" : "Non"}</p>
                {rd.commentaire && (
                  <p className="mb-2 text-gray-700"><strong>Commentaire:</strong> {rd.commentaire}</p>
                )}
              </div>
            </div>
            {/* Coordonnées et actions */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Coordonnées du {isConductor ? "passager" : "conducteur"}
              </h2>
              <div className="p-4 mb-6 rounded-lg bg-gray-50">
                <p className="mb-2 text-gray-700"><strong>Nom:</strong> {rd.other_user_name}</p>
                {showContact ? (
                  <>
                    <p className="mb-2 text-gray-700"><strong>Email:</strong> <a href={`mailto:${rd.other_user_email}`} className="text-blue-600 hover:text-blue-800">{rd.other_user_email}</a></p>
                    {rd.other_user_tel && (
                      <p className="mb-2 text-gray-700"><strong>Téléphone:</strong> <a href={`tel:${rd.other_user_tel}`} className="text-blue-600 hover:text-blue-800">{rd.other_user_tel}</a></p>
                    )}
                  </>
                ) : (
                  <p className="text-sm italic text-gray-600">Les coordonnées complètes seront disponibles après confirmation de la réservation.</p>
                )}
              </div>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Actions</h2>
              <div className="space-y-2">
                {canConfirm && (
                  <button onClick={() => handleAction("confirmer", rd.reservation_id)} className="px-4 py-2 mr-2 text-white bg-green-600 rounded hover:bg-green-700">
                    Confirmer
                  </button>
                )}
                {canRefuse && (
                  <button onClick={() => handleAction("refuser", rd.reservation_id)} className="px-4 py-2 mr-2 text-white bg-red-600 rounded hover:bg-red-700">
                    Refuser
                  </button>
                )}
                {canAnnuler && (
                  <button onClick={() => handleAction("annuler", rd.reservation_id)} className="px-4 py-2 mr-2 text-white bg-gray-600 rounded hover:bg-gray-700">
                    Annuler la réservation
                  </button>
                )}
                <Link to={`/trajets/${trajet.trajet_id}`} className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Voir les détails du trajet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Option 2: Liste des réservations pour un trajet (conducteur)
  if (trajet && isConductor) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour
          </button>
        </div>
        {message && (
          <div className={`mb-6 p-4 rounded-md ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="p-4 text-white bg-blue-600">
            <h1 className="text-xl font-bold">Réservations pour le trajet : {trajet.ville_depart} → {trajet.ville_arrivee}</h1>
            <p>Date de départ : {new Date(trajet.date_depart + "T" + trajet.heure_depart).toLocaleString("fr-FR")}</p>
          </div>
          <div className="p-6 overflow-x-auto">
            {reservations.length === 0 ? (
              <p className="text-gray-600">Aucune réservation pour ce trajet pour le moment.</p>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Passager</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Places</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((res) => (
                    <tr key={res.reservation_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{res.passager_nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{res.nombre_places_reservees}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{Number(res.montant_total).toFixed(2)} €</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusClass(res.statut)}`}>
                          {res.statut.charAt(0).toUpperCase() + res.statut.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(res.date_reservation).toLocaleDateString("fr-FR")}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSearchParams({ reservation_id: res.reservation_id })} className="mr-3 text-blue-600 hover:text-blue-900">Détails</button>
                        {res.statut === "en attente" && (
                          <>
                            <button onClick={() => handleAction("confirmer", res.reservation_id)} className="mr-3 text-green-600 hover:text-green-900">Confirmer</button>
                            <button onClick={() => handleAction("refuser", res.reservation_id)} className="text-red-600 hover:text-red-900">Refuser</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Option 3: Liste des réservations de l'utilisateur
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au tableau de bord
        </Link>
      </div>
      {message && (
        <div className={`mb-6 p-4 rounded-md ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-4 text-white bg-blue-600">
          <h1 className="text-xl font-bold">Mes réservations</h1>
        </div>
        <div className="p-6 overflow-x-auto">
          {reservations.length === 0 ? (
            <>
              <p className="text-gray-600">Vous n'avez pas encore de réservation.</p>
              <div className="mt-4">
                <Link to="/trajets" className="inline-block px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                  Rechercher un trajet
                </Link>
              </div>
            </>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Trajet</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Places</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservations.map((res) => {
                  const isPast = new Date(res.date_depart) < new Date();
                  return (
                    <tr key={res.reservation_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{res.ville_depart} → {res.ville_arrivee}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(res.date_depart + "T" + res.heure_depart).toLocaleString("fr-FR")}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{res.nombre_places_reservees}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{Number(res.montant_total).toFixed(2)} €</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusClass(res.statut)}`}>
                          {res.statut.charAt(0).toUpperCase() + res.statut.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSearchParams({ reservation_id: res.reservation_id })} className="mr-3 text-blue-600 hover:text-blue-900">Détails</button>
                        {!isPast && res.statut === "en attente" && (
                          <button onClick={() => handleAction("annuler", res.reservation_id)} className="text-red-600 hover:text-red-900">Annuler</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardReservations;