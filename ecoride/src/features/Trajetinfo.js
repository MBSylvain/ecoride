import React from 'react';
import { Link } from 'react-router-dom';

const TripsSection = ({ trajets, trajetsLoading, onEditTrip }) => {
  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes trajets récents</h2>
      {trajetsLoading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : trajets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">Départ</th>
                <th className="px-4 py-3 text-left">Arrivée</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Prix</th>
                <th className="px-4 py-3 text-left">Places</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map((trajet) => (
                <tr key={trajet.trajet_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{trajet.ville_depart}</td>
                  <td className="px-4 py-3">{trajet.ville_arrivee}</td>
                  <td className="px-4 py-3">{trajet.date_depart}</td>
                  <td className="px-4 py-3">{trajet.prix} €</td>
                  <td className="px-4 py-3">{trajet.nombre_places}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onEditTrip(trajet)} className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">Détails</button>
                    <Link to={`/dashboard/reservations/${trajet.trajet_id}`} className="ml-2 text-green-600 hover:text-green-800">Réservations</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Link to="/dashboard/trajet/ajouter" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Proposer un trajet</Link>
          </div>
        </div>
      ) : (
        <>
          <p>Vous n'avez pas encore proposé de trajet.</p>
          <div className="mt-4">
            <Link to="/dashboard/trajet/ajouter" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
              Proposer un trajet
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default TripsSection;