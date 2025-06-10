import React from 'react';
import { Link } from 'react-router-dom';

const ReservationsSection = ({ reservations, reservationsLoading }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmé": return "bg-green-100 text-green-800";
      case "en attente": return "bg-yellow-100 text-yellow-800";
      case "annulé": return "bg-red-100 text-red-800";
      case "refusé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes réservations</h2>
      {reservationsLoading ? (
        <div className="p-4 text-center">Chargement...</div>
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
                  <td className="px-4 py-3">{res.montant_total} €</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full ${getStatusClass(res.statut)}`}>
                      {res.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* Actions */}
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
            <Link to="/trajets" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
              Rechercher un trajet
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationsSection;